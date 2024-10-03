import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../../Core/services/bookingService/booking.service'; // Import BookingService
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

interface UpdateResponse {
  message: string;
}

interface BookingRequest {
  id: number;
  username: string;
  phone: string;
  date_time: string;
  total_person: number;
  notes: string;
  status?: string;
  buttonsDisabled?: boolean;
  date?: string; // Added date property
  time?: string; // Added time property
}

@Component({
  selector: 'app-requests-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests-dashboard.component.html',
  styleUrls: ['./requests-dashboard.component.css']
})
export class RequestsDashboardComponent implements OnInit {
  requests: BookingRequest[] = [];
  filterDate: string = ''; // Holds the selected date for filtering (YYYY-MM-DD)
  filterYear: string = ''; // Holds the selected year for filtering
  filterMonth: string = ''; // Holds the selected month for filtering
  months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ]; // Array of months
  years: string[] = []; // Array to hold available years
  searchQuery: string = ''; // Holds the search input for username

  constructor(private bookingService: BookingService) {
    this.populateYears(); // Populate years on initialization
  }

  ngOnInit(): void {
    this.fetchBookingRequests();
  }

  // Fetch booking requests from the backend
  private fetchBookingRequests(): void {
    this.bookingService.getBookingRequests().subscribe({
      next: (data) => {
        // Split dateTime into date and time for filtering purposes
        this.requests = data.map(request => ({
          ...request,
          date: request.date_time.split(' ')[0], // Extract the date part (YYYY-MM-DD)
          time: this.formatTime(request.date_time) // Format the time part (h:i A)
        }));
        console.log('Fetched booking requests:', this.requests);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching booking requests:', error);
      }
    });
  }

  // Populate years for filtering
  private populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) { // Adjust range as needed
      this.years.push(year.toString());
    }
  }

  // Function to filter booking requests based on date, month, year, and search query
  filteredRequests(): BookingRequest[] {
    return this.requests.filter(request => {
      // Always show the request if no filters are applied
      if (!this.filterDate && !this.filterMonth && !this.filterYear && !this.searchQuery) {
        return true; // Show all bookings
      }

      let matchesDate = true;
      let matchesMonth = true;
      let matchesYear = true;
      let matchesSearch = true;

      // Check for date filtering
      if (this.filterDate) {
        if (!request.date_time) {
          return false; // Skip requests with undefined date_time
        }
        const requestDate = request.date_time.split(' ')[0]; // Extract date
        matchesDate = requestDate === this.filterDate; // Match date
      }

      // Check for month filtering
      if (this.filterMonth) {
        if (!request.date_time) {
          return false; // Skip requests with undefined date_time
        }
        const requestMonth = request.date_time.split('-')[1]; // Extract month (MM)
        matchesMonth = requestMonth === this.filterMonth; // Match month
      }

      // Check for year filtering
      if (this.filterYear) {
        if (!request.date_time) {
          return false; // Skip requests with undefined date_time
        }
        const requestYear = request.date_time.split('-')[0]; // Extract year (YYYY)
        matchesYear = requestYear === this.filterYear; // Match year
      }

      // Check for username search
      if (this.searchQuery) {
        matchesSearch = request.username.toLowerCase().includes(this.searchQuery.toLowerCase());
      }

      return matchesDate && matchesMonth && matchesYear && matchesSearch; // Return true if all match
    });
  }

  // Helper function to format the time part of dateTime
  private formatTime(dateTime: string): string {
    if (!dateTime) {
      console.warn('Invalid dateTime:', dateTime); // Log if dateTime is undefined
      return ''; // Return an empty string or a default value
    }

    const timePart = dateTime.split(' ')[1]; // Assuming dateTime is in 'Y-m-d H:i:s' format
    if (!timePart) {
      console.warn('No time part found for dateTime:', dateTime);
      return ''; // Return an empty string if timePart is not found
    }

    const [hour, minute] = timePart.split(':');
    const hours = parseInt(hour);
    const isPM = hours >= 12;
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${minute} ${isPM ? 'PM' : 'AM'}`;
  }

  // Accept booking request
  acceptRequest(request: BookingRequest): void {
    request.status = 'accepted';
    request.buttonsDisabled = true;
    this.updateBookingStatus(request.id, 'accepted', request.notes);
  }

  // Reject booking request
  rejectRequest(request: BookingRequest): void {
    request.status = 'rejected';
    request.buttonsDisabled = true;
    this.updateBookingStatus(request.id, 'rejected', request.notes);
  }

  // Function to update booking status
  private updateBookingStatus(id: number, status: string, notes: string | null): void {
    this.bookingService.updateBookingStatus(id, status, notes).subscribe({
      next: response => {
        console.log('Status updated successfully:', response);
        // Update the local list of requests to reflect changes
        this.requests = this.requests.map(req =>
          req.id === id ? { ...req, status } : req
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating status:', error);
        // If there's an error, re-enable the buttons for retry
        this.requests = this.requests.map(req =>
          req.id === id ? { ...req, buttonsDisabled: false } : req
        );
      }
    });
  }

  deleteBooking(id: number): void {
    console.log('Delete button clicked for booking ID:', id); // Debug log

    // SweetAlert confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this booking!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.deleteBooking(id).subscribe({
          next: (response) => {
            console.log('Booking deleted successfully:', response);
            // Remove the deleted booking from the local list
            this.requests = this.requests.filter(request => request.id !== id);

            // SweetAlert success message
            Swal.fire(
              'Deleted!',
              'Booking has been deleted successfully.',
              'success'
            );
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting booking:', error);

            // SweetAlert error message
            Swal.fire(
              'Error!',
              'An error occurred while deleting the booking. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }
}
