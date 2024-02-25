import { FirebaseService } from 'src/firebase/firebase.service';
import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../chat.service';

@Injectable()
export class WSGuard implements CanActivate {
  constructor(private Chat:ChatService,private Firebase:FirebaseService){}
  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>  {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token; // Obtener el valor del token
if (!token) {
  throw new   UnauthorizedException('Token de acceso requerido')
}
    try {      
      const user = await this.Firebase.getUserInfo(token)
      if (!user) {
        throw new UnauthorizedException('Token invalido')
      }
    } catch (error){
      throw error
      ;
    }
    return true;
  }
}
