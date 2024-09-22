import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './../../../Core/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink , FontAwesomeModule , NgIf ,FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  faFacebook= faFacebook;
  faGoogle=faGoogle
  faGithub=faGithub
 faLinkedin=faLinkedin

  constructor(public router: Router,private AuthService: AuthService ) {}

  SendLoginData(loginForm: NgForm){
    if (loginForm.valid) {
      const loginData = {
        login: loginForm.value.username,
        password: loginForm.value.password,
      };
      console.log('Login Data is :' , loginData)
      this.AuthService.login(loginData.login, loginData.password).subscribe(
        (response: any) => {

          console.log( 'Login Response:' , response)
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Login failed', error);
        }

      );

  }
}


}
