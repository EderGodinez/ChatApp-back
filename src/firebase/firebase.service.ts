import { Injectable } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService{
    private readonly app=initializeApp({credential:applicationDefault()});
    private readonly auth=getAuth()
    async getUserInfo(token:string){
      try {
        const decodedToken = await this.auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const user = await getAuth().getUser(uid);
        return user; 
      } catch (error) {
        throw error;
      }
    }
}