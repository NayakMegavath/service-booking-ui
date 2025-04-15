import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Adjust your API endpoint

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    const headers = this.validateToken();
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, { headers });
  }

  getServiceProviders(serviceType: string): Observable<any[]> {
    const headers = this.validateToken();
    //const params = new HttpParams().set('serviceType', serviceType); // Pass the service type as a query parameter
    return this.http.get<any[]>(`${this.apiUrl}/ServiceProfessional/${serviceType}/providers`);
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