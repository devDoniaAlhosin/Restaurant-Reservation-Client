import { Component } from '@angular/core';
import { AuthService } from '../../../Core/auth/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgClass , NgIf , FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token:string = "";
  email: string = "";
  password: string = "";
  password_confirmation: string = "";
  message: string = "";
  error: string = "";
  successMessage: string | null = null;
  errorMessage: string | null = null;
  errorVisible = false;

  constructor(private authService: AuthService, private router: Router) {
    if (authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  SuccessfulMailNotification(){
    this.router.navigate(['/auth/reset-password']);

  }

}
