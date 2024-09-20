import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCodePullRequest,
  faUser,
  faBowlFood,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-welcome-dashboard',
  standalone: true,
  imports: [ RouterOutlet, FontAwesomeModule, RouterLink],
  templateUrl: './welcome-dashboard.component.html',
  styleUrl: './welcome-dashboard.component.css'
})
export class WelcomeDashboardComponent {
  faCodePullRequest = faCodePullRequest;
  faUser = faUser;
  faBowlFood = faBowlFood;
}
