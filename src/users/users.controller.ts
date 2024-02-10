import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Redirect } from "@nestjs/common";
import { UserService } from "./users.service";
import { UpdateListDto } from "./dto/Updatelist.interface";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/CreateUser.dto.interface";


@ApiTags('Users')
@Controller('users')
export class UsersController{
    constructor(private UserService:UserService){

    }
    @Post()
    SaveUser(@Body() user:CreateUserDto){
        console.log(user)
        return this.UserService.SaveUser(user)
    }
    @Get('list')
    GetUserList(@Query('search') query:string,@Query('except') except:string){
        return this.UserService.getUserList(query,except)
    }
    @Get('/list:id')
    getFrindsList(@Param('id') userid:string){
        return this.UserService.getFriendsList(userid)
    }
    @Get(':id')
    GetUserbyId(@Param('id') userid:string){
        console.log(userid)
        return this.UserService.GetUserbyId(userid)
    }
    @Post('/friends')
    UpdateFriendsList(@Body() request:UpdateListDto){
        return this.UserService.UpdateFriendslist(request)
    }
    @Post('/request')
    UpdateRequestList(@Body() request:UpdateListDto){
         return this.UserService.UpdateRequestList(request)
    }
    @Patch('/status:id')
    UpdateUserStatus(@Param('id') uid:string){
        return this.UserService.ChangeUserStatus(uid)
    }
    @Delete(':id')
    DeleteAccount(@Param() userid:string){
        console.log('eliminar')
        return this.UserService.DeleteAccount(userid)
    }
}
