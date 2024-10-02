import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  errorVisible = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient, private router: Router) {}

  private googleAuthUrl = 'http://localhost:8000/auth/google/redirect';
  loginWithGoogle(): Observable<any> {
    window.location.href = this.googleAuthUrl;
    return this.http.get<any>(this.googleAuthUrl);
  }

  register(userData: object) :Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  login(login: string, password: string): Observable<any> {
    const loginData = { login, password };
    return this.http.post(`${this.apiUrl}/login`, loginData ) ;
  }


  // any url inside api sanctum require headers
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`,  {},{ headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }});

}

verifyEmail(verificationUrl: string, headers: HttpHeaders): Observable<any> {
  return this.http.get<any>(verificationUrl, { headers });
}


resendVerificationEmail() {
  const token = localStorage.getItem('verifyToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.post(`${this.apiUrl}/email/verification-notification`, {} , { headers });
}

//  request a password reset link
requestPasswordReset(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email });
}

// Method to reset the password
resetPassword(email: string, password: string, passwordConfirmation: string, token: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, {
    email,
    password,
    password_confirmation: passwordConfirmation,
    token
  });
}





  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  isLoggedIn(): boolean {
    const user = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
    return !!user;
  }
  getUserRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role; //  'admin' or 'user'
  }
  //  Update Profile
  updateUserProfile(userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/update`, userData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }



  // Admin EndPoints
// Fetch All users
getAllUsers(): Observable<any> {
  return this.http.get(`${this.apiUrl}/users`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

// fetch Single User By Id
getSingleUser(userId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/get-user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

// Update Single User
updateSingleUser(userId: number, updatedUserData: any): Observable<any> {
  return this.http.patch(`${this.apiUrl}/admin/update-user/${userId}`, updatedUserData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

// Delete Single User /admin/delete-user/{user}
deleteSingleUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/admin/delete-user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
}

//  Create Single User /admin/create-user

createSingleUser(userData: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  return this.http.post(`${this.apiUrl}/admin/create-user`, userData, { headers });
}



public showTemporaryMessage(isSuccess: boolean = false) {
  if (isSuccess) {
    this.errorVisible = true;
    setTimeout(() => {
      this.successMessage = null;
      this.errorVisible = false;
    }, 3000);
  } else {
    this.errorVisible = true;
    setTimeout(() => {
      this.errorMessage = null;
      this.errorVisible = false;
    }, 3000);
  }
}



 public handleError(error: any) {
  if (error.error.errors) {
    const errorMessages: string[] = [];
    for (const key in error.error.errors) {
      if (error.error.errors.hasOwnProperty(key)) {
        errorMessages.push(...error.error.errors[key]);
      }
    }
    this.errorMessage = errorMessages.join(' & ');
  } else if (error.message) {
    this.errorMessage = error.message;
  }

  console.error('Error deleting user:', error);
  this.successMessage = null;
  this.showTemporaryMessage();
}




}
