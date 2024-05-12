/* eslint-disable prettier/prettier */

import {  Injectable, Logger} from "@nestjs/common";
import { User } from "./entity/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { RequestActions } from "./dto/RequestActions.dto";
import { AddFriend } from "./dto/AddFriend.dto.interface";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { FullUser } from "./interfaces/fullUserInfo.interface";
@Injectable()
export class UserService{
constructor(
    @InjectModel(User.name) 
    private readonly httpService: HttpService
){}
    async GetUserbyId(userid:string){
    try{
        const  data:AxiosResponse<FullUser>  = await firstValueFrom(
            this.httpService.get<any>(`${process.env.API_URL}/users/${userid}`).pipe(
              catchError((error: AxiosError) => {
                Logger.error(error.response.data);
                throw 'An error happened!';
              }),
            ),
          );
       return data.data
    }catch(error){
        throw error   
    }

    }
    
    async UpdateFriendslist(Body:AddFriend){
            try {
                const  data:AxiosResponse<FullUser>  = await firstValueFrom(
                    this.httpService.patch<any>(`${process.env.API_URL}/users/friends`,Body).pipe(
                      catchError((error: AxiosError) => {
                        Logger.error(error.response.data);
                        throw 'An error happened!';
                      }),
                    ),
                  );
               return data.data
                    } catch (error) {
                        throw error
                    }       
    }
    async SentRequest(Body:RequestActions){
        try{
            const  data:AxiosResponse<FullUser>  = await firstValueFrom(
                this.httpService.patch<any>(`${process.env.API_URL}/users/SentRequest`,Body).pipe(
                  catchError((error: AxiosError) => {
                    Logger.error(error.response.data);
                    throw 'An error happened!';
                  }),
                ),
              );
           return data.data
        }catch(error){
            throw error
        }
    }
    async CancelRequest(Body:RequestActions){
        try{
            const  data  = await firstValueFrom(
                this.httpService.patch<any>(`${process.env.API_URL}/users/CancelRequest`,Body).pipe(
                  catchError((error: AxiosError) => {
                    Logger.error(error.response.data);
                    throw 'An error happened!';
                  }),
                ),
              );
           return data
        }catch(error){
            throw error
        }
    }
}