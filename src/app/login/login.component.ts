import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute  } from '@angular/router';
import { FormGroup, FormsModule, FormBuilder, FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../domain/application/auth/auth.service'; // Assuming you have an AuthService
import { MatSnackBar } from '@angular/material/snack-bar'; // For showing success/error messages
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../domain/application/notification/notification.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, MatProgressSpinnerModule, HeaderComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  isLoading: boolean = false; // To show a loading indicator
  private loginSubscription!: Subscription;
  userTypeFromUrl: string | null = null;
  private routeSubscription!: Subscription;
  loginForm!: FormGroup;
  passwordVisible = false;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

    var routeSubscription = this.route.queryParams.subscribe(params => {
      this.userTypeFromUrl = params['userType'];
    });
  }

  login(formData: any): void {
    this.isLoading = true;
    this.errorMessage = ''; // Clear any previous error message
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}