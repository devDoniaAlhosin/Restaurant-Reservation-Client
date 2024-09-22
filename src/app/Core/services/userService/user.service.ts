import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {

   }
  private UserSubject = new BehaviorSubject<any>(null);

    setUser(user : any){
      this.UserSubject.next(user);
    }
    getUser():Observable<any>{
      return this.UserSubject.asObservable();
    }
    clearUser() {
      this.setUser(null);
    }

}
