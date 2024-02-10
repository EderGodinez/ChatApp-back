import { CreateMessageDto } from './../messages/dto/CreateMessage.dto';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server,Socket } from 'socket.io';
import { NotAcceptableException, NotFoundException, OnModuleInit } from '@nestjs/common';

@WebSocketGateway(81,{cors:"*"})
export class ChatGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit {

    @WebSocketServer()
    public server: Server;

  constructor(private readonly ChatService: ChatService) {}
  afterInit(server: any) {
    console.log('Esto se ejecuta cuando inicia')
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Cliente con id '+client.id+'se ah conectado')
    //Conectar a cliente a chats correspondientes
  
  }

  handleDisconnect(client: any) {
    console.log('Cliente con id '+client.id+'se ah desconectado')
  }


  @SubscribeMessage('event_join')
  handleJoinRoom(client: Socket, room: string) {
    client.join(`room_${room}`);
  }

  @SubscribeMessage('sent_message') //TODO Backend
  handleIncommingMessage(
    client: Socket,
    payload: CreateMessageDto,
  ) {
    try{
      const { Content,chatId ,emitterId} = payload;
    if (!chatId) {
      throw new NotFoundException()
    }
    this.server.to(`room_${chatId}`).except(client.id).emit('new_message',{Content,emitterId});
    //this.ChatService.saveMessage(payload)
    }catch(error){
      throw error
    }
    
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room:string) {
    client.leave(`room_${room}`);
  }
}
