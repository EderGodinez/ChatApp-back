import { IsString } from "class-validator"

export class CreateMessageDto{
    @IsString()
    chatId:string
    @IsString()
    emitterId:string
    @IsString()
    Receptor:string
    @IsString()
    Content:string
}