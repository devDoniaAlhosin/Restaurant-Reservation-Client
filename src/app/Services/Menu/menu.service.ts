import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../Models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = "http://127.0.0.1:8000/api/menu/";

  constructor(private http:HttpClient) {}

  getMenu():Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }


}
