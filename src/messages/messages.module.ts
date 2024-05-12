/* eslint-disable prettier/prettier */
import { UserSchema } from './../users/entity/user.entity';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './entites/messages.entity';
import { User } from 'src/users/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports:[
        HttpModule,
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema },
          ]),
    ],
    providers:[MessagesService],
    exports:[MessagesService]
})
export class MessagesModule {}
