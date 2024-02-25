import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { CreateMessageDto } from './dto/CreateMessage.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController{
    constructor(private messageService:MessagesService){

    }
    @UseGuards()
    @Post()
    SaveUser(@Body() message:CreateMessageDto){
        return this.messageService.saveMessage(message)
    }
    @UseGuards()
    @Get(':id')
    GetUserList(@Param('id') chatId:string ){
        return this.messageService.GetMessages(chatId)
    }
    @UseGuards()
    @Get('last/:id')
    GetUserbyId(@Param('id') chatId:string){
        return this.messageService.GetLastMessage(chatId)
    }
    @UseGuards()
    @Patch(':id')
    UpdateMessage(@Param('id') id:string){
        return this.messageService.UpdateMessage(id)
    }
}