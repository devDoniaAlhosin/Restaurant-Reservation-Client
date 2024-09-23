import { AuthService } from './../../../Core/auth/auth.service';
import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faWhatsapp,
  faFacebook,
  faTwitter,
  faInstagram,

} from '@fortawesome/free-brands-svg-icons';
import { faPhone, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { UserService } from '../../../Core/services/userService/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, NgIf, NgClass, SlicePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // Corrected from styleUrl to styleUrls
})
export class NavbarComponent implements OnInit {
  faWhatsapp = faWhatsapp;
  faPhone = faPhone;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faEnvelope = faEnvelope;
  faRightFromBracket=faRightFromBracket

  user: any = null;
  isLoggedIn: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private authService: AuthService,private userService: UserService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.userService.getUser().subscribe(user => {
        this.user = user;
        this.isLoggedIn = !!user;
    });
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
        this.user = this.authService.getUser();

    }
}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Successfully logged out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        this.userService.clearUser();
        this.router.navigate(['/auth/login']);
      },  // console.log('UserService: Setting user', user);
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }
}
