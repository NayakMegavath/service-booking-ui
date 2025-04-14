import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatSnackBarModule], // Add necessary modules like CommonModule
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  userProfileSubscription!: Subscription;

  constructor(private router: Router,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Retrieve user information from local storage (if you stored it during login)
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || ''; // Adjust based on your user object structure
        this.lastName = user.lastName || '';   // Adjust based on your user object structure
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle the error appropriately, maybe redirect to login
      }
    } else {
      // If no user data, try to fetch it from an API using the stored token
      this.fetchUserProfile();
    }
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  fetchUserProfile(): void {
    this.userProfileSubscription = this.userService.getUserProfile().subscribe({
      next: (user: any) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.notificationService.showSuccess('Welcome to your dashboard!');
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load user profile.');
        this.router.navigate(['/login']);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Clear user data as well
    this.router.navigate(['/']); // Redirect to the landing page
  }
}