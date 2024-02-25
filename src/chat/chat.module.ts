import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from 'src/messages/entites/messages.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { User, UserSchema } from 'src/users/entity/user.entity';
import { UserService } from 'src/users/users.service';
import { WsInterceptor } from './interceptors/ws-interceptor/ws-interceptor.interceptor';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService,FirebaseService,UserService,MessagesService],
})
export class ChatModule {}
//WsInterceptor
