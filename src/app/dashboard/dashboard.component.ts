import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface ServiceType {
  value: string;
  label: string;
}

interface ServiceProvider {
  id: number;
  name: string;
  experience: number;
  rating: number;
  distance: number;
  // Add other relevant properties
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  userAvatarUrl: string | null = null;
  userProfileSubscription!: Subscription;
  isProfileDropdownVisible: boolean = false;
  bookingMessage: string = 'Find the best service providers for your needs.';
  showSearch: boolean = false;
  serviceTypes: ServiceType[] = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'cleaning', label: 'Cleaning' },
    // Add more service types
  ];
  selectedServiceType: string = '';
  serviceProviders: ServiceProvider[] = [];
  sortedProviders: ServiceProvider[] = [];
  selectedProviderIndex: number | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  wizardStep: number = 1;
  selectedProvider: ServiceProvider | null = null;
  timeSlots: string[] = this.generateTimeSlots();
  selectedSlot: string = '';

  constructor(
    private router: Router,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  loadUserProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.userAvatarUrl = user.avatarUrl || null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.notificationService.showError('Failed to load user information.');
        this.router.navigate(['/login']);
      }
    } else {
      this.fetchUserProfile();
    }
  }

  fetchUserProfile(): void {
    this.userProfileSubscription = this.userService.getUserProfile().subscribe({
      next: (user: any) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userAvatarUrl = user.avatarUrl || null;
        this.notificationService.showSuccess('Welcome to your dashboard!');
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load user profile.');
        this.router.navigate(['/login']);
      }
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.isProfileDropdownVisible = false;
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.isProfileDropdownVisible = false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  showSearchForm(): void {
    this.showSearch = true;
    this.wizardStep = 1;
    this.serviceProviders = [];
    this.selectedProviderIndex = null;
    this.selectedProvider = null;
    this.selectedSlot = '';
  }

  fetchServiceProviders(): void {
    if (this.selectedServiceType) {
      this.userService.getServiceProviders(this.selectedServiceType).subscribe({
        next: (providers: ServiceProvider[]) => {
          this.serviceProviders = providers;
          this.sortProviders(this.sortColumn);
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load service providers.');
          console.error('Error fetching service providers:', error);
          this.serviceProviders = [];
        }
      });
    } else {
      this.serviceProviders = [];
      this.sortedProviders = [];
      this.selectedProviderIndex = null;
    }
  }

  sortProviders(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedProviders = [...this.serviceProviders].sort((a, b) => {
      const aValue = a[this.sortColumn as keyof ServiceProvider];
      const bValue = b[this.sortColumn as keyof ServiceProvider];

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  selectProvider(index: number): void {
    this.selectedProviderIndex = index;
  }

  nextStep(): void {
    if (this.wizardStep === 1 && this.selectedProviderIndex !== null) {
      this.selectedProvider = this.sortedProviders[this.selectedProviderIndex];
      this.wizardStep = 2;
    } else if (this.wizardStep === 2 && this.selectedSlot) {
      this.wizardStep = 3;
    }
  }

  prevStep(): void {
    if (this.wizardStep > 1) {
      this.wizardStep--;
    }
  }

  resetWizard(): void {
    this.wizardStep = 1;
    this.showSearch = false;
    this.serviceProviders = [];
    this.sortedProviders = [];
    this.selectedProviderIndex = null;
    this.selectedProvider = null;
    this.selectedServiceType = '';
    this.selectedSlot = '';
  }

  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let i = 0; i < 24; i++) {
      const startHour = i % 12 === 0 ? 12 : i % 12;
      const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
      const ampmStart = i < 12 ? 'AM' : 'PM';
      const ampmEnd = (i + 1) < 12 || (i + 1) === 24 ? 'AM' : 'PM';
      slots.push(`${this.formatHour(startHour)}:00 ${ampmStart} - ${this.formatHour(endHour)}:00 ${ampmEnd}`);
    }
    return slots;
  }

  formatHour(hour: number): string {
    return hour < 10 ? '0' + hour : '' + hour;
  }

  completeBooking(): void {
    if (this.selectedProvider && this.selectedSlot) {
      // Implement your booking completion logic here
      this.notificationService.showSuccess('Booking completed successfully!');
      this.resetWizard(); // Go back to the initial state
    } else {
      this.notificationService.showWarning('Please select a provider and time slot.');
    }
  }
}