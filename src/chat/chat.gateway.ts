/*eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable prettier/prettier */
import { UserService } from './../users/users.service';
import { CreateMessageDto } from './../messages/dto/CreateMessage.dto';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server,Socket } from 'socket.io';
import {  Logger, NotFoundException } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { RequestActions } from 'src/users/dto/RequestActions.dto';
import { json } from 'stream/consumers';
import { throwError } from 'rxjs';


//http://localhost:4200/
const DEFAULT_PORT: number = 81; // Puerto predeterminado si no se proporciona uno a través de process.env
    const PORT: number = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT, 10) : DEFAULT_PORT;
@WebSocketGateway(PORT,{cors:{origin:'*',credentials:true}})
export class ChatGateway implements OnGatewayDisconnect,OnGatewayConnection,OnGatewayInit {

    @WebSocketServer()
    public server: Server;

  constructor(private readonly ChatService: ChatService,private UserService:UserService,private MessageService:MessagesService) {}
  afterInit(server: any) {
    Logger.log('El servidor inicio correctamente')
  }
  handleConnection(client: any, ...args: any[]) {
    try {
      // Aquí, puedes escuchar el evento personalizado del cliente
      client.on('cliente_conectado', async (data: any) => {
        const user=await this.ChatService.ConnectUser(data.User.uid, client.id);
        //conectar usuario a salar de amigos
        if(user){
          if (user.Friends&&user.Friends.length>0) {
            user.Friends.forEach(room => {
              client.join(`room_${room.ChatId}`)  
              const SocketId=this.ChatService.GetSocketId(room.FriendId)
               const targetSocket = this.server.sockets.sockets.get(SocketId);
              if (targetSocket) {
              targetSocket.emit('handle_friend_status', {userid:user.uid,IsActive:user.IsActive});
             }  
            });  
          }
        }
        
        client.emit('UserWelcome',{displayName:data.User.displayName,photoURL:data.User.photoURL})
      });
    } catch (error) {
      throw error;
    }
  }
async handleDisconnect(client: any) {
  const user=await this.ChatService.DisconectUser(client.id)
  if(user){
    user.Friends.forEach(element => {
    const SocketId=this.ChatService.GetSocketId(element.FriendId)
    const targetSocket = this.server.sockets.sockets.get(SocketId);
    if (targetSocket) {
      targetSocket.emit('handle_friend_status', {userid:user.uid,IsActive:user.IsActive});
    }  
  });

  }
}
  //@UseGuards(WSGuard)
  @SubscribeMessage('sent_message') //TODO Backend
  async handleIncommingMessage(
    client: Socket,
    payload: CreateMessageDto,
  ) {
    try{
      const { chatId ,emitterId,ReceptorId} = payload;
    if (!chatId) {
      throw new NotFoundException()
    }
    //Valida si el receptor esta en el haciendo focus en el mismo chat que el emisor
    const IsReceptorInChat:boolean=this.ChatService.GetChatId[emitterId]===this.ChatService.GetChatId[ReceptorId]
    const messageSave=await this.MessageService.saveMessage(payload)
    const {IsRead,Time}=messageSave
    this.server.to(`room_${chatId}`).emit('new_message',{...payload,IsRead,Time});
    }catch(error){
      throw error
    }
    
  }
  //@UseGuards(WSGuard)
  @SubscribeMessage('join_chat')
  async JoinChat(@ConnectedSocket() client: Socket,@MessageBody() info:{chatid:string,uid:string}) {
    const resp =await this.MessageService.UpdateMessages(info.chatid)
    this.ChatService.JoinChat(info.chatid,info.uid)
    if (resp.includes('dia')) {
    this.server.to(`room_${info.chatid}`).emit('on_chat',null);
    }
    else{
    this.server.to(`room_${info.chatid}`).emit('on_chat',true);
    }
  }
  @SubscribeMessage('On_Typing')
  async TypingInChat(@ConnectedSocket() client: Socket,@MessageBody() info:{chatid:string,uid:string,Istyping:boolean}) {
    const FriendSocketId=this.ChatService.GetSocketId(info.uid)
    const targetFriend = this.server.sockets.sockets.get(FriendSocketId);
    if (targetFriend) {
      targetFriend.emit('typing', {chatid:info.chatid,Istyping:info.Istyping});
    }
  }
  //@UseGuards(WSGuard)
  @SubscribeMessage('logout')
  Logout(@ConnectedSocket() client: Socket) {
    this.handleDisconnect(client)
    client.disconnect()
  }

