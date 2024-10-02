import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../Core/auth/auth.service';
import { NgIf } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

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
  id: string = '';
  hash: string = '';
  verified: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const verificationUrl = params['message'];
      if (verificationUrl) {
      this.verificationStatus = 'Email verification failed! Please try again.';
      } else {
        this.verificationStatus = 'Invalid verification link.';
      }
    });
  }
  // verifyEmail(verificationUrl: string) {
  //   const token = localStorage.getItem('verifyToken');

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   this.authService.verifyEmail(verificationUrl, headers).subscribe(
  //     (response) => {
  //       console.log('Email verified successfully!', response);
  //       this.verificationStatus = 'Email verified successfully!';
  //       this.router.navigate(['/'], { queryParams: { message: 'email_verified' } });
  //     },
  //     (error) => {
  //       console.error('Email verification failed!', error);
  //       this.verificationStatus = 'Email verification failed! Please try again.';
  //     }
  //   );
  // }



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
