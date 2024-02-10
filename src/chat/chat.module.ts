import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chats, MessageSchema } from 'src/messages/entites/messages.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Chats.name, schema: MessageSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class SingleChatModule {}
