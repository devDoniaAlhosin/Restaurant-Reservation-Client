import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient, private router: Router) {}

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  login(type: any, password: any) {
    return this.http.post(`${this.apiUrl}/login`, type, password);
  }
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
