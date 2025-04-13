import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
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

  // Add other HTTP methods (put, delete, etc.) as needed
}