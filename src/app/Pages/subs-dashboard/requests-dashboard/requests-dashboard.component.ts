import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  email_sent:boolean;
  status?: string;
  buttonsDisabled?: boolean;
  date?: string;
  time?: string;
}

@Component({
  selector: 'app-requests-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule , DatePipe],
  templateUrl: './requests-dashboard.component.html',
  styleUrls: ['./requests-dashboard.component.css']
})
export class RequestsDashboardComponent implements OnInit {
  requests: BookingRequest[] = [];
  filterDate: string = '';
  filterYear: string = '';
  filterMonth: string = '';
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
  ];
  years: string[] = [];
  searchQuery: string = '';

  // Pagination properties
  currentPage: number = 1; // Current page
  itemsPerPage: number = 5; // Items per page
  totalItems: number = 0; // Total items

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

        this.requests = data.map(request => ({
          ...request,
          date: request.date_time.split('T')[0],
          time: this.formatTime(request.date_time)
        }));
        console.log(this.requests)
        this.totalItems = this.requests.length; // Update total items
        console.log('Fetched booking requests:', this.requests);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching booking requests:', error);
      }
    });
  }
  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Navigate to the previous page
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navigate to the next page
  goToNextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
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
    const filtered = this.requests.filter(request => {
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

    // Handle pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
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
        this.fetchBookingRequests();

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

  // Go to the next page
  nextPage(): void {
    if ((this.currentPage * this.itemsPerPage) < this.totalItems) {
      this.currentPage++;
    }
  }

  // Go to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Set current page
  setPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
    }
  }

  // Reset pagination
  resetPagination(): void {
    this.currentPage = 1; // Reset to the first page
  }
}
