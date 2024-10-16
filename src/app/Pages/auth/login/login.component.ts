import { UserService } from './../../../Core/services/userService/user.service';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
import { FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from './../../../Core/auth/auth.service';
import { GoogleAuthComponent } from "../components/google-auth/google-auth.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, NgIf, FormsModule, NgClass, GoogleAuthComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {
  faFacebook= faFacebook;
  faGoogle=faGoogle
  faGithub=faGithub
 faLinkedin=faLinkedin

 successMessage: string | null = null;
 errorMessage: string | null = null;
 errorVisible = false;
  verificationStatus?: string;


  constructor(
    public router: Router,
    private AuthService: AuthService,
    private userService :UserService,
    private route: ActivatedRoute
   ) {
    if (AuthService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'email_verified') {
        this.successMessage = 'Email verified successfully! You can log in now.';
        this.errorVisible = true;
        setTimeout(() => {
          //  this.errorVisible = false;
          this.successMessage = null;
        }, 10000);
      }
    });

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
            this.errorMessage = "Unauthorized action. Admins cannot perform this action.";
            this.errorVisible = true;
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
            return;
          }


          if (!response.user.email_verified_at) {
            localStorage.setItem('verifyToken', response.token);
            this.errorMessage = 'Please verify your email before logging in.';
            // Swal.fire({
            //   title: 'Email not verified!',
            //   text: 'Please verify your email before logging in.',
            //   icon: 'warning',
            //   confirmButtonText: 'OK'
            // });

            this.errorVisible = true;
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
            return;
          }



          if (loginForm.value.rememberMe) {
            localStorage.removeItem('verifyToken');
            sessionStorage.setItem('token', response.token);
          }else{
            localStorage.setItem('token', response.token);
          }
          localStorage.removeItem('verifyToken');
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userService.setUser(response.user);
          this.router.navigate(['/profile']);
        },
        error => {
          console.error('Login failed', error);
          Swal.fire({
            title: 'Error!',
            text: 'Your Credentials are incorrect',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
          });
          // setTimeout(() => {
          //   this.errorVisible = true;
          // }, 50);
          // this.errorMessage = ` Your Credentials are incorrect`;
          // setTimeout(() => {
          //   this.errorVisible = false;
          //   this.errorMessage = null;
          // }, 10000);
        }
      );
    }
  }


  resendVerificationEmail(): void {
    const token = localStorage.getItem('verifyToken');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      this.AuthService.resendVerificationEmail(headers).subscribe(
        (response) => {
          this.verificationStatus = 'Verification email has been resent. Please check your inbox.';

          Swal.fire({
            title: 'Verification Email Sent!',
            text: 'Verification email has been resent. Please check your inbox.',
            icon: 'success',
            showConfirmButton: false,
            timer: 7000
          });
        },
        (error) => {
          console.error('Failed to resend verification email', error);
          this.verificationStatus = 'Failed to resend verification email. Please try again later.';

          Swal.fire({
            title: 'Error',
            text: 'Failed to resend verification email. Please try again later.',
            icon: 'error',
            showConfirmButton: true
          });
        }
      );
    } else {
      this.verificationStatus = 'User is not authenticated. Please log in and try again.';

      Swal.fire({
        title: 'Authentication Error',
        text: 'User is not authenticated. Please log in and try again.',
        icon: 'warning',
        showConfirmButton: true
      });
    }
  }



  goToForgotPassword() {
    this.router.navigate(['/auth/forget-password']);
  }




}
