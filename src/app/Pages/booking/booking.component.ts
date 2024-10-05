import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../Core/services/bookingService/booking.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { addDays, isBefore, isAfter, isToday } from 'date-fns';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingForm!: FormGroup;
  serverError: string = '';
  showErrorMessages: boolean = false;

  constructor(private fb: FormBuilder, private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingForm = this.fb.group({
      username: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)]],
      total_person: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  onSubmit() {
    this.showErrorMessages = true; // Show error messages if form is invalid
    if (this.bookingForm.valid) {
      this.bookingService.createBooking(this.bookingForm.value).subscribe(
        response => {
          console.log('Booking created successfully:', response);
          this.serverError = '';
          this.showErrorMessages = false; // Hide error messages on successful submission

          // Show success alert using SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Booking Request Sent!',
            text: 'Your booking request has been sent successfully.',
            confirmButtonText: 'OK'
          });

          this.bookingForm.reset(); // Reset the form if necessary
        },
        error => {
          console.error('Error creating booking:', error);
          if (error.status === 422 && error.error.errors) {
            // Backend returned validation errors; iterate over them and set the error messages in the form
            for (const field in error.error.errors) {
              if (this.bookingForm.get(field)) {
                // Mark the control as touched and add an error message
                this.bookingForm.get(field)?.setErrors({ backend: error.error.errors[field].join(', ') });
              }
            }
          } else {
            this.serverError = 'An error occurred while processing your request. Please try again.';
          }
        }
      );
    }
  }

}
