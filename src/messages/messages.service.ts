/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { CreateMessageDto } from "./dto/CreateMessage.dto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
@Injectable()
export class MessagesService{
    constructor(
        private readonly httpService: HttpService

    ){}
    async saveMessage(payload:CreateMessageDto){
        try{
            const  data  = await firstValueFrom(
                this.httpService.post<any>(`${process.env.API_URL}/messages`,payload).pipe(
                  catchError((error: AxiosError) => {
                    Logger.error(error.response.data);
                    throw 'An error happened!';
                  }),
                ),
              );
           return data
            }
        catch(error){
            throw error
        } 
    }
    //Actualiza los mensajes que no ah visto el usuario
    async UpdateMessages(id:string){
    try{
        const  data  = await firstValueFrom(
            this.httpService.patch<any>(`${process.env.API_URL}/messages/${id}`).pipe(
              catchError((error: AxiosError) => {
                Logger.error(error.response.data);
                throw 'An error happened!';
              }),
            ),
          );
       return data
    }
    catch(error){
       throw error
    }
    }  


        
}

