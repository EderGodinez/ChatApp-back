import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./entity/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import e from "express";
import { UpdateListDto } from "./dto/Updatelist.interface";
import { CreateUserDto } from "./dto/CreateUser.dto.interface";

@Injectable()
export class UserService{
constructor(
    @InjectModel(User.name) 
    private UserModel: Model<User>
){}
    async SaveUser(user:CreateUserDto){
        try {
            const UserSave=await this.UserModel.create(user)
            UserSave.save()
            return UserSave        
        } catch (error) {
            console.log(error)
            throw new error
        }
    }
    
    async getFriendsList(userid:string){
        try{
            const userFriends=await this.UserModel.findById(userid).select('Friends')
            const UserFriendsArray=Object.values(userFriends)
        const friendsInfo=await this.UserModel.find({uuid:{$in:UserFriendsArray}})
        return friendsInfo

        }
        catch(error){
            throw new error
        }
        
    }
    async GetFriendshipRequest(userid:string){
        const userFriendsRequest=await this.UserModel.findById(userid).select('FriendShipRequest')
        console.log(userFriendsRequest)
        const RequestInfo=await this.UserModel.find({uuid:{$in:userFriendsRequest}})
        return RequestInfo
    }
    async GetUserbyId(userid:string){
    try{
        console.log(userid)
        const user=await this.UserModel.findOne({uid:userid})
        if (!user) {
            throw new NotFoundException('Usuario no esta registrado en el sistema')
        }
        return user
    }catch(error){
        throw error   
    }

    }
    
    DeleteAccount(userid:string){
        try {
            return this.UserModel.deleteOne({uuid:userid})
        } catch (error) {
            throw new error
        }
    }
    async UpdateFriendslist(Body:UpdateListDto){
        try{
            const {list,uid}=Body
            const user=await this.UserModel.findOneAndUpdate({uid},{Friends:list})
            if (!user) {
              throw  new NotFoundException('Usuario no existe'),HttpStatus.NOT_FOUND
            }
            return user
        }catch(error){
            throw error
        }
    }
    async UpdateRequestList(Body:UpdateListDto){
        try{
            const {list,uid}=Body
            const user=await this.UserModel.findOneAndUpdate({uid},{FriendShipRequest:list})
            if (!user) {
              throw  new NotFoundException('Usuario no existe'),HttpStatus.NOT_FOUND
            }
            return user
        }catch(error){
            throw error
        }
    }
    async ChangeUserStatus(uid:string){
        try{
            const user=await this.UserModel.findOne({uid})
            if (!user) {
              throw  new NotFoundException('Usuario no existe'),HttpStatus.NOT_FOUND
            }
            return this.UserModel.updateOne({uid},{IsActive:!user.IsActive})
        }catch(error){
            throw error
        }
    }
    getUserList(query:string,userid:string):Promise<User[]>{
        console.log(query,userid)
        return this.UserModel.find({displayName: { $regex: new RegExp(query, 'i') }, uid: { $ne: userid }}).limit(10)
    }
}