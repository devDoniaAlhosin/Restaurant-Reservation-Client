import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-requests-dashboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './requests-dashboard.component.html',
  styleUrl: './requests-dashboard.component.css'
})
export class RequestsDashboardComponent {

}
