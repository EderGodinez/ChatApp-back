import { Request } from "./Request.interface"

export interface UpdateUserDto{
uid:string
displayName:string
photoURL:string
FriendshipRequest:Request[]
Friends:Record<string,string>
IsActive:boolean
}
