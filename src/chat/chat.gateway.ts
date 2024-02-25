import { UserService } from './../users/users.service';
import { WSGuard } from './guards/ws.guard';
import { CreateMessageDto } from './../messages/dto/CreateMessage.dto';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server,Socket } from 'socket.io';
import { NotAcceptableException, NotFoundException, OnModuleInit, UseGuards, CallHandler } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User } from 'src/users/entity/user.entity';
import { NotifyProps } from './interfaces/NotifyRemitten.interface';
import { MessagesService } from 'src/messages/messages.service';


//http://localhost:4200/
@WebSocketGateway(80,{cors:"*",cookie:true})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect {

    @WebSocketServer()
    public server: Server;

  constructor(private readonly ChatService: ChatService,private UserService:UserService,private MessageService:MessagesService) {}
async handleConnection(client: Socket, ...args: any[]) {
    try {
      // Aquí, puedes escuchar el evento personalizado del cliente
      client.on('cliente_conectado', async (data: any) => {
        await this.ChatService.ConnectUser(data.User.uid, client.id);
        console.log('listado de useuario: ',this.ChatService.ActiveUsers )
        client.emit('UserWelcome',{displayName:data.User.displayName,photoURL:data.User.photoURL})
        const user=await this.UserService.GetUserbyId(data.User.uid)
        //conectar usuario a salar de amigos
         user.Friends.forEach(room => {
           client.join(`room_${room.ChatId}`)  
         });
      });
    } catch (error) {
      throw error;
    }
   
}
async handleDisconnect(client: any) {
  await this.ChatService.DisconectUser(client.id)
}
  @UseGuards(WSGuard)
  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
  }
  //@UseGuards(WSGuard)
  @SubscribeMessage('sent_message') //TODO Backend
  async handleIncommingMessage(
    client: Socket,
    payload: CreateMessageDto,
  ) {
    console.log('se emite mensaje',payload)
    try{
      const { Content,chatId ,emitterId} = payload;
    if (!chatId) {
      throw new NotFoundException()
    }
    const messageSave=await this.MessageService.saveMessage(payload)
    const {IsRead,Time,_id,__v}=messageSave
    console.log(chatId)
    this.server.to(`room_${chatId}`).emit('new_message',{...payload,IsRead,Time});
    }catch(error){
      throw error
    }
    
  }
  @UseGuards(WSGuard)
  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room:string) {
    client.leave(`room_${room}`);
  }


  @UseGuards(WSGuard)
  @SubscribeMessage('notify_message')
  SendMessage(client:Socket,info:{to:string,from:NotifyProps,issue:string}){
    const{from,issue,to}=info
    const SocketId=this.ChatService.GetSocketId(to)
    const targetSocket = this.server.sockets.sockets.get(SocketId);
    if (targetSocket) {
      //  Armar mensaje
      const content=this.ChatService.getNotifyMessage(from,issue)
      // Enviar el mensaje al usuario específico
      targetSocket.emit('on_notification', content);
    } else {
      // Manejar el caso donde el usuario no está conectado
      console.log('El usuario no está conectado');
    }
  }
}
