import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faFacebook , faGoogle , faLinkedin , faGithub } from '@fortawesome/free-brands-svg-icons';
import { ValidateService } from './../../../Core/services/validate/validate.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../../Core/services/userService/user.service';
import { AuthService } from '../../../Core/auth/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink , FontAwesomeModule , NgIf , FormsModule, ReactiveFormsModule , NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  faFacebook= faFacebook;
  faGoogle=faGoogle
  faGithub=faGithub
  faLinkedin=faLinkedin
  registerForm: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  user: any = null;
  isLoggedIn: boolean = false;
  private unsubscribe$ = new Subject<void>();
  errorVisible = false;



  constructor(
    public router: Router,
    private fb: FormBuilder,
    private ValidateService: ValidateService,
    private authService: AuthService,
    private userService :UserService
    ) {
      this.isLoggedIn = this.authService.isLoggedIn();
      if (this.isLoggedIn) {
        this.user = this.authService.getUser();
        this.router.navigate(['/']);
      }


      this.registerForm = this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          username: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
          password: [
            '',
            [Validators.required, ValidateService.strongPasswordValidator()],
          ],
          confirmPassword: ['', [Validators.required]],
          profileImage: ['' , [Validators.required]],
          address:['' , [Validators.minLength(5) ,Validators.maxLength(100) ]],
          phoneNumber:['' , [Validators.required ,Validators.pattern(/^(\+20[0-9]{10}|01[012][0-9]{8})$/)
            // +201061642356 +201112345678  01298765432
          ]]
        },
        {
          validator: ValidateService.passwordMatchValidator(
            'password',
            'confirmPassword'
          ),
        }
      );
    }


    onFileSelected(event: any): void {
       this.selectedFile = event.target.files[0];
    }




    onSubmit() {
      if (this.registerForm.valid) {
        const formData = new FormData();
        formData.append('username', this.registerForm.get('username')?.value);
        formData.append('email', this.registerForm.get('email')?.value);
        formData.append('phone', this.registerForm.get('phoneNumber')?.value);
        formData.append('address', this.registerForm.get('address')?.value);
        formData.append('password', this.registerForm.get('password')?.value);
        formData.append('password_confirmation', this.registerForm.get('confirmPassword')?.value);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        this.authService.register(formData).subscribe(response => {
          this.successMessage = 'Registration successful! Please check your email to verify your account.';
          setTimeout(() => {
            this.errorVisible = true;
          }, 50);
          setTimeout(() => {
            this.errorVisible = false;
            this.errorMessage = null;
          }, 10000);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 7000);

          // this.userService.setUser(response.user);
          localStorage.setItem('verifyToken', response.token);
          // localStorage.setItem('user', JSON.stringify(response.user));
          // this.router.navigate(['/profile']);
        }, error => {
          console.error('Registration failed', error);
          this.errorMessage = 'Registration failed. Please try again.';
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
