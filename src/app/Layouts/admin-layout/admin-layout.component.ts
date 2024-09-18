import { Component } from '@angular/core';
import { AdminLoginComponent } from '../../Pages/auth/admin-login/admin-login.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCodePullRequest,
  faUser,
  faBowlFood,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminLoginComponent, RouterOutlet, FontAwesomeModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faBowlFood = faBowlFood;
}
