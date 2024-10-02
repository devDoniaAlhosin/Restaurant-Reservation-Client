import { Component } from '@angular/core';
import { AuthService } from '../../../Core/auth/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormGroup, FormsModule,
   ReactiveFormsModule, Validators ,FormBuilder} from '@angular/forms';
import { UserService } from '../../../Core/services/userService/user.service';
import { ValidateService } from './../../../Core/services/validate/validate.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgClass , NgIf , FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token:string = "";
  forgetForm: FormGroup | undefined;
  email: string = "";
  password: string = "";
  password_confirmation: string = "";
  message: string = "";
  error: string = "";
  successMessage: string | null = null;
  errorMessage: string | null = null;
  errorVisible = false;

  constructor(
    private authService: AuthService,
     private router: Router,
     private ValidateService: ValidateService,
     private userService :UserService,
     private fb: FormBuilder

    ) {
    // if (authService.isLoggedIn()) {
    //   this.router.navigate(['/']);
    // }
  }
  // ngOnInit() {
  //   this.forgetForm = this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(8)]],
  //     confirmPassword: ['', Validators.required]
  //   }, { validators: this.passwordMatchValidator });
  // }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordMismatch: true };
  }

  requestResetLink() {
    // if (this.forgetForm.valid) {
    //   // Call your reset password service here
    // const token =   localStorage.getItem('resetPassword')
    //   const { email, password , confirmPassword } = this.forgetForm.value;
    //   this.authService.resetPassword(email, password , confirmPassword , this.token).subscribe(
    //     response => {
    //       this.successMessage = "Reset link sent to your email!";
    //       this.errorMessage = null;
    //       // Optionally navigate to another page or clear the form
    //       this.forgetForm.reset();
    //     },
    //     error => {
    //       this.errorMessage = error.message || "An error occurred while sending the reset link.";
    //       this.successMessage = null;
    //     }
    //   );
    // }
  }

}
