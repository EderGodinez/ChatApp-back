import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { FirebaseService } from 'src/firebase/firebase.service';
@Injectable()
export class WsInterceptor implements NestInterceptor {
  constructor(private Firebase:FirebaseService){}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const client = context.switchToWs().getClient();
    const headers = client.handshake.headers;
    // Realiza la validación de los encabezados según sea necesario
    const authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
      // No se proporcionó el encabezado Authorization, detiene la ejecución
      client.emit('error','Headers requeridos')
      client.disconnect();
      return throwError(() => new Error('Header de autorización no proporcionado'));
    }
    try {      
      const user = await this.Firebase.getUserInfo(authorizationHeader)
      if (!user) {
        client.emit('error','Error el usuario no posee las credenciales para usar el socket')
        client.disconnect();
        return throwError(() => new Error('Credenciales invalidas'));
      }
    } catch {
      client.emit('error','Error al intentar conectarse a socket')
      client.disconnect();
      return throwError(() => new Error('Error al intentar conectarse a socket'));
    }
    return next.handle();
  
  }
}
