
import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { User } from "./entity/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from "./dto/CreateUser.dto.interface";
import {v4 as uuidv4} from 'uuid'
import { threadId } from "worker_threads";
import { RequestActions } from "./dto/RequestActions.dto";
import { UpdateUserDto } from "./dto/updateUser.dto.interface";
import { AddFriend } from "./dto/AddFriend.dto.interface";
import { MessagesService } from "src/messages/messages.service";
import { Message } from "src/messages/entites/messages.entity";
import { FullUser } from "./interfaces/fullUserInfo.interface";
@Injectable()
export class UserService{
constructor(
    @InjectModel(User.name) 
    private UserModel: Model<User>,
    private MessagesService:MessagesService
){}
    async SaveUser(user:CreateUserDto){
        try {
            const UserSave=await this.UserModel.create(user)
            UserSave.save()
            return UserSave        
        } catch (error) {
            if(error.code===11000){
                return this.UserModel.findOne({email:user.email})
            }
            throw new error
        }
    }
    
    async GetUserbyId(userid:string){
    try{
        const user=await this.UserModel.findOne({uid:userid}).lean()
        if (!user) {
            throw new NotFoundException('Usuario no esta registrado en el sistema')
        }
    const{_id,email,...userinfo}=user
        return userinfo
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
    async UpdateFriendslist(Body:AddFriend){
            const {userId,NewFriendId}=Body
            try {
                const ChatId=uuidv4();
                let user=await this.UserModel.findOne({uid:userId})
                let friend=await this.UserModel.findOne({uid:NewFriendId})
                 //Agrego a lista de amigos de el usuario que acepto la solicitud
                 user.Friends.push({FriendId:NewFriendId,ChatId:ChatId})
                 user.Friends[NewFriendId]=ChatId
                 user.FriendshipRequest=user.FriendshipRequest.filter((req)=>req.EmmiterId!==NewFriendId&&req.ReceptorId!==userId)
                 const current= await this.UserModel.findOneAndUpdate({uid:user.uid},user)
                 console.log('updatedUser',current)
                 ///Agrego a usuario que fue aceptado
                 friend.Friends.push({FriendId:userId,ChatId:ChatId})
                friend.FriendshipRequest=friend.FriendshipRequest.filter((req)=>req.EmmiterId!==NewFriendId&&req.ReceptorId!==userId)
               const u= await this.UserModel.findOneAndUpdate({uid:friend.uid},friend)
               console.log('friendupdate',u)
                        return user
                    } catch (error) {
                        throw error
                    }
                    
                
              
    }
    async SentRequest(Body:RequestActions){
        try{
            const {uid,RemitentId}=Body
            let user=await this.UserModel.findOneAndUpdate(
                { uid }, // Condición de búsqueda
                { $push: { FriendshipRequest: { DateSent: new Date(), EmmiterId: uid, ReceptorId: RemitentId } } },
                { new: true } // Para devolver el documento actualizado
              );
            let RemmitentUser=await this.UserModel.findOneAndUpdate(
                { uid: RemitentId }, // Condición de búsqueda
                { $push: { FriendshipRequest: { DateSent: new Date(), EmmiterId: uid, ReceptorId: RemitentId } } },
                { new: true } // Para devolver el documento actualizado
              );
            if (!user||!RemmitentUser) {
                throw  new NotFoundException('Usuario no existe'),HttpStatus.NOT_FOUND
            }
            return user
        }catch(error){
            throw error
        }
    }
    async CancelRequest(Body:RequestActions){
        try{
            const {uid,RemitentId}=Body
            let user=await this.UserModel.findOneAndUpdate(
                { uid }, // Condición de búsqueda
                { $pull: { FriendshipRequest: {  EmmiterId: uid, ReceptorId: RemitentId } } },
                { new: true } // Para devolver el documento actualizado
              );
            let RemmitentUser=await this.UserModel.findOneAndUpdate(
                { uid: RemitentId }, // Condición de búsqueda
                { $pull: { FriendshipRequest: {  EmmiterId: uid, ReceptorId: RemitentId } } },
                { new: true } // Para devolver el documento actualizado
              );
            if (!user||!RemmitentUser) {
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
    async getUserList(query:string,userid:string):Promise<User[]>{
        const user=await this.UserModel.findOne({uid:userid}).select(['Friends','FriendshipRequest']).lean();
        const friends=user.Friends.map((friend)=>friend.FriendId)
        const UniqueIds=new Set<string>();
        user.FriendshipRequest.forEach((request) => {
            const isUniqueEmmiter = !UniqueIds.has(request.EmmiterId);
            const isUniqueReceptor = !UniqueIds.has(request.ReceptorId);
            if (isUniqueEmmiter) {
            UniqueIds.add(request.EmmiterId);
            }
            if (isUniqueReceptor) {
                UniqueIds.add(request.ReceptorId);
            }
        });
    const uniqueIdsList = Array.from(UniqueIds);
    const cleanedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.UserModel.find({$and:[{
            displayName: { $regex: new RegExp(`^${cleanedQuery}`,'i') },
            uid: { $nin: [userid,...friends,...uniqueIdsList] }
        }]}).limit(10)
    }
    async GetFullInformation(userid:string){
        try {
        //Obtener informacion de usuario
        const userInfo=await this.GetUserbyId(userid)
        const FullUserInfo:FullUser={...userInfo}
        //Obtener los mensajes de chats de amigos del usuario
        for (let index = 0; index < userInfo.Friends.length; index++) {
            const friend = userInfo.Friends[index];
            const Messages = await this.MessagesService.GetMessages(friend.ChatId);
            FullUserInfo.Friends[index].Messages = Messages;
          }    
        return FullUserInfo
        } catch (error) {
            throw error
        }
        
    }
}