import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
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
import Swal from 'sweetalert2';
import { AuthService } from '../../Core/auth/auth.service';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, NgIf, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  ContactUsForm:FormGroup;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ){
    this.ContactUsForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required , Validators.minLength(4)]],
        subject: ['', [Validators.required]],
        message: ['', [Validators.required]],

      },

    );

  }

  onSubmit(){
    if (this.ContactUsForm.valid) {
      const formData = new FormData();
      formData.append('name', this.ContactUsForm.get('name')?.value);
      formData.append('email', this.ContactUsForm.get('email')?.value);
      formData.append('subject', this.ContactUsForm.get('subject')?.value);
      formData.append('message', this.ContactUsForm.get('message')?.value);

      console.log('Contact Us Form ' , formData)

      this.authService.SendContactMessage(formData).subscribe(
        response => {
        Swal.fire({
          title: 'Your Message Sent Successfully!',
            text: 'Message Sent Successfully! You will receive an email confirmation.',
            icon: 'success',
            showConfirmButton: false,
            timer: 4000
        });
      }, error => {
        console.error('failed process!', error);
        Swal.fire({
          title: 'process failed!',
          text: 'failed. Please try again',
          icon: 'error',
          showConfirmButton: false,
          timer: 4000
        });
      }
    )
  }
}

}
