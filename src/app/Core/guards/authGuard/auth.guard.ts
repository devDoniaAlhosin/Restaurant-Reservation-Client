import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getUserRole();
      if (userRole === 'admin') {
        this.router.navigate(['/admin']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/auth']);
    return false;
    }


  }



}
