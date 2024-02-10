import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    controllers:[UsersController],
    providers:[UserService],
    exports:[UserService],
    imports:[
        MongooseModule.forFeature([
        { name: User.name, schema: UserSchema }])
    ]
})
export class UsersModule {
}
