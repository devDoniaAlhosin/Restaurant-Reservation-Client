import { UserService } from './../../../Core/services/userService/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from './../../../Core/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink , FontAwesomeModule , NgIf ,FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  faFacebook= faFacebook;
  faGoogle=faGoogle
  faGithub=faGithub
 faLinkedin=faLinkedin
 errorMessage: string | null = null;
 errorVisible = false;


  constructor(public router: Router,private AuthService: AuthService, private userService :UserService ) {
    if (AuthService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  SendLoginData(loginForm: NgForm) {
    if (loginForm.valid) {
      const loginData = {
        login: loginForm.value.username,
        password: loginForm.value.password,
      };


      this.AuthService.login(loginData.login, loginData.password).subscribe(
        (response: any) => {
          console.log('Login Response:', response);
          if (response.user.role !== 'user') {
            this.errorMessage = "Unauthorized action.";
            this.errorVisible = true;
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
            return;
          }


          if (loginForm.value.rememberMe) {
            sessionStorage.setItem('token', response.token);
          }else{loginData
            localStorage.setItem('token', response.token);
          }loginData

          localStorage.setItem('user', JSON.stringify(response.user));
          this.userService.setUser(response.user);
          this.router.navigate(['/profile']);
        },
        error => {
          console.error('Login failed', error);
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          this.errorMessage = ` Your Credentials are incorrect`;
          setTimeout(() => {
            this.errorVisible = false;
            this.errorMessage = null;
          }, 10000);
        }
      );
    }
  }



}
