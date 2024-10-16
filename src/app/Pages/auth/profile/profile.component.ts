import { subMonths } from 'date-fns';
import { UserService } from './../../../Core/services/userService/user.service';
import { AuthService } from './../../../Core/auth/auth.service';
import { DatePipe, NgClass, NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, ViewChild , Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationCircle ,faChevronUp,faPencil,faTrash,faChevronDown,faUser,faHome,faLock, faLocation, faKey ,faEnvelope, faPhone, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ValidateService } from '../../../Core/services/validate/validate.service';
import { CookieService } from 'ngx-cookie-service';
import { BookingService } from '../../../Core/services/bookingService/booking.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgClass,
    NgIf,
    NgStyle,DatePipe,
    TitleCasePipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  faKey=faKey
  faHome=faHome
  faUser=faUser
  faLock=faLock
  faExclamationCircle = faExclamationCircle;
  faEnvelope = faEnvelope;
  faAddressCard = faAddressCard;
  faPhone = faPhone;
  faLocation = faLocation;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faPencil = faPencil
  faTrash = faTrash

  user: any;
  isLoggedIn: boolean = false;
  errorMessage: string | null = null;
  isCollapsed = false;
  editProfileForm: FormGroup;
  selectedFile: File | null = null;
  errorVisible = false;
  successMessage: string | null = null;
  fileName: string = '';
  token?: string ;
  userCookie?: string ;
  bookings: any[] = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private userService: UserService,
    private ValidateService: ValidateService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private bookingService: BookingService,
    private cookieService: CookieService,
    private modalService: NgbModal
  ) {

    this.editProfileForm = this.fb.group(
      {
      username: ['', [Validators.required, Validators.minLength(4) ]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['' , [Validators.required ,  Validators.pattern(/^(?:\+201|01)\d{9}$/)]],
      address: ['', [Validators .required , Validators.minLength(5), Validators.maxLength(100)]],
      old_password: ['', [Validators.required]],
      password: ['', Validators.minLength(6)],
      password_confirmation: [''],
      image: [null , ''],
    },
    {
      validators: this.ValidateService.passwordMatchValidator('password', 'password_confirmation')
    }
  );
  }

  ngOnInit(): void {
    this.fetchingUserBooking()

    this.loadUserData();
    this.isLoggedIn = this.authService.isLoggedIn();

    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
  });

    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
        this.user = this.authService.getUser();

    }
  }

  loadUserData() {
    this.user = this.authService.getUser();
    console.log(this.user);
    if (this.user) {
      this.editProfileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        image: this.user.image
      });
      this.fileName = this.user.image ? 'Existing Image' : '';
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }



  onFileSelected(event: any): void {
    const file: File = event.target.files[0]; // Get the first selected file

    if (file) {
      this.selectedFile = file;
      this.fileName = file.name; // Set the file name to be displayed
    }
  }





  saveChanges() {
    if (this.editProfileForm.valid) {
      const userData = {
        username: this.editProfileForm.value.username,
        email: this.editProfileForm.value.email,
        old_password: this.editProfileForm.value.old_password,
        password: this.editProfileForm.value.password || undefined,
        password_confirmation: this.editProfileForm.value.password_confirmation || undefined, // Optional
        address: this.editProfileForm.value.address,
        phone: this.editProfileForm.value.phone,
        // image: this.editProfileForm.value.image ? this.editProfileForm.value.image.name : ''
          // image: this.selectedFile ? this.selectedFile: ''
      };

      this.authService.updateUserProfile(userData).subscribe(
        response => {
          this.userService.setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.successMessage = "Profile updated successfully!";
          Swal.fire({
            title: 'Profile successful!',
            text: 'Profile updated successful! ',
            icon: 'success',
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

          this.modalService.dismissAll();


        },
        error => {
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
        });


     }

  }


  // Get User Confirmed Bookings

  fetchingUserBooking(){
    this.bookingService.getsingleRequests().subscribe(
      (data:any[]) =>{
        console.log('Data' , data)
        this.bookings = data;
        this.bookings = data.map(booking => {
          const [date, time] = booking.date_time.split('T');
          console.log(date, time)
          return { ...booking, date, time};
        });
      }
    )
  }

}
