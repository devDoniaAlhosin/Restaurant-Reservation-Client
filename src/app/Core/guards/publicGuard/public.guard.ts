import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    if (this.authService.isLoggedIn() && this.authService.getUserRole() === 'user') {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
