import { AuthService } from './../../../Core/auth/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../../Core/services/userService/user.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink, NgIf   ,FormsModule, NgClass],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  errorMessage: string | null = null;
  errorVisible = false;


  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
    if (authService.isLoggedIn()) {
      const userRole = authService.getUserRole();
      if (userRole === 'admin') {
        this.router.navigate(['/admin']);
      }
    }
  }


  SendAdminLoginData(loginForm: NgForm) {
    if (loginForm.valid) {
      const loginData = {
        login: loginForm.value.adminUsername,
        password: loginForm.value.adminPassword,
      };

      this.authService.login(loginData.login, loginData.password).subscribe(
        (response: any) => {
          console.log('Login Response:', response);
          if (response.user.role !== 'admin') {
            this.errorMessage = "Unauthorized action.  admins Only.";
            this.errorVisible = true;
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
            return;
          }
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userService.setUser(response.user);
          this.router.navigate(['/admin']);
        },
        error => {
          console.error('Login failed', error);
          this.errorMessage = error.error?.message || "Your credentials are incorrect.";
          this.errorVisible = true;
          setTimeout(() => {
            this.errorVisible = false;
            this.errorMessage = null;
          }, 10000);
        }
      );
    }
  }
}
