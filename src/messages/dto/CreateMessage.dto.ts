import { IsBoolean, IsString } from "class-validator"

export class CreateMessageDto{
    @IsString()
    chatId:string
    @IsString()
    emitterId:string
    @IsString()
    ReceptorId:string
    @IsString()
    Content:string
}