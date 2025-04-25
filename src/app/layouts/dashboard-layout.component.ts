import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceProvider } from '../../domain/interface/service-provider';
import { ServiceType } from '../../domain/interface/service-type';
import { Booking } from '../../domain/interface/booking';
import { RaiseQuery } from '../../domain/interface/query';
import { SidebarComponent } from '../components/sidebar-component/sidebar.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard-layout', // Adjust the selector as needed
  standalone: true,
  imports: [RouterOutlet, RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html', // Corrected templateUrl
  styleUrls: ['./dashboard-layout.component.scss'] // If you have a CSS file
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  clientId!: number;
  userAvatarUrl: string | null = null;
  userProfileSubscription!: Subscription;
  isProfileDropdownVisible: boolean = false;
  bookingMessage: string = 'Find the best service providers for your needs.';
  showWizard: boolean = false;
  currentUserType!: string;
  serviceTypes: ServiceType[] = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'cleaning', label: 'Cleaning' },
  ];
  selectedServiceType: string = '';
  serviceProviders: ServiceProvider[] = [];
  sortedProviders: ServiceProvider[] = [];
  selectedProviderIndex: number | null = null;
  sortColumn: keyof ServiceProvider = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  wizardStep: number = 1;
  selectedProvider: ServiceProvider | null = null;
  timeSlots: string[] = this.generateTimeSlots();
  selectedSlot: string = '';
  loadingProviders: boolean = false;
  showConfirmation: boolean = false;
  confirmationMessage: string = '';
  bookingHistory: Booking[] = [];
  inProgressBookings: Booking[] = [];
  previousBookings: Booking[] = [];
  showQueryModal: boolean = false;
  query: RaiseQuery = { serviceType: '', providerName: '', description: '' };
  queryFormControls: FormGroup;
  userTypeSubscription!: Subscription;

  constructor(
    private router: Router,
    private readonly userService: UserService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.queryFormControls = this.fb.group({
      serviceType: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadBookingHistory();
    this.userTypeSubscription = this.authService.getCurrentUserType().subscribe((type: any) => {
      this.currentUserType = type;
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
    this.userTypeSubscription?.unsubscribe();
  }

  loadUserProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.userAvatarUrl = user.avatarUrl || null;
        this.clientId = user?.clientId;
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
        this.clientId = user?.clientId;
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

  fetchServiceProviders(): void {
    if (this.selectedServiceType) {
      this.loadingProviders = true;
      this.userService.getServiceProviders(this.selectedServiceType).subscribe({
        next: (providers: ServiceProvider[]) => {
          this.serviceProviders = providers;
          this.sortProviders(this.sortColumn);
          this.loadingProviders = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load service providers.');
          console.error('Error fetching service providers:', error);
          this.serviceProviders = [];
          this.loadingProviders = false;
        }
      });
    } else {
      this.serviceProviders = [];
      this.sortedProviders = [];
      this.selectedProviderIndex = null;
      this.loadingProviders = false;
    }
  }

  sortProviders(column: keyof ServiceProvider): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedProviders = [...this.serviceProviders].sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];

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
    this.showWizard = false;
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

  // completeBooking(): void {
  //   if (this.selectedProvider && this.selectedSlot) {
  //     // Implement your actual booking submission logic to the backend here
  //     let bookingData: Booking = {
  //       serviceType: this.selectedServiceType,
  //       serviceProfessonal: this.selectedProvider.firstName + ' '+ this.selectedProvider.lastName,
  //       appointmentDate: new Date().toLocaleDateString(), // Example date
  //       status: 'pending',
  //       clientId: this.clientId
  //     };

  //     this.userService.createBooking(this.clientId, bookingData).subscribe({
  //       next: (response: any) => {
  //         this.confirmationMessage = `Your booking with ${this.selectedProvider?.firstName + ' '+ this.selectedProvider?.firstName} on ${this.} has been requested!`;
  //         this.showConfirmation = true;
  //         this.showWizard = false;
  //         this.loadBookingHistory(); // Refresh booking history
  //       },
  //       error: (error: any) => {
  //         this.notificationService.showError('Failed to create booking.');
  //         console.error('Error creating booking:', error);
  //       }
  //     });
  //   } else {
  //     this.notificationService.showWarning('Please select a provider and time slot.');
  //   }
  // }

  closeConfirmation(): void {
    this.showConfirmation = false;
    this.resetWizard();
  }

  loadBookingHistory(): void {
    this.userService.getUserBookingHistory(this.clientId, 'client').subscribe({
      next: (history: Booking[]) => {
        this.bookingHistory = history;
        this.filterBookings();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load booking history.');
      }
    });
  }

  filterBookings(): void {
    this.inProgressBookings = this.bookingHistory.filter(booking => booking.status === 'pending' || booking.status === 'confirmed'); // Adjust status values as needed
    this.previousBookings = this.bookingHistory.filter(booking => booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'rejected'); // Adjust status values as needed
  }

  openQueryModal(): void {
    this.showQueryModal = true;
    this.queryFormControls.reset();
    this.query = { serviceType: '', providerName: '', description: '' };
  }

  closeQueryModal(): void {
    this.showQueryModal = false;
  }

  submitQuery(): void {
    if (this.queryFormControls.valid) {
       let queryData: RaiseQuery = {
        serviceType: this.selectedServiceType,
        providerName: '', // Example date
        description: ''
      };
      this.userService.submitQuery(queryData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Your query has been submitted successfully.');
          this.closeQueryModal();
          this.query = { serviceType: '', providerName: '', description: '' }; // Reset query form
          this.queryFormControls.reset();
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to submit your query.');
          console.error('Error submitting query:', error);
        }
      });
    } else {
      this.notificationService.showWarning('Please fill out all required fields in the query form.');
      this.queryFormControls.markAllAsTouched();
    }
  }
}