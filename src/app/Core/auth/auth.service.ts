import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient, private router: Router) {}

  register(userData: object) :Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  login(login: string, password: string): Observable<any> {
    const loginData = { login, password };
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }


  // any url inside api sanctum require headers
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`,  {},{ headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }});
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
}
