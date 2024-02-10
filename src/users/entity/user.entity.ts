import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseSchema} from 'mongoose'
class Request{
    userId:string
    DateSent:Date
}
@Schema()
export class User{
@Prop({type:String,_id:true})
uid:string
@Prop({unique:true,type:String})
email:string
@Prop({type:String})
displayName:string
@Prop({type:String,default:'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'})
photoURL:string
@Prop()
FriendShipRequest:Request[]
@Prop({type:[Map]})
Friends:Record<string,string>
@Prop({type:Boolean,default:true})
IsActive:boolean
}
export const UserSchema=SchemaFactory.createForClass(User)
  