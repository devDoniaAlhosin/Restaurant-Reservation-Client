import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './Shared/components/navbar/navbar.component';
import { FooterComponent } from './Shared/components/footer/footer.component';
import { ScrollUpBtnComponent } from './Shared/components/scroll-up-btn/scroll-up-btn.component';
import { AuthService } from './Core/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {NgxSpinnerModule} from 'ngx-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent , ScrollUpBtnComponent ,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Client';

  constructor(
    private authService: AuthService,
     private router: Router
     ,private route: ActivatedRoute,
     private cookieService: CookieService) {}
  verificationStatus: string | null = null;
  getCookie(key: string){
    return this.cookieService.get(key);
  }

  ngOnInit() {

   this.checkUserRole();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });

  }

  verifyEmail(verificationUrl: string) {
    const token = localStorage.getItem('verifyToken');

    if (!token) {
      console.error('No token found for verification.');
      this.verificationStatus = 'Email verification failed! Missing token.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log('Sending request to:', verificationUrl);

    this.authService.verifyEmail(verificationUrl , headers).subscribe(
      (response) => {
        console.log('Email verified successfully!', response);
        this.verificationStatus = 'Email verified successfully!';
        this.router.navigate(['/'], { queryParams: { message: 'email_verified' } });
      },
      (error) => {
        console.error('Email verification failed!', error);
        this.verificationStatus = 'Email verification failed! Please try again.';
        this.router.navigate(['/verify-email'], { queryParams: { message: 'email_verification_failed' } });
      }
    );
  }

  checkUserRole(): void {
    const currentUrl = this.router.url;

    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();

      if (currentUrl.includes('/verify-email')) {
        return;
      }

      if (role === 'admin' && !currentUrl.startsWith('/admin')) {
        this.router.navigate(['/admin']);
      } else if (role === 'user' && !currentUrl.startsWith('/profile')) {
        this.router.navigate(['/profile']);
      }
    }
  }



}
