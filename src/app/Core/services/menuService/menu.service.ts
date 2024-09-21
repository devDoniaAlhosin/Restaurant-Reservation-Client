import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../../Models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = "http://127.0.0.1:8000/api/menu/";

  constructor(private http:HttpClient) {}

  getMenu(perPage: number = 30, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?perPage=${perPage}&page=${page}`);
  }
  getSingleMenu(id: string): Observable<Menu> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  updateMenu(id: number, MenuData: Menu): Observable<any> {
    return this.http.patch<Menu>(`${this.apiUrl}${id}`, MenuData);
  }

  deleteMenu(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

}
