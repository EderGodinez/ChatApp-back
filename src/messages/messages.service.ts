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
    async saveMessage(payload:CreateMessageDto,IsRead:boolean=false){
        try{
            const {ReceptorId,emitterId}=payload
        const user=this.UserModel.findOne({uid:emitterId})
        if (!user) {
        }
        const friend=this.UserModel.findOne({uid:ReceptorId})
        if (friend) {
        }
        return this.MessageModel.create({...payload,IsRead})
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
    //Actualiza los mensajes que no ah visto el usuario
    async UpdateMessages(id:string,receptor:string=''){
    try{
        const messagesNoRead=await this.MessageModel.countDocuments({chatId:id,IsRead:false,ReceptorId:receptor}).lean()
        if(messagesNoRead>0){
            const updatedMessages = await this.MessageModel.updateMany(
                { chatId: id, ReceptorId: receptor },
                { $set: { IsRead: true } },
              ).lean().exec();
    if (!updatedMessages) {
        throw new InternalServerErrorException('Error al intentar actualizar mensaje con id: '+id)
    }
    return 'Mensajes con id'+id+'se actualizaron a leidos'
        }
        return  'Mensajes al dia'
    }
    catch(error){
       throw error
    }
    }  


        
}

