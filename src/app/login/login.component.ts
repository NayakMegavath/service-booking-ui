import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute  } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service'; // Assuming you have an AuthService
import { MatSnackBar } from '@angular/material/snack-bar'; // For showing success/error messages
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  isLoading: boolean = false; // To show a loading indicator
  private loginSubscription!: Subscription;
  userTypeFromUrl: string | null = null;
  private routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    var routeSubscription = this.route.queryParams.subscribe(params => {
      this.userTypeFromUrl = params['userType'];
    });
  }

  login(formData: any): void {
    this.isLoading = true;
    this.errorMessage = ''; // Clear any previous error message

    this.loginSubscription = this.authService.login(formData, this.userTypeFromUrl).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('authToken', response.token);
        this.notificationService.showSuccess('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notificationService.showError('Login failed.');
        this.errorMessage = 'Invalid username or password.';
        if (error && error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
      }
    });
  }

  goToLandingPage(): void {
    this.router.navigate(['/']); // Assuming '/' is your landing page route
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }
}