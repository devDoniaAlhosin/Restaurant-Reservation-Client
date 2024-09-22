import { AuthService } from './../../../Core/auth/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  constructor(private router: Router , authService : AuthService ) {
    if(authService.isLoggedIn()){
      this.router.navigate(['/']);
    }
  }

  SendLoginData(loginForm: NgForm){
    if (loginForm.valid) {
      const loginData = {
        username: loginForm.value.username,
        password: loginForm.value.password,
        rememberMe: loginForm.value.rememberMe,
      };

  }
}
}
