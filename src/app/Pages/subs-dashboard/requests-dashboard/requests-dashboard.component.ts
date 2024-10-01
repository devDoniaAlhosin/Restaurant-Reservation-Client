import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BookingService } from '../../../Core/services/bookingService/booking.service'; // Import BookingService
import { Observable } from 'rxjs';

interface UpdateResponse {
  message: string;
}
interface BookingRequest {
  id: number;
  username: string;
  phone: string;
  dateTime: string;
  totalPerson: number;
  notes: string;
  status?: string;
  buttonsDisabled?: boolean;
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
  filterTime: string = ''; // Holds the selected time for filtering (HH:mm)
  searchQuery: string = ''; // Holds the search input for username

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.fetchBookingRequests();
  }

  // Fetch booking requests from the backend
  private fetchBookingRequests(): void {
    this.bookingService.getBookingRequests().subscribe({
      next: (data) => {
        this.requests = data;
        console.log('Fetched booking requests:', this.requests);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching booking requests:', error);
      }
    });
  }

 // Function to filter booking requests based on date, time, and search query
filteredRequests(): BookingRequest[] {
  return this.requests.filter(request => {
    const requestDate = request.dateTime.split(' ')[0]; // Extract date in format 'Y-m-d'
    const requestTime = this.formatTime(request.dateTime); // Format the time part

    const matchesDate = this.filterDate ? requestDate === this.filterDate : true;
    const matchesTime = this.filterTime ? requestTime === this.filterTime : true;
    const matchesSearch = this.searchQuery ? request.username.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;

    return matchesDate && matchesTime && matchesSearch;
  });
}

// Helper function to format time to 'h:i A' format
private formatTime(dateTime: string): string {
  const timePart = dateTime.split(' ')[1]; // Assuming dateTime is in 'Y-m-d H:i:s' format
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

}
