import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from 'src/messages/dto/CreateMessage.dto';
import { Chats } from 'src/messages/entites/messages.entity';
import { v4 as uuidv4} from 'uuid'

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chats.name)
        private MessageModel:Model<Chats>){}
    async saveMessage(payload:CreateMessageDto){
        const {Receptor,chatId,emitterId}=payload
        let ChatId:string=chatId
        if (!chatId) {
            ChatId=uuidv4()
        }
        const Message=await this.MessageModel.create({chatId:ChatId,emitterId:emitterId,Receptor:Receptor,Time:new Date()})
    }
}
