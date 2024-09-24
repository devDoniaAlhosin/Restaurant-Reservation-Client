import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Chart, registerables } from 'chart.js';
import {
  faCodePullRequest,
  faUser,
  faBowlFood,
} from '@fortawesome/free-solid-svg-icons';
Chart.register(...registerables);
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

  userCount: number = 250;
  bookingCount: number = 150;
  reviewCount: number = 80;

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (ctx) {
      new Chart(ctx, {
        type: 'line', // Change to bar, pie, etc., as needed
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'User Registrations',
              backgroundColor: 'rgba(220, 53, 69, 0.5)',
              borderColor: 'rgba(220, 53, 69, 1)',
              data: [65, 59, 80, 81, 56, 55, 40],
            },
            {
              label: 'Bookings',
              backgroundColor: 'rgba(40, 167, 69, 0.5)',
              borderColor: 'rgba(40, 167, 69, 1)',
              data: [28, 48, 40, 19, 86, 27, 90],
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            }
          }
        }
      });
    } else {
      console.error("Canvas element not found");
    }
  }
}
