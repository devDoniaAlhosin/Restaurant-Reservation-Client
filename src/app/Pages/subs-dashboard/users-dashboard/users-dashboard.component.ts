import { Component } from '@angular/core';
import { UserService } from '../../../Core/services/userService/user.service';
import { DatePipe, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash , faKey ,  faUser ,  faIdBadge,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Core/auth/auth.service';

import {NgxPaginationModule} from 'ngx-pagination';
import { UserCreateFormComponent } from "../components/users/user-create-form/user-create-form.component";
import { ValidateService } from '../../../Core/services/validate/validate.service';
@Component({
  selector: 'app-users-dashboard',
  standalone: true,
  imports: [NgIf,
      FormsModule,
    ReactiveFormsModule
    ,NgFor, NgClass, SlicePipe, FontAwesomeModule, DatePipe, NgxPaginationModule, UserCreateFormComponent] ,
  templateUrl: './users-dashboard.component.html',
  styleUrl: './users-dashboard.component.css'
})

export class UsersDashboardComponent {
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
  editUserForm: FormGroup;
  selectedFile: File | null = null;
  errorVisible = false;
  successMessage: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedUsers :any;
user:any;
  users: any[] = [];
  ValidateService: any;

  constructor(
    private userService: UserService ,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,

  ) {
    // Edit Single  User  By Admin
    this.editUserForm = this.fb.group(
      {
      username: ['', [Validators.required, Validators.minLength(4) ]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['' , [Validators.pattern(/^(\+20[0-9]{10}|01[012][0-9]{8})$/)]],
      address: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      password: ['', [ Validators.pattern('/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/')]], // Strong one
      image: [''],
      role:['' , [ Validators.required]]
    },

  );
  }
  ngOnInit(): void {
    this.fetchUsers();
  }


//  1. Fetched All Users
 fetchUsers(): void {
  this.authService.getAllUsers().subscribe(
    (data) => {
      console.log( 'Fetching all users ' , data)
      this.users = data;
      this.userService.setUser(data);
      this.paginatedUsers = this.users;
    },
    (error) => {
      console.error('Error fetching users:', error);
    }
  );
}

  pageChanged(event: number) {
    this.currentPage = event;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      if (file && file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.editUserForm.get('image')?.setValue(this.selectedFile);
      } else {
        console.error('Selected file is not an image');
      }
    }
  }

  editUser() {
    // if (this.editUserForm.valid) {
    //   const userData = {
    //     username: this.editUserForm.value.username,
    //     email: this.editUserForm.value.email,
    //     password: this.editUserForm.value.password || undefined,
    //     address: this.editUserForm.value.address,
    //     phone: this.editUserForm.value.phone,
    //     image: this.editUserForm.value.image ? this.editUserForm.value.image.name : '',
    //     role: this.editUserForm.value.role
    //   };

    //   this.authService.updateUserProfile(userData).subscribe(
    //     response => {

    //       this.userService.setUser(response.user);
    //       console.log('User updated successfully', response);
    //       this.successMessage = "User updated successfully!";
    //       setTimeout(() => {
    //         this.errorVisible = true;
    //       }, 50);
    //       setTimeout(() => {
    //         this.errorVisible = false;
    //         this.successMessage = null;
    //       }, 10000);


    //     },
    //     error => {
    //       if (error.error.errors) {
    //         const errorMessages: string[] = [];
    //         for (const key in error.error.errors) {
    //           if (error.error.errors.hasOwnProperty(key)) {
    //             errorMessages.push(...error.error.errors[key]);
    //           }
    //         }
    //         this.errorMessage = errorMessages.join(' & ');
    //       } else if (error.message) {
    //         this.errorMessage = error.message;
    //       }

    //       console.error('Error updating user:', error);
    //       this.successMessage = null;
    //       setTimeout(() => {
    //         this.errorVisible = true;
    //       }, 50);
    //       setTimeout(() => {
    //         this.errorVisible = false;
    //         this.errorMessage = null;
    //       }, 10000);
    //     });


    //  }
  }

  deleteUser(id: number) {
    // Delete user logic here
    console.log('Delete user with ID:', id);
  }

}
