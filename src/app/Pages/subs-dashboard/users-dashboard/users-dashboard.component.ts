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
  userId: number = 0;
  ValidateService: any;

  constructor(
    private userService: UserService ,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,

  ) {
    // Edit Single  User  By Admin
    this.editUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[+0-9]{10,12}')]],
      password: ['', [Validators.pattern(/^(\+20[0-9]{10}|01[012][0-9]{8})$/)]],
      address: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      role: ['', [Validators.required]],
      image:['']
    });

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.editUserForm.get("image")?.setValue(this.selectedFile);
    }
  }


  // 2. Edit a user
  editUser(userId: number) {
    this.userId = userId;
    this.authService.getSingleUser(userId).subscribe((userData) => {
      this.editUserForm.patchValue({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: userData.role,
        image :  null
      });

    });

  }

  // 2. Update a user
  updateUser(): void {
    if (this.editUserForm.valid) {
      const updatedUserData = { ...this.editUserForm.value };

      // to prevent leaving admin dashboard without admin
      const currentUser = this.authService.getUser();

      if (currentUser.id === this.userId && currentUser.role === 'admin' && updatedUserData.role === 'user') {
        this.errorMessage = "You cannot change your own role from admin to user.";
        setTimeout(() => {
          this.errorVisible = true;
        }, 50);
        setTimeout(() => {
          this.errorVisible = false;
          this.successMessage = null;
        }, 10000);

        return;
      }


      if (!updatedUserData.password) {
        delete updatedUserData.password;
      }

      this.authService.updateSingleUser(this.userId , updatedUserData ).subscribe(
        (response) => {
          this.fetchUsers();
          this.successMessage = "Profile updated successfully!";
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          setTimeout(() => {
            this.errorVisible = false;
            this.successMessage = null;
          }, 10000);

        },
        (error) => {
          if (error.error.errors) {
            const errorMessages: string[] = [];
            for (const key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                errorMessages.push(...error.error.errors[key]);
              }
            }
            this.errorMessage = errorMessages.join(' & ');
          } else if (error.message) {
            this.errorMessage = error.message;
          }

          console.error('Error updating user:', error);
          this.successMessage = null;
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          setTimeout(() => {
            this.errorVisible = false;
            this.errorMessage = null;
          }, 10000);
        }
      );
    }
  }

  // 3. Delete User
  deleteUser(id: number) {
    console.log("Attempting to delete user:", id);
    const currentUser = this.authService.getUser();
    if (currentUser.id === id && currentUser.role === 'admin') {
      console.log('Cannot delete own account, ID:', currentUser.id);
      this.errorMessage = "You can't delete your own account.";
      console.log(this.errorMessage);
      this.showTemporaryMessage();
      return;
    }

    // Proceed with user deletion if not the current user
    this.authService.deleteSingleUser(id).subscribe(
      (response) => {
        console.log(response);
        console.log('Deleted user with ID:', id);
        this.fetchUsers();
        this.successMessage = "User deleted successfully!";
        this.showTemporaryMessage(true);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

   showTemporaryMessage(isSuccess: boolean = false) {
    if (isSuccess) {
      this.errorVisible = true;
      setTimeout(() => {
        this.successMessage = null;
        this.errorVisible = false;
      }, 3000);
    } else {
      this.errorVisible = true;
      setTimeout(() => {
        this.errorMessage = null;
        this.errorVisible = false;
      }, 3000);
    }
  }



    handleError(error: any) {
    if (error.error.errors) {
      const errorMessages: string[] = [];
      for (const key in error.error.errors) {
        if (error.error.errors.hasOwnProperty(key)) {
          errorMessages.push(...error.error.errors[key]);
        }
      }
      this.errorMessage = errorMessages.join(' & ');
    } else if (error.message) {
      this.errorMessage = error.message;
    }

    console.error('Error deleting user:', error);
    this.successMessage = null;
    this.showTemporaryMessage();
  }

  createUser() {
    this.fetchUsers();
  }


}

