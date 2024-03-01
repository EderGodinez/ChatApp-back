import {  Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entity/user.entity';

import { NotifyProps } from './interfaces/NotifyRemitten.interface';
import { MessageProperties } from './interfaces/Notify.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(User.name)
        private UserModel:Model<User>){}
        //Los valores seran:
        /*Clave-Uid del usuario
          Valor-El socket Id
        */
        private ActiveUsers:Record<string,string>={}
        //Los valores seran:
        /*Clave-El userid
          Valor-chatid
        */
        private CurrentChat:Record<string,string>={}


        JoinChat(chatid:string,uid:string){
            this.CurrentChat[uid]=chatid
        }
     async ConnectUser(uid:string,socketId:string){
        try {
           const user= await this.UserModel.findOneAndUpdate({uid:uid},{IsActive:true}, {returnOriginal: false})
            this.ActiveUsers[uid]=socketId
            return user
          } catch (error) {
              throw error
          }
    }
     async DisconectUser(socketid:string):Promise<User>{
        try {
            const uid=this.FoundUserKey(socketid)
         const user=await this.UserModel.findOneAndUpdate({uid:uid},{IsActive:false}, {returnOriginal: false})
            delete this.ActiveUsers[uid]
            return user
        } catch (error) {
            throw error
        }
    }
    FoundUserKey(socketid:string){
        for(let key in this.ActiveUsers){
            if (this.ActiveUsers[key]===socketid) {
                return key
            }
        }
    }
    GetSocketId(uid:string){
        return this.ActiveUsers[uid]
    }
    GetChatId(uid:string){
        return this.CurrentChat[uid]
    }
    getNotifyMessage(from:NotifyProps,Issue:string):MessageProperties{
        switch(Issue){
            case 'Nuevo amigo':
                return {
                    Content:`${from.displayName} acepto tu solicitud de amistad`,
                    ImageUrl:from.photoURL,
                    Issue
                }
            case 'Solicitud':
                return {
                    Content:`${from.displayName} te ah enviado solicitud de amistad`,
                    ImageUrl:from.photoURL,
                    Issue
                }
            case 'Rechazo':
                    return {
                        Content:`${from.displayName} rechazo tu solicitud de amistad`,
                        ImageUrl:from.photoURL,
                        Issue
                    }
            case 'Nuevo chat':
                        return {
                            Content:`Se ah creado chat con ${from.displayName}`,
                            ImageUrl:from.photoURL,
                            Issue
                        }
        }
    }

}
