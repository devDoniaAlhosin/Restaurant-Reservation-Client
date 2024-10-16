import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { BookingService } from '../../../Core/services/bookingService/booking.service';
import { UserService } from '../../../Core/services/userService/user.service'; // New import for UserService
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar-dashboard',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar-dashboard.component.html',
  styleUrls: ['./calendar-dashboard.component.css'],
})
export class CalendarDashboardComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: true,
    editable: true,
    events: [], // Dynamically loaded bookings
    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    eventClick: (arg: EventClickArg) => this.handleEventClick(arg),
  };

  users: any[] = []; // Array to store user data

  constructor(private bookingService: BookingService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadBookings();
    this.loadUsers(); // Fetch users on component init
  }

  // Fetch the list of users from the backend
  loadUsers(): void {
    this.userService.getUser().subscribe(
      (users) => {
        this.users = users;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Load all bookings from the backend to display them on the calendar
  loadBookings(): void {
    this.bookingService.getBookingRequests().subscribe(
      (bookings) => {
        const events = bookings.map((booking) => ({
          id: booking['id'],
          title: `${booking['username']} (${booking['total_person']} people)`,
          start: booking['date_time'],
          backgroundColor: this.getBookingColor(booking['status']),
          extendedProps: {
            status: booking['status'],
            username: booking['username'],
            total_person: booking['total_person'],
          },
        }));

        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,
        };
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  // Open SweetAlert modal to get booking details when a date is clicked
  handleDateClick(arg: DateClickArg): void {
    let userOptions = this.users
      .map((user) => `<option value="${user.id}">${user.username} (${user.email})</option>`)
      .join('');

    Swal.fire({
      title: 'Create a New Booking',
      html: `
        <label>Select User</label>
        <select id="user-select" class="swal2-input">
          <option value="" selected disabled>Select a user</option>
          ${userOptions}
        </select>
        <input id="total-persons" type="number" min="1" class="swal2-input" placeholder="Total Persons" />
        <input id="time" type="time" class="swal2-input" placeholder="Time" />
      `,
      confirmButtonText: 'Submit Booking',
      showCancelButton: true,
      preConfirm: () => {
        const userId = (document.getElementById('user-select') as HTMLSelectElement).value;
        const totalPersons = (document.getElementById('total-persons') as HTMLInputElement).value;
        const time = (document.getElementById('time') as HTMLInputElement).value;

        if (!userId || !totalPersons || !time) {
          Swal.showValidationMessage('Please fill in all fields');
          return null;
        }

        return { userId, totalPersons, time };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedUser = this.users.find((user) => user.id === Number(result.value.userId));

        const bookingData = {
          user_id: selectedUser.id, // Use the selected user's ID
          username: selectedUser.username,
          total_person: result.value.totalPersons,
          date_time: `${arg.dateStr}T${result.value.time}:00`,  // Combine selected date and time
          status: 'pending',
        };

        // Call BookingService to create the new booking
        this.bookingService.createBooking(bookingData).subscribe(
          () => {
            Swal.fire('Booking Created', 'The booking has been successfully created.', 'success');
            this.loadBookings(); // Reload bookings to reflect the new one
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Error', 'Failed to create booking. Please try again.', 'error');
            console.error('Error creating booking:', error);
          }
        );
      }
    });
  }

  // Event click handler for managing bookings
  handleEventClick(arg: EventClickArg): void {
    const booking = arg.event.extendedProps;
    const bookingId = arg.event.id;

    if (booking['status'] === 'pending') {
      Swal.fire({
        title: `Manage Booking for ${booking['username']}`,
        html: `
          <p>Status: ${booking['status']}</p>
          <button id="accept-btn" class="swal2-confirm swal2-styled" style="margin-right: 10px;">Accept</button>
          <button id="reject-btn" class="swal2-cancel swal2-styled">Reject</button>
        `,
        showConfirmButton: false,
        didOpen: () => {
          document.getElementById('accept-btn')?.addEventListener('click', () => this.updateBookingStatus(Number(bookingId), 'accepted'));
          document.getElementById('reject-btn')?.addEventListener('click', () => this.updateBookingStatus(Number(bookingId), 'rejected'));
        },
      });
    } else {
      Swal.fire(`Booking for ${booking['username']}`, `Status: ${booking['status']}`, 'info');
    }
  }

  updateBookingStatus(bookingId: number, status: string): void {
    this.bookingService.updateBookingStatus(bookingId, status, null).subscribe(
      () => {
        Swal.fire('Success', `Booking status updated to ${status}`, 'success');
        this.loadBookings(); // Reload bookings after update
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Error', 'Failed to update booking status', 'error');
        console.error('Error updating booking status:', error);
      }
    );
  }

  getBookingColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#f39c12'; // Yellow
      case 'accepted':
        return '#28a745'; // Green
      case 'rejected':
        return '#e74c3c'; // Red
      default:
        return '#007bff'; // Blue for other statuses
    }
  }
}
