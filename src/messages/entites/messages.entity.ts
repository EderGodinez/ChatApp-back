import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Message{
@Prop({type:String,required:true})//Id del chat al que se emitira el mensaje
chatId:string
@Prop({type:String,required:true})//Uid de usuario que envia mensaje
emitterId:string
@Prop({type:String,required:true})//Uid de el usuario receptor del mensaje
ReceptorId:string
@Prop({type:Date,default:new Date()})
Time:Date
@Prop({type:Boolean,default:false})
IsRead:boolean
@Prop({type:String,required:true})
Content:string
}
export const MessageSchema=SchemaFactory.createForClass(Message)