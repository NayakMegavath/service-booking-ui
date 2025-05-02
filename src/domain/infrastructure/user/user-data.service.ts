import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../interface/user-profile';
import { Booking } from '../../interface/booking';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private apiUrl = environment.apiUrl; // Base API URL from environment

  constructor(private http: HttpClient) { }

  registerUser(endpoint: string, data: FormData): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<any>(url, data);
  }

  get(endpoint: string, params?: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.get(url, { params });
  }

  getUserBookingHistory(clientId: any, userType: string) {
    const headers = this.validateToken();
    return this.http.get<Booking[]>(`${this.apiUrl}/User/${clientId}/${userType}/history`, {headers});
  }

  getUserProfile(headers: any) {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, { headers });
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