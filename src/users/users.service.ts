/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { RequestActions } from "./dto/RequestActions.dto";
import { AddFriend } from "./dto/AddFriend.dto.interface";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { FullUser } from "./interfaces/fullUserInfo.interface";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // Ajuste en la inyección del modelo
    private readonly httpService: HttpService // Inyección del servicio HTTP
  ) {}

  async GetUserbyId(userid: string): Promise<FullUser> {
    try {
      const {data}: AxiosResponse<FullUser> = await firstValueFrom(
        this.httpService.get<FullUser>(`${process.env.API_URL}/users/${userid}`).pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response?.data);
            throw new Error('An error happened while getting user by id!');
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async UpdateFriendslist(Body: AddFriend): Promise<FullUser> {
    try {
      const {data}: AxiosResponse<FullUser> = await firstValueFrom(
        this.httpService.patch<FullUser>(`${process.env.API_URL}/users/friends`, Body).pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response?.data);
            throw new Error('An error happened while updating friend list!');
          }),
        ),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async sendRequest(Body: RequestActions): Promise<FullUser> {
    try {
      const {data}: AxiosResponse<FullUser> = await firstValueFrom(
        this.httpService.patch<FullUser>(`${process.env.API_URL}/users/SentRequest`, Body).pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response?.data);
            throw new Error('An error happened while sending request!');
          }),
        ),
      );
      return data
    } catch (error) {
      throw error;
    }
  }

  async CancelRequest(Body: RequestActions): Promise<any> {
    try {
      const {data} = await firstValueFrom(
        this.httpService.patch<any>(`${process.env.API_URL}/users/CancelRequest`, Body).pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response?.data);
            throw new Error('An error happened while cancelling request!');
          }),
        ),
      );
      return data
    } catch (error) {
      throw error;
    }
  }
}
