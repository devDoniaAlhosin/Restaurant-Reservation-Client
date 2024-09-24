import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

      const isLoggedIn = this.authService.isLoggedIn();
      const userRole = this.authService.getUserRole();

      // Prevent admin from accessing normal routes
      if (isLoggedIn && userRole === 'admin') {
        this.router.navigate(['/admin']);
        return false;
      }

      // If logged in as a normal user, allow access
      if (isLoggedIn && userRole !== 'admin') {
        return true;
      }

      // If not logged in, redirect to login page
      this.router.navigate(['/']);
      return false;
    }
}
