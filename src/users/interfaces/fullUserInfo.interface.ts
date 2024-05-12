/* eslint-disable prettier/prettier */
import { Message } from "src/messages/interfaces/messages.interface"

interface Request{
    EmmiterId:string
    ReceptorId:string
}
interface Friend{
    FriendId:string
    ChatId:string
    Messages?:Message[]
}
export interface FullUser{
uid:string
displayName:string
photoURL:string
FriendshipRequest:Request[]
Friends:Friend[]
IsActive:boolean
}