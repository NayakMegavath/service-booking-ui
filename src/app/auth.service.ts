import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthDataService } from './auth-data.service'; // Import AuthDataService

interface AuthResponse {
  token: string;
  // Include any other data your API returns on successful login
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();
  public isLoggedIn$ = this.token$.pipe(tap((token) => console.log('Is logged in:', !!token)));

  constructor(private authDataService: AuthDataService) {} // Inject AuthDataService

  login(credentials: any, userTypeFromUrl: string | null): Observable<AuthResponse> {
    return this.authDataService.login(credentials, userTypeFromUrl).pipe(
      tap((response: any) => this.setToken(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.tokenSubject.next(null);
    // Optionally call a server-side logout endpoint using AuthDataService
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.tokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}