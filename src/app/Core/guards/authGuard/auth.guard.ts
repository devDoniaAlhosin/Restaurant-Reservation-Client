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

      if (isLoggedIn && userRole === 'admin') {
        this.router.navigate(['/admin']);
        return false;
      }

      if (isLoggedIn && userRole !== 'admin') {
        return true;
      }

      this.router.navigate(['/']);
      return false;
    }
}
