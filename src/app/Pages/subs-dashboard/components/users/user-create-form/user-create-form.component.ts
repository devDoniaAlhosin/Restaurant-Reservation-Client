import { AuthService } from './../../../../../Core/auth/auth.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {    faPencil ,
  faTrash,
  faKey ,
  faUser ,
  faIdBadge,
  faEnvelope,}  from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../../../Core/services/userService/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-create-form',
  standalone: true,
  imports: [FontAwesomeModule, NgClass , NgIf , NgFor, ReactiveFormsModule ],
  templateUrl: './user-create-form.component.html',
  styleUrl: './user-create-form.component.css'
})
export class UserCreateFormComponent {
  @Output() userCreated = new EventEmitter<void>();
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
  createUserForm: FormGroup;
  selectedFile: File | null = null;
  errorVisible = false;
  successMessage: string | null = null;
  users: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedUsers :any;

  constructor(
    private userService: UserService ,
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
  ){
     // Add Single  User  By Admin
     this.createUserForm = this.fb.group(
      {
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['' , [Validators.required ,Validators.pattern(/^(\+20[0-9]{10}|01[012][0-9]{8})$/)]],
      address: ['', [Validators.required,Validators.minLength(5), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // image: [''],
      role:['' , [ Validators.required]]
    },
  );
  }

  ngOnInit(): void {

  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }





//   createUser(): void {
//     if (this.createUserForm.valid) {
//       const formData = new FormData();
//       formData.append('username', this.createUserForm.get('username')?.value);
//       formData.append('email', this.createUserForm.get('email')?.value);
//       formData.append('phone', this.createUserForm.get('phone')?.value);
//       formData.append('address', this.createUserForm.get('address')?.value);
//       formData.append('password', this.createUserForm.get('password')?.value);
//       formData.append('role', this.createUserForm.get('role')?.value);

//       if (this.selectedFile) {
//         formData.append('image', this.selectedFile, this.selectedFile.name);
//       }
//  // Debugging output
//  console.log('Form Data:', {
//   username: this.createUserForm.get('username')?.value,
//   email: this.createUserForm.get('email')?.value,
//   phone: this.createUserForm.get('phone')?.value,
//   address: this.createUserForm.get('address')?.value,
//   password: this.createUserForm.get('password')?.value,
//   role: this.createUserForm.get('role')?.value,
//   image: this.selectedFile ? this.selectedFile.name : 'No file selected'
// });

// this.formData = {
//   {
//     username: this.createUserForm.get('username')?.value,
//     email: this.createUserForm.get('email')?.value,
//     phone: this.createUserForm.get('phone')?.value,
//     address: this.createUserForm.get('address')?.value,
//     password: this.createUserForm.get('password')?.value,
//     role: this.createUserForm.get('role')?.value,
//     image: this.selectedFile ? this.selectedFile.name : 'No file selected'
//   }

// }


//       this.authService.createSingleUser(formData).subscribe(
//         (response) => {
//           console.log('User created successfully:', response);
//         },
//         (error) => {
//           console.error('Error creating user:', error);
//           if (error.error && error.error.errors) {
//             this.errorMessage = Object.values(error.error.errors).flat().join(' & ');
//           } else {
//             this.errorMessage = 'An unexpected error occurred.';
//           }
//         }
//       );
//     } else {
//       this.errorMessage = 'Please fill in all required fields.';
//     }
//   }
createUser(): void {
  if (this.createUserForm.valid) {
    const userData = {
      username: this.createUserForm.get('username')?.value,
      email: this.createUserForm.get('email')?.value,
      phone: this.createUserForm.get('phone')?.value,
      address: this.createUserForm.get('address')?.value,
      password: this.createUserForm.get('password')?.value,
      role: this.createUserForm.get('role')?.value,
      // image: this.selectedFile ? this.selectedFile.name : null
    };


    console.log('User Data:', userData);


    this.authService.createSingleUser(userData).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'User Created Successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.successMessage = "User Created successfully!";
        this.showTemporaryMessage(true);
        this.userCreated.emit();
      },
      (error) => {
        console.error('Error creating user:', error);
        if (error.error && error.error.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join(' & ');
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        Swal.fire({
          icon: 'error',
          title: 'User Creation Failed',
          text: this.errorMessage,
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    );
  } else {
    this.errorMessage = 'Please fill in all required fields.';
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: this.errorMessage,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
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





}
