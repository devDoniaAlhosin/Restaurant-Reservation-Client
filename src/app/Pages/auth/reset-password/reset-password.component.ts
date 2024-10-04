import { Component } from '@angular/core';
import { AuthService } from '../../../Core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  resetForm: FormGroup ;
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
     private fb: FormBuilder,
     private route: ActivatedRoute,

    ) {
    if (authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.resetForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, ValidateService.strongPasswordValidator()],
        ],
        confirmPassword: ['', [Validators.required]],


      },
      {
        validator: ValidateService.passwordMatchValidator(
          'password',
          'confirmPassword'
        ),
      }
    );


  }

  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      this.token = params.get('token')!;
    });
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || '';
    });
    this.resetForm.patchValue({
      email: this.email,
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordMismatch: true };
  }

  requestResetLink() {
    if (this.resetForm.valid) {
      const formData = new FormData();
      formData.append('token', this.token);
        formData.append('email', this.resetForm.get('email')?.value);
        formData.append('password', this.resetForm.get('password')?.value);
        formData.append('password_confirmation', this.resetForm.get('confirmPassword')?.value);

        console.log('Token:', this.token);
        console.log('Email:', this.resetForm.get('email')?.value);
        console.log('Password:', this.resetForm.get('password')?.value);
        console.log('Confirm Password:', this.resetForm.get('confirmPassword')?.value);
        this.authService.resetPassword(formData).subscribe(
          response => {
            this.successMessage = 'Password reset successful!';
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          setTimeout(() => {
            this.errorVisible = false;
            this.errorMessage = null;
          }, 10000);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);

          }, error => {
            console.error('Password reset failed', error);
            this.errorMessage = 'Password reset failed. Please try again.';
            setTimeout(() => {
              this.errorVisible = true;
            }, 50);
            setTimeout(() => {
              this.errorVisible = false;
              this.errorMessage = null;
            }, 10000);
          });


    }
  }

}
