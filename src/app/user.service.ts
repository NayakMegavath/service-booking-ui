import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Handle case where there's no token (e.g., redirect to login)
      return new Observable(observer => observer.error('No token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Assuming Bearer token authentication
    });

    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, { headers });
  }
}