import { Component } from '@angular/core';
import { AuthService } from '../../../Core/auth/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [NgIf,NgClass,FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  email: string = "";
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
  SendResetMail() {
    this.router.navigate(['/auth/reset-password']);
  }

  requestResetLink(forgetForm: NgForm) {
    if (forgetForm.valid) {
      const forgetData = {
        email: forgetForm.value.email,
      };
    this.authService.requestPasswordReset(forgetData.email).subscribe(
      response => {
        this.successMessage = response.status;
        this.errorVisible = true;
      },
      error => {
        this.errorMessage = error.error.email || 'An error occurred';
          this.errorVisible = true;

      }
    );
    }
  }


}
