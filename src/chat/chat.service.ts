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
        /*Clave-El socket Id
          Valor-Uid del usuario
        */
        public ActiveUsers:Record<string,string>={}
    
     async ConnectUser(uid:string,socketId:string){
        try {
           const user= await this.UserModel.findOneAndUpdate({uid:uid},{IsActive:true})
            this.ActiveUsers[uid]=socketId
          } catch (error) {
              throw error
          }
    }
     async DisconectUser(socketid:string){
        try {
            const uid=this.FoundUserKey(socketid)
         const user=await this.UserModel.findOneAndUpdate({uid:uid},{IsActive:false})
            delete this.ActiveUsers[uid]
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
    getNotifyMessage(from:NotifyProps,Issue:string):MessageProperties{
        switch(Issue){
            case 'Nuevo amigo':
                return {
                    Content:`${from.displayName} acepto tu solicitud de amistad`,
                    ImageUrl:from.photoURL,
                    Issue
                }
            case 'Solicitud de amistad':
                return {
                    Content:`${from.displayName} te ah enviado solicitud de amistad`,
                    ImageUrl:from.photoURL,
                    Issue
                }
        }
    }

}
