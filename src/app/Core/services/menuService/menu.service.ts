import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../../Models/menu.model';
import { AuthService } from '../../auth/auth.service'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = "http://127.0.0.1:8000/api/menu/";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // You can adjust this based on how you store the token
    console.log('token', token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
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
