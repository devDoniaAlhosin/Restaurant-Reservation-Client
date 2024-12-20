import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../../Models/menu.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = "http://127.0.0.1:8000/api/menu/";
  // private apiUrl = " https://restaurant-server-c21uyjyp8-devdoniaalhosins-projects.vercel.app/api/api/menu";
  // https://restaurant-server-c21uyjyp8-devdoniaalhosins-projects.vercel.app/api

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('token', token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-vercel-protection-bypass' : 'QhiPLydYUzrgNuhLnGWnnqOnwzgKSOjT'
    });
  }

  getMenu(perPage: number = 30, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?perPage=${perPage}&page=${page}`, { headers: this.getAuthHeaders() });
  }

  getSingleMenu(id: string): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}${id}`, { headers: this.getAuthHeaders() });
  }

  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu, { headers: this.getAuthHeaders() });
  }

  updateMenu(id: number, menuData: Menu): Observable<any> {
    return this.http.patch<Menu>(`${this.apiUrl}${id}`, menuData, { headers: this.getAuthHeaders() });
  }

  deleteMenu(id?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers: this.getAuthHeaders() });
  }
}
