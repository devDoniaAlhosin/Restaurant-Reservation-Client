import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle , faEnvelope, faPhone, faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
     NgFor ,
      NgClass ,
       NgIf
    ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  faExclamationCircle=faExclamationCircle
  faEnvelope=faEnvelope
  faAddressCard=faAddressCard
  faPhone=faPhone

  editProfileForm: FormGroup;



  constructor(private fb: FormBuilder) {
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
    });
  }

  ngOnInit(): void {
    editProfileForm: FormGroup;
  }

  saveChanges() {
    if (this.editProfileForm.valid) {

    } else {
      this.editProfileForm.markAllAsTouched();
    }
  }

}
