import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { MessagesService } from 'src/messages/messages.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    controllers:[UsersController],
    providers:[UserService],
    exports:[UserService],
    imports:[
        MongooseModule.forFeature([
        { name: User.name, schema: UserSchema }]),
        MessagesModule
    ]
})
export class UsersModule {
}
