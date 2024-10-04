import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../Core/services/bookingService/booking.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-mybookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css']
})
export class MybookingsComponent implements OnInit {
  bookings: any[] = [];
  editingBooking: any | null = null;
  dateError: string | null = null;
  timeError: string | null = null;
  totalPersonsError: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.fetchBookings();
  }

  // fetchBookings() {
  //   this.bookingService.getsingleRequests().subscribe(
  //     (data) => {
  //       this.bookings = data.map(booking => {
  //         const dateObj = new Date(booking.date_time);
  //         const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  //         const dateString = dateObj.toLocaleDateString();
  //         return { ...booking, time: timeString, date: dateString };
  //       });
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error fetching bookings:', error);
  //     }
  //   );
  // }
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
      this.totalPersonsError = null; // Reset error if valid
    }
  }

  onEditBooking(booking: any) {
    this.editingBooking = { ...booking };
  }
  onSaveBooking() {
    // Reset error messages before validation
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
                // Handle error from backend
                if (error.error && error.error.errors) {
                    if (error.error.errors.date) {
                        this.dateError = error.error.errors.date[0];
                    }
                    if (error.error.errors.time) {
                        this.timeError = error.error.errors.time[0];
                    }
                }
                // Return empty observable to complete the stream
                return of(null);
            })
        ).subscribe(response => {
            if (response) {
                // Update the local bookings list
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
// onSaveBooking() {
//   // Reset error messages before validation
//   this.dateError = null;
//   this.timeError = null;

//   // Validate date and time
//   this.validateDate();
//   this.validateTime();

//   // Check for validation errors before proceeding
//   if (this.dateError || this.timeError) {
//       return; // Don't proceed if there are errors
//   }

//   if (this.editingBooking) {
//       // Create a bookingData object for user update
//       const bookingData = {
//           date: this.editingBooking.date, // Send date separately
//           time: this.editingBooking.time,   // Send time separately
//           total_person: this.editingBooking.total_person,
//           notes: this.editingBooking.notes
//       };

//       this.bookingService.updateUserBooking(this.editingBooking.id, bookingData).pipe(
//           catchError((error: HttpErrorResponse) => {
//               // Handle error from backend
//               if (error.error && error.error.errors) {
//                   if (error.error.errors.date) {
//                       this.dateError = error.error.errors.date[0]; // Capture date error
//                   }
//                   if (error.error.errors.time) {
//                       this.timeError = error.error.errors.time[0]; // Capture time error
//                   }
//               }
//               // Return empty observable to complete the stream
//               return of(null);
//           })
//       ).subscribe(response => {
//           if (response) {
//               // Update the local bookings list
//               const index = this.bookings.findIndex(b => b.id === this.editingBooking.id);
//               if (index > -1) {
//                   // Format the new time for display (AM/PM)
//                   const formattedTime = this.formatTime(this.editingBooking.time);
//                   // Update the booking object with new details
//                   this.bookings[index] = {
//                       ...this.bookings[index], // Keep existing properties
//                       date_time: this.getDateTimeString(this.editingBooking.date, formattedTime), // Update date_time
//                       total_person: this.editingBooking.total_person,
//                       notes: this.editingBooking.notes,
//                       time: formattedTime // Ensure the time is updated in the booking list
//                   };

//                   // Also update the editingBooking to reflect changes on the card
//                   this.editingBooking.time = formattedTime; // Make sure to update the time in editingBooking
//               }
//               this.editingBooking = null; // Close the edit form

//               // Show success alert using SweetAlert
//               Swal.fire({
//                   title: 'Success!',
//                   text: 'Booking updated successfully.',
//                   icon: 'success',
//                   confirmButtonText: 'Okay'
//               });
//           }
//       });
//   }
// }


formatTime(time: string): string {
  const date = new Date(`1970-01-01T${time}:00`); // Assuming time is in HH:MM:SS format
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}


  getDateTimeString(date: string, time: string): string {
    return `${date} ${time}`;
  }


  // getDateTimeString(date: string, time: string): string {
  //   return new Date(`${date} ${time}`).toISOString(); // Adjust as necessary for your backend
  // }

  onCancelEdit() {
    this.editingBooking = null;
  }
}
