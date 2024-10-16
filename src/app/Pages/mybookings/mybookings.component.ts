import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../Core/services/bookingService/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-mybookings',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink, NgxPaginationModule , DatePipe ],
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css']
})
export class MybookingsComponent implements OnInit {
  bookings: any[] = [];
  editingBooking: any | null = null;
  dateError: string | null = null;
  timeError: string | null = null;
  totalPersonsError: string | null = null;
  currentPage = 1;


  paymentStatus: { [key: number]: boolean } = {};
  constructor(private bookingService: BookingService,private router: Router) {}

  ngOnInit() {
    this.fetchBookings();
  }


  fetchBookings() {
    this.bookingService.getsingleRequests().subscribe(
        (data) => {
            this.bookings = data.map(booking => {
                console.log('Raw booking date_time:', booking.date_time);
                const [date, time] = booking.date_time.split('T');

                return { ...booking, date, time };


            });
        },
        (error: HttpErrorResponse) => {
            console.error('Error fetching bookings:', error);
        }
    );
}
payNow(booking: any) {
  const paymentLink = 'https://buy.stripe.com/test_8wMeVv1SFfYvgb6289';
  window.open(paymentLink, '_blank');
  this.paymentStatus[booking.id] = true;
  this.router.navigate(['/payment-success']);
}

  validateDate() {
    this.dateError = null;
    if (this.editingBooking) {
      const date = new Date(this.editingBooking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!this.editingBooking.date) {
        this.dateError = 'Date is required.';
      } else if (date < today) {
        this.dateError = 'Date cannot be in the past.';
      }
    }
  }

  validateTime() {
    this.timeError = null;
    const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?[APap][mM]$/;
    if (this.editingBooking?.time && !timeFormat.test(this.editingBooking.time)) {
      this.timeError = 'Invalid time format. Please use hh:mm AM/PM.';
    }
  }

  validateTotalPersons() {
    const totalPersons = this.editingBooking?.total_person;
    if (totalPersons < 1) {
      this.totalPersonsError = 'Number of persons must be at least 1.';
    } else {
      this.totalPersonsError = null;
    }
  }

  onEditBooking(booking: any) {
    this.editingBooking = { ...booking,  time: this.formatTime(booking.date_time) };

  }
  onSaveBooking() {
    this.dateError = null;
    this.timeError = null;

    // Validate date and time
    this.validateDate();
    this.validateTime();


    if (this.dateError || this.timeError) {
        return;
    }

    if (this.editingBooking) {

        const bookingData = {
            date: this.editingBooking.date,
            time: this.editingBooking.time,
            total_person: this.editingBooking.total_person,
            notes: this.editingBooking.notes
        };

        this.bookingService.updateUserBooking(this.editingBooking.id, bookingData).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.error && error.error.errors) {
                    if (error.error.errors.date) {
                        this.dateError = error.error.errors.date[0];
                    }
                    if (error.error.errors.time) {
                        this.timeError = error.error.errors.time[0];
                    }
                }
                return of(null);
            })
        ).subscribe(response => {
            if (response) {
              this.fetchBookings();
                const index = this.bookings.findIndex(b => b.id === this.editingBooking.id);
                if (index > -1) {

                    this.bookings[index] = {
                        ...this.bookings[index],
                        date_time: this.getDateTimeString(this.editingBooking.date, this.editingBooking.time),
                        total_person: this.editingBooking.total_person,
                        notes: this.editingBooking.notes,
                    };
                }
                this.editingBooking = null;
                Swal.fire({
                    title: 'Success!',
                    text: 'Booking updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                });
            }
        });
    }
}

formatTime(utcTime: string): string {
  const date = new Date(utcTime);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;

  return  formattedTime
}


  getDateTimeString(date: string, time: string): string {
    return `${date} ${time}`;
  }


  onCancelEdit() {
    this.editingBooking = null;
  }
}