  //@UseGuards(WSGuard)
  @SubscribeMessage('Cancel_R')
  async CancelRequest(@ConnectedSocket() client:Socket,@MessageBody() body:RequestActions){
    try {
    //Se realiza la camcelacion en BD
    await this.UserService.CancelRequest(body)
    const SocketId=this.ChatService.GetSocketId(body.ReceptorId)
    const targetSocket = this.server.sockets.sockets.get(SocketId);
    if (targetSocket) {
      targetSocket.emit('request_cancel', body.EmmitterId);
    }  
    } catch (error) {
     throw new Error(error) 
    }
    
  }
 // @UseGuards(WSGuard)
  @SubscribeMessage('Accept_R')
  async AcceptRequest(@ConnectedSocket() client:Socket,@MessageBody() body:RequestActions){
    //Se actualizan los listados de amigos de los usuarios
    const UserEmmitter=await this.UserService.UpdateFriendslist({NewFriendId:body.ReceptorId,userId:body.EmmitterId})
    const UserRemittent=await this.UserService.GetUserbyId(body.ReceptorId)
      const EmmitterMessage=this.ChatService.getNotifyMessage({displayName:UserRemittent.displayName,photoURL:UserRemittent.photoURL},'Nuevo chat')
    client.emit('new_friend',{friend:UserEmmitter.Friends[UserEmmitter.Friends.length-1],Message:EmmitterMessage})
    client.join(`room_${UserEmmitter.Friends[UserEmmitter.Friends.length-1].ChatId}`)
    //Se obtienen los id para enviar la info
    const FriendSocketId=this.ChatService.GetSocketId(body.ReceptorId)
    const targetFriend = this.server.sockets.sockets.get(FriendSocketId);
    if (targetFriend) {
      //  Armar mensaje
      const RemmitentMessage=this.ChatService.getNotifyMessage({displayName:UserEmmitter.displayName,photoURL:UserEmmitter.photoURL},'Nuevo amigo')
      // Enviar el mensaje al usuario específico
      targetFriend.join(`room_${UserRemittent.Friends[UserRemittent.Friends.length-1].ChatId}`)
      targetFriend.emit('new_friend', {friend:UserRemittent.Friends[UserRemittent.Friends.length-1],Message:RemmitentMessage}); 
    }
  }
 // @UseGuards(WSGuard)
  @SubscribeMessage('Reject_R')
  async RejectRequest(@ConnectedSocket()client:Socket,@MessageBody() body:RequestActions){
    const {EmmitterId,ReceptorId}=body
    //Se realiza la camcelacion en BD
    await this.UserService.CancelRequest({EmmitterId:ReceptorId,ReceptorId:EmmitterId})
    const SocketId=this.ChatService.GetSocketId(ReceptorId)
    const targetSocket = this.server.sockets.sockets.get(SocketId);
    const User=await this.UserService.GetUserbyId(EmmitterId)
    if (targetSocket) {
      const RemmitentMessage=this.ChatService.getNotifyMessage({displayName:User.displayName,photoURL:User.photoURL},'Rechazo')
      targetSocket.emit('request_reject', {uid:EmmitterId,message:RemmitentMessage});
    }
  }
  //@UseGuards(WSGuard)
  @SubscribeMessage('Sent_R')
  async SentRequest(@ConnectedSocket()client:Socket,@MessageBody() body:RequestActions){
    try {
      const Emmitter=await this.UserService.sendRequest(body)
      const Receptor=await this.UserService.GetUserbyId(body.ReceptorId)
      const SocketId=this.ChatService.GetSocketId(body.ReceptorId)
      const targetSocket = this.server.sockets.sockets.get(SocketId);
      if (targetSocket) {
        //  Armar mensaje
        const content=this.ChatService.getNotifyMessage({displayName:Emmitter.displayName,photoURL:Emmitter.photoURL},'Solicitud')
        // Enviar el mensaje al usuario 
        targetSocket.emit('new_request', {req:Receptor.FriendshipRequest[Receptor.FriendshipRequest.length-1],message:content});
      }  
    } catch (error) {
      throw new Error(error)
    }
    
  }
  @SubscribeMessage('cliente_conectado')
  async connectUser(@ConnectedSocket() client:Socket,@MessageBody() data:any){
      const user=await this.ChatService.ConnectUser(data.User.uid, client.id);
      //conectar usuario a salar de amigos
       user.Friends.forEach(room => {
         client.join(`room_${room.ChatId}`)  
         const SocketId=this.ChatService.GetSocketId(room.FriendId)
  const targetSocket = this.server.sockets.sockets.get(SocketId);
  if (targetSocket) {
    targetSocket.emit('handle_friend_status', {userid:user.uid,IsActive:user.IsActive});
  }  
       });
      client.emit('UserWelcome',{displayName:data.User.displayName,photoURL:data.User.photoURL})

  }
  
  
}
