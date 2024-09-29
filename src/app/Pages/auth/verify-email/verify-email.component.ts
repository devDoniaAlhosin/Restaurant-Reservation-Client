import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Core/auth/auth.service';
import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [NgIf],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  verificationStatus: string | null = null;
  message?: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const hash = params['hash'];

      if (id && hash) {
        this.authService.verifyEmail(id, hash).subscribe(
          response => {
            this.message = 'Email successfully verified!';
            // Optionally, redirect or show a login option
          },
          error => {
            this.message = 'Email verification failed. Please try again.';
          }
        );
      } else {
        this.message = 'Invalid verification link.';
      }
    });
  }

verifyEmail(id: string, hash: string) {
  this.authService.verifyEmail(id, hash).subscribe(
    (response) => {
      this.verificationStatus = 'Email successfully verified!';
      this.router.navigate(['/login']);
    },
    (error) => {
      console.error('Verification failed', error);
      this.verificationStatus = 'Email verification failed.';
    }
  );
}




  resendVerification(): void {
    this.authService.resendVerificationEmail().subscribe(
      (response) => {
        this.verificationStatus = 'Verification email has been resent. Please check your inbox.';
      },
      (error) => {
        this.verificationStatus = 'Failed to resend verification email. Please try again later.';
      }
    );
  }


}
