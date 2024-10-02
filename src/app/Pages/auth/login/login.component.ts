import { UserService } from './../../../Core/services/userService/user.service';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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

 successMessage: string | null = null;
 errorMessage: string | null = null;
 errorVisible = false;


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




  signInWithGoogle() {
    this.AuthService.loginWithGoogle().subscribe({
      next: (response) => {
      const token = response.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.userService.setUser(response.user);
      this.router.navigate(['/profile']);

      },
      error: (error) => {
        console.error('Error during Google login:', error);
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


          if (!response.user.email_verified_at) {
            this.errorMessage = 'Please verify your email before logging in.';
            this.errorVisible = true;
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
            return;
          }

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

  resendVerificationEmail() {
    this.AuthService.resendVerificationEmail().subscribe(() => {
      setTimeout(() => {
        this.errorVisible = true;
      }, 50);
      this.successMessage = 'Verification email sent successfully.'
      alert('Verification email sent successfully.');
    }, error => {
      console.error('Failed to resend verification email', error);
    });
  }


  goToForgotPassword() {
    this.router.navigate(['/auth/forget-password']);
  }




}
