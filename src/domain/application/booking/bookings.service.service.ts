// src/app/services/bookings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking } from '../../interface/booking';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../notification/notification.service';
import { LoaderService } from '../loader/loader.service';
import { UserDataService } from '../../infrastructure/user/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
private apiUrl = environment.apiUrl;

private bookingHistorySubject = new BehaviorSubject<any>([]);
bookingHistory$ = this.bookingHistorySubject.asObservable();

  constructor(private http: HttpClient,
    private readonly userDataService: UserDataService,
    private readonly notificationService: NotificationService,
    private readonly loaderService : LoaderService
  ) { 
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

  getUserBookingHistory(clientId: number, userType: string) {
    this.loaderService.show();
    this.userDataService.getUserBookingHistory(clientId, userType).subscribe({
      next: (history: Booking[]) => {
        this.bookingHistorySubject.next(history);
        this.loaderService.show();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load booking history.');
        this.loaderService.hide();
      }
    });

  }

  cancelBooking(bookingId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/ServiceBooking/${bookingId}`,);
  }

  loadAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/ServiceBooking`,);
  }

}
