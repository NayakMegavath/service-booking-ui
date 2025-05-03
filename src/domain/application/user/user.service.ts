import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from '../../interface/booking';
import { RaiseQuery } from '../../interface/query';
import { Router } from '@angular/router';
import { UserDataService } from '../../infrastructure/user/user-data.service';
import { NotificationService } from '../notification/notification.service';
import { LoaderService } from '../loader/loader.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Adjust your API endpoint
private userProfileSubject = new BehaviorSubject<any>([]);
userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient,
    private router: Router,
    private readonly userDataService: UserDataService,
    private readonly notificationService: NotificationService,
    private readonly loaderService: LoaderService
  ) {}

  getUserProfile() {
    const headers = this.validateToken();
    this.loaderService.show();
    this.userDataService.getUserProfile(headers).subscribe({
          next: (user: any) => {
            this.userProfileSubject.next(user);
            this.notificationService.showSuccess('Welcome to your dashboard!');
            this.loaderService.show();
          },
          error: (error: any) => {
            this.notificationService.showError('Failed to load user profile.');
            this.router.navigate(['/login']);
          }
        });
  }

  getServiceProviders(serviceType: string): Observable<any[]> {
    // const headers = this.validateToken();
    //const params = new HttpParams().set('serviceType', serviceType); // Pass the service type as a query parameter
    return this.http.get<any[]>(`${this.apiUrl}/ServiceProfessional/${serviceType}/providers`);
  }

  // getUserBookingHistory(clientId: number, userType: string): Observable<any[]> {
  //   // const headers = this.validateToken();
  //   //const params = new HttpParams().set('serviceType', serviceType); // Pass the service type as a query parameter
  //   return this.http.get<Booking[]>(`${this.apiUrl}/User/${clientId}/${userType}/history`);
  // }

  createBooking(clientId: number, bookingData: Booking): Observable<any> {
    // const headers = this.validateToken();
    return this.http.post(`${this.apiUrl}/bookings/${clientId}`, bookingData);
  }

  submitQuery(queryData: RaiseQuery): Observable<any> {
    // const headers = this.validateToken();
    return this.http.post(`${this.apiUrl}/queries`, queryData);
  }
  
  validateToken() {
    const token = localStorage.getItem('authToken'); // You might need a token for this as well
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}