/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Redirect } from "@nestjs/common";
import { UserService } from "./users.service";
import { UpdateListDto } from "./dto/Updatelist.interface";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/CreateUser.dto.interface";
import { User } from "./entity/user.entity";
import { RequestActions } from "./dto/RequestActions.dto";
import { UpdateUserDto } from "./dto/updateUser.dto.interface";
import { AddFriend } from "./dto/AddFriend.dto.interface";


@ApiTags('Users')
@Controller('users')
export class UsersController{
    constructor(private UserService:UserService){

    }
    @Post()
    SaveUser(@Body() user:CreateUserDto){
        return this.UserService.SaveUser(user)
    }
    @Get('list')
    GetUserList(@Query('search') query:string,@Query('except') except:string){
        return this.UserService.getUserList(query,except)
    }
    @Get(':id')
    GetUserbyId(@Param('id') userid:string){
        return this.UserService.GetUserbyId(userid)
    }
    @Get('/full/:id')
    GetUserFullbyId(@Param('id') userid:string){
        return this.UserService.GetFullInformation(userid)
    }
    @Patch('/friends')
    AddFriends(@Body() request:AddFriend){
        return this.UserService.UpdateFriendslist(request)
    }
    @Patch('/SentRequest')
    SentRequest(@Body() request:RequestActions){
         return this.UserService.SentRequest(request)
    }
    @Patch('/CancelRequest')
    CancelRequest(@Body() request:RequestActions){
         return this.UserService.CancelRequest(request)
    }
    @Patch('/status:id')
    UpdateUserStatus(@Param('id') uid:string){
        return this.UserService.ChangeUserStatus(uid)
    }
    @Delete(':id')
    DeleteAccount(@Param() userid:string){
        return this.UserService.DeleteAccount(userid)
    }
}
