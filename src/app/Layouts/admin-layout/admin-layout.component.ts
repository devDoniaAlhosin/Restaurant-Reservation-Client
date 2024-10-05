import { Component } from '@angular/core';
import { AdminLoginComponent } from '../../Pages/auth/admin-login/admin-login.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCodePullRequest,
  faUser,
  faBowlFood,
  faMagnifyingGlassChart,
faBars,
faChevronLeft
,faChevronRight,
faGripVertical,
faRightFromBracket,
faCalendarDays,

} from '@fortawesome/free-solid-svg-icons';
import { NgClass, NgIf, SlicePipe } from '@angular/common';
import { AuthService } from '../../Core/auth/auth.service';
import { UserService } from '../../Core/services/userService/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminLoginComponent,SlicePipe ,NgClass, NgIf, RouterOutlet,FontAwesomeModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faBowlFood = faBowlFood;
  faMagnifyingGlassChart=faMagnifyingGlassChart
  active: any;
  faBars=faBars
  faChevronLeft=faChevronLeft
  faChevronRight=faChevronRight
  faGripVertical=faGripVertical
  faRightFromBracket=faRightFromBracket
  faCalendarDays=faCalendarDays
  user: any = null;
  isLoggedIn: boolean = false;
  private unsubscribe$ = new Subject<void>();

  isExpanded: boolean = false;
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



// }

ngOnDestroy(): void {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}
logout(event: Event) {
  event.preventDefault();
  this.authService.logout().subscribe({
    next: () => {
      console.log('Successfully logged out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      this.userService.clearUser();
      this.router.navigate(['/admin-login']);
    },
    error: (error) => {
      console.error('Logout failed', error);
    }
  });
}

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }


}
