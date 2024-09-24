import { Component } from '@angular/core';
import { UserService } from '../../../Core/services/userService/user.service';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [NgIf , NgFor , FontAwesomeModule],
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.css'
})

export class UsersDashboardComponent {
  icons = {
    faPencil :faPencil
  }



  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

  }

  onEdit(): void {

  }

  onDelete(): void {

  }

  onUpdate(): void {
  }
}
