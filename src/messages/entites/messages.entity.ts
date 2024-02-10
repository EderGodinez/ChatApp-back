import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseSchema} from 'mongoose'
enum MessageStatus {
    Noleido = 'No leido',
    Leido = 'Leido',
    Recibido='Recibido'
  }
class ReceptorInfo{
    UserId:string
    status:MessageStatus
}
@Schema()
export class Chats{
@Prop({type:String,_id:true})
chatId:string
@Prop({type:MongooseSchema.Types.ObjectId})
emitterId:string
@Prop({type:[ReceptorInfo]})
Receptor:ReceptorInfo[]
@Prop({type:Date})
Time:Date
}
export const MessageSchema=SchemaFactory.createForClass(Chats)