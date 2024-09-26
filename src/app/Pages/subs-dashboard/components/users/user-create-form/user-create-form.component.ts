import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {    faPencil ,
  faTrash,
  faKey ,
  faUser ,
  faIdBadge,
  faEnvelope,}  from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-user-create-form',
  standalone: true,
  imports: [FontAwesomeModule, NgClass , NgIf , NgFor],
  templateUrl: './user-create-form.component.html',
  styleUrl: './user-create-form.component.css'
})
export class UserCreateFormComponent {
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
  newUser = {
    username: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    role: 'user'
  };
  createUser() {
    // this.userService.createUser(this.newUser).subscribe(
    //   (response) => {
    //     console.log('User created successfully', response);
    //     this.fetchUsers(); // Refresh the user list
    //     this.newUser = { username: '', email: '', phone: '', password: '', address: '', role: 'user' }; // Reset the form
    //   },
    //   (error) => {
    //     console.error('Error creating user:', error);
    //   }
    // );
  }
}
