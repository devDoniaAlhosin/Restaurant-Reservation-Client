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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink , FontAwesomeModule , NgIf , FormsModule, ReactiveFormsModule],
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
  constructor(public router: Router,
    private fb: FormBuilder,
    private ValidateService: ValidateService,
    ) {
      this.registerForm = this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          username: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
          password: [
            '',
            [Validators.required, ValidateService.strongPasswordValidator()],
          ],
          confirmPassword: ['', [Validators.required]],
          profileImage: [null],
          address:['' , [Validators.required, Validators.minLength(5) ,Validators.maxLength(100) ]],
          phoneNumber:['' , [Validators.required , Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]]
        },
        {
          validator: ValidateService.passwordMatchValidator(
            'password',
            'confirmPassword'
          ),
        }
      );
    }

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        this.selectedFile = input.files[0];
      }
    }

    onSubmit() {
      if (this.registerForm.valid) {
        const formData = new FormData();
        formData.append('username', this.registerForm.get('username')?.value);
        formData.append('email', this.registerForm.get('email')?.value);
        formData.append('phone', this.registerForm.get('phoneNumber')?.value);
        formData.append('address', this.registerForm.get('address')?.value);
        formData.append('password', this.registerForm.get('password')?.value);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
      }
    }
}
