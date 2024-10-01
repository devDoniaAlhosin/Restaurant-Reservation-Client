import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8000/api/bookings';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createBooking(bookingData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from AuthService if needed
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, bookingData, { headers });
  }

   // Fetch all booking requests
  //  getBookingRequests(): Observable<any[]> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //   });

  //   return this.http.post<any[]>(this.apiUrl, { headers });
  // }
   getBookingRequests(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers }); // Changed to GET method
  }

  // Update booking status
  updateBookingStatus(id: number, status: string, notes: string | null): Observable<any> {
    const url = `${this.apiUrl}/${id}/status`; // The endpoint for updating the booking status
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const payload = { status, notes }; // Create the payload to send to the API

    return this.http.patch<any>(url, payload, { headers });
  }
}

