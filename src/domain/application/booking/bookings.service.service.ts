// src/app/services/bookings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../../interface/booking';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { 
    const headers = this.validateToken();
  }

  validateToken() {
    const token = localStorage.getItem('authToken'); // You might need a token for this as well
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  saveBookingDetails(booking : any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/ServiceBooking`, booking);
  }

  loadBookingDetails(id : number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/ServiceBooking/${id}`);
  }

  getUserBookingHistory(clientId: number, userType: string): Observable<any[]> {
    //const params = new HttpParams().set('serviceType', serviceType); // Pass the service type as a query parameter
    return this.http.get<any[]>(`${this.apiUrl}/ServiceBooking/${clientId}/${userType}/history`);
  }

  cancelBooking(bookingId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/ServiceBooking/${bookingId}`,);
  }

  loadAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/ServiceBooking`,);
  }

}
