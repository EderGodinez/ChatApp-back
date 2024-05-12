/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserService } from './users.service';
import { MessagesModule } from 'src/messages/messages.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers:[UserService],
    exports:[UserService],
    imports:[
        HttpModule,
        MongooseModule.forFeature([
        { name: User.name, schema: UserSchema }]),
        MessagesModule
    ]
})
export class UsersModule {
}
