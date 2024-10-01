import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../Core/services/bookingService/booking.service';
import { addDays, isBefore, isAfter, isToday } from 'date-fns'
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
  successMessage: string = ''; // For success message
  validationErrors: any = {}; // To hold validation errors
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
    this.showErrorMessages = true;
    if (this.bookingForm.valid) {
      this.bookingService.createBooking(this.bookingForm.value).subscribe(
        response => {
          console.log('Booking created successfully:', response);
          this.serverError = '';
          this.successMessage = 'Booking successful!'; // Set success message
          this.serverError = ''; // Clear previous server error
          this.showErrorMessages = false; // Hide error messages on successful submission
          this.bookingForm.reset(); // Reset the form if necessary
        },
        error => {
          console.error('Error creating booking:', error);
          this.serverError = 'An error occurred while processing your request. Please try again.';

          // If error has validation details, show them
          if (error.error.errors) {
            this.validationErrors = error.error.errors; // Adjust to match your API response
          }
        }
      );
    } else {
      this.validateFormInputs();
    }
  }

  private validateFormInputs() {
    // Loop through each control and check for errors
    for (const controlName in this.bookingForm.controls) {
      const control = this.bookingForm.get(controlName);
      if (control && control.errors) {
        this.validationErrors[controlName] = control.errors; // Store errors for displaying in template
      }
    }
  }
}
