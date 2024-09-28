import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:8000/api/bookings'; 

  constructor(private http: HttpClient) {}

  // Method to send booking data to the backend
  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookingData);
  }
}
