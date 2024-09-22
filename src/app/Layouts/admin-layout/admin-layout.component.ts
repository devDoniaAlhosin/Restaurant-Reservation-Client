import { Component } from '@angular/core';
import { AdminLoginComponent } from '../../Pages/auth/admin-login/admin-login.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCodePullRequest,
  faUser,
  faBowlFood,
  faMagnifyingGlassChart,
faBars

} from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminLoginComponent, NgClass, RouterOutlet,FontAwesomeModule, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faBowlFood = faBowlFood;
  faMagnifyingGlassChart=faMagnifyingGlassChart
active: any;
isExpanded = false;
faBars=faBars

toggleSidebar() {
  this.isExpanded = !this.isExpanded;
}

}
