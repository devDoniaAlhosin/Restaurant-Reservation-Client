import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash , faKey ,  faUser ,  faIdBadge,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../../Core/services/userService/user.service';
import { AuthService } from '../../../../../Core/auth/auth.service';
@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [],
  templateUrl: './user-edit-form.component.html',
  styleUrl: './user-edit-form.component.css'
})
export class UserEditFormComponent {
  icons = {
    faPencil ,
    faTrash,
    faKey ,
    faUser ,
    faIdBadge,
    faEnvelope,
  }
  isLoggedIn: boolean = false;
  errorMessage: string | null = null;
  // editAdminForm: FormGroup;
  selectedFile: File | null = null;
  errorVisible = false;
  successMessage: string | null = null;

  users = [
    { id: 1, username: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St', password: '********', role: 'user', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 2, username: 'Jane Doe', email: 'jane.doe@example.com', phone: '+9876543210', address: '456 Elm St', password: '********', role: 'admin', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 1, username: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St', password: '********', role: 'user', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 2, username: 'Jane Doe', email: 'jane.doe@example.com', phone: '+9876543210', address: '456 Elm St', password: '********', role: 'admin', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 1, username: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St', password: '********', role: 'user', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 2, username: 'Jane Doe', email: 'jane.doe@example.com', phone: '+9876543210', address: '456 Elm St', password: '********', role: 'admin', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 1, username: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890', address: '123 Main St', password: '********', role: 'user', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
    { id: 2, username: 'Jane Doe', email: 'jane.doe@example.com', phone: '+9876543210', address: '456 Elm St', password: '********', role: 'admin', createdAt: '2024-09-01', updatedAt: '2024-09-05' },
  ];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedUsers :any;

  ngOnInit(): void {
    this.paginatedUsers = this.users;


 }

  constructor(
    private userService: UserService ,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,

  ) {}

  editUser(user: any) {
    // Edit user logic here
    console.log('Edit user:', user);
  }
}
