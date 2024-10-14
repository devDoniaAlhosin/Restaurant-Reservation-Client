import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { BookingService } from '../../../Core/services/bookingService/booking.service';
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
    events: [],
    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    eventClick: (arg: EventClickArg) => this.handleEventClick(arg),
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookingRequests().subscribe(
      (bookings) => {

        const events = bookings.map((booking) => ({
          id: booking['id'],
          start: booking['date_time'],
          extendedProps: {
            status: booking['status'],
            username: booking['username'],
            total_person:booking['total_person']
          },
        }));

        // Update the calendar options with the bookings events
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,
          eventContent: (arg) => {
            const { status, username } = arg.event.extendedProps;
            return {
              html: `
                <div style="display: flex; align-items: center; width: 100%; padding: 5px; background-color: ${this.getBookingColor(status)}; border-radius: 5px;">
                  <div class="status-box" style="background-color: ${this.getBookingColor(status)}; width: 20px; height: 15px; border-radius: 2px; margin-right: 2px;"></div>
                  ${username} [${status}]
                </div>
              `,
            };
          },
        };
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }


  handleDateClick(arg: DateClickArg): void {
    alert('Date clicked: ' + arg.dateStr);
  }

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
          // Add event listeners for the custom buttons
          document.getElementById('accept-btn')?.addEventListener('click', () => this.updateBookingStatus(Number(bookingId), 'accepted'));
          document.getElementById('reject-btn')?.addEventListener('click', () => this.updateBookingStatus(Number(bookingId), 'rejected'));
        }
      });
    } else {
      Swal.fire(`Booking for ${booking['username']}`, `Status: ${booking['status']}`);
    }
  }

  updateBookingStatus(bookingId: number, status: string): void {
    this.bookingService.updateBookingStatus(bookingId, status, null).subscribe(
      () => {
        Swal.fire('Success', `Booking status updated to ${status}`, 'success');
        this.loadBookings();
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
        return '#f39c12';
      case 'accepted':
        return '#28a745';
      case 'rejected':
        return '#e74c3c';
      default:
        return '#007bff';
    }
  }
}

