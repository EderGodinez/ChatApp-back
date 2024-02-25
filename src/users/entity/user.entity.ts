import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseSchema} from 'mongoose'
class Request{
    EmmiterId:string
    ReceptorId:string
    DateSent:Date
}
class Friend{
    FriendId:string
    ChatId:string
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
@Prop({type:Request,default:[]})
FriendshipRequest:Request[]
@Prop({default:[]})
Friends:Friend[]
@Prop({type:Boolean,default:true})
IsActive:boolean
}
export const UserSchema=SchemaFactory.createForClass(User)
  