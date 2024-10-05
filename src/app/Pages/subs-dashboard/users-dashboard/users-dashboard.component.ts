import { Component, ElementRef, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
import modal from 'bootstrap/js/dist/modal';
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
  @ViewChild('editUserModal') editUserModal!: ElementRef;

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

  // Filtering
  selectedRole: string = '';
  filteredUsers: any[] = [];
  searchUsername: string = '';

  constructor(
    private userService: UserService ,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,

  ) {

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
  onUserCreated(): void {
    this.fetchUsers();
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesRole = this.selectedRole ? user.role === this.selectedRole : true;
      const matchesUsername = this.searchUsername ? user.username.toLowerCase().includes(this.searchUsername.toLowerCase()) : true;
      return matchesRole && matchesUsername;
    });
    this.updatePagination();
  }

//  1. Fetched All Users
 fetchUsers(): void {
  this.authService.getAllUsers().subscribe(
    (data) => {
      console.log( 'Fetching all users ' , data)
      this.users = data;
      this.filteredUsers = data;
      // this.paginatedUsers = this.users;
      this.updatePagination();
    },
    (error) => {
      console.error('Error fetching users:', error);
    }
  );
}

  pageChanged(event: number) {
    this.currentPage = event;
  }
  updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
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
          this.successMessage = "User updated successfully!";
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User Updated Successfully!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          setTimeout(() => {
            this.errorVisible = false;
            this.successMessage = null;
          }, 10000);
          this.closeModal();
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
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: this.errorMessage,
              // toast: true,
              // position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

          } else if (error.message) {
            this.errorMessage = error.message;
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: error.message,
              // toast: true,
              // position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
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
    const currentUser = this.authService.getUser();
    if (currentUser.id === id && currentUser.role === 'admin') {
      this.errorMessage = "You can't delete your own account.";
      this.showTemporaryMessage();
      return;
    }
    this.authService.deleteSingleUser(id).subscribe(
      (response) => {
        this.fetchUsers();
        this.successMessage = "User deleted successfully!";
        this.showTemporaryMessage(true);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  closeModal() {
    const modalElement = this.editUserModal.nativeElement;
    const modalInstance = modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

   showTemporaryMessage(isSuccess: boolean = false) {
    if (isSuccess) {
      this.errorVisible = true;
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User Deleted Successfully!',
        // toast: true,
        // position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setTimeout(() => {
        this.successMessage = null;
        this.errorVisible = false;
      }, 3000);
    } else {
      this.errorVisible = true;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed in Deleting User! ',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
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
  showToast(message: string, icon: 'success' | 'error'): void {
    Swal.fire({
      icon: icon,
      title: icon === 'success' ? 'Success' : 'Error',
      text: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }


}

