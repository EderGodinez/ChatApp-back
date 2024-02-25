import { UserSchema } from './../users/entity/user.entity';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './entites/messages.entity';
import { User } from 'src/users/entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: User.name, schema: UserSchema },
          ]),
    ],
    controllers:[MessagesController],
    providers:[MessagesService],
    exports:[MessagesService]
})
export class MessagesModule {}
