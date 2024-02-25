import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from "./dto/CreateMessage.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "./entites/messages.entity";
import { Model } from "mongoose";
import { User } from "src/users/entity/user.entity";
@Injectable()
export class MessagesService{
    constructor(
        @InjectModel(Message.name)
        private MessageModel:Model<Message>,
        @InjectModel(User.name)
        private UserModel:Model<User>
    ){}
    async saveMessage(payload:CreateMessageDto){
        try{
            const {ReceptorId,emitterId}=payload
        const user=this.UserModel.findOne({uid:emitterId})
        if (!user) {
        }
        const friend=this.UserModel.findOne({uid:ReceptorId})
        if (friend) {
        }
        return this.MessageModel.create(payload)
        }
        catch(error){
            throw error
        } 
    }
    GetMessages(chatid:string){
        try{
            const messages=this.MessageModel.find({chatId:chatid}).sort('Time').lean().select({ __v: 0, _id: 0 })
            if (!messages) {
                throw new NotFoundException('Chat no existe')
            }
            return messages
        }catch(error){
            throw error
        }
    }
    GetLastMessage(chatid:string){
        try{
            const messages=this.MessageModel.find({chatId:chatid}).sort('Time').lean().select({ __v: 0, _id: 0 })
            if (!messages) {
                throw new NotFoundException('Chat no existe')
            }
            return messages[-1]
        }catch(error){
            throw error
        }
    }
    UpdateMessage(id:string){
    try{
        const message=this.MessageModel.findOne({_id:id})
        if (!message) {
            throw new NotFoundException('Mensaje no existe')
        }
    const updatedMessage=this.MessageModel.findOneAndUpdate({_id:id},{IsRead:true})
    if (!updatedMessage) {
        throw new InternalServerErrorException('Error al intentar actualizar mensaje con id: '+id)
    }
    return updatedMessage
    }
    catch(error){
       throw error
    }
    }  


        
}

