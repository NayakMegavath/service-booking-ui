import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { NotificationService } from '../../notification.service';
import { Subscription } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ServiceProvider } from '../../../domain/interface/service-provider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './client-dashboard.component.html', 
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  selectedService = '';
  selectedProviderId: number | null = null;
  selectedProviderDetails: ServiceProvider | null = null;
  firstName: string = '';
  lastName: string = '';
  clientId!: string;
  isBookingWizardOpen = false;
  currentWizardStep = 0;
  wizardTitle = '';
  wizardInfo = '';
  wizardProgress = 0;
  selectedTimeSlot: string | null = null;
  services = ['Electrician', 'Plumbing', 'Carpenter', 'Mechanic', 'Painter', 'House Cleaning', 'Vehicle Wash'];
  providers: string[] = [];
  serviceProviders: ServiceProvider[] = [];
  timeSlots: string[] = [];
  upcomingBookings = [
    { service: 'Electrician', date: '2025-04-20' },
    { service: 'Painter', date: '2025-04-22' }
  ];
  userName: string= '';
  userProfileSubscription!: Subscription;
  private fetchProvidersSubscription!: Subscription;
  selectedDate: Date | null = null;
  dateFilter!: (date: Date | null) => boolean;
  isPastDateSelected = false;
  isManualDateInvalid = false;

  @Input() userType: string | null = null;
    constructor(
    private router: Router,
    private readonly userService: UserService,
    private notificationService: NotificationService,
  ) {
    this.dateFilter = (date: Date | null): boolean => {
      if (!date) {
        return true;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    };
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
    this.fetchProvidersSubscription?.unsubscribe();
  }

  getServiceIcon(service: string): string {
    return `/assets/icons/${service.toLowerCase().replace(/ /g, '-')}.png`;
  }

  viewDetails(booking: any) {
    alert(`Viewing details for: ${booking.service} on ${booking.date}`);
  }

  bookService(service: string) {
    alert(`Booking service: ${service}`);
    // Implement your booking logic here (e.g., navigate to a booking form)
  }

    loadUserProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.clientId = user?.clientId;
        this.userName = this.firstName +' '+this.lastName;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.notificationService.showError('Failed to load user information.');
        this.router.navigate(['/login'], { queryParams: { userType: this.userType } });
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
        this.clientId = user?.clientId;
        this.userName = this.firstName +' '+this.lastName;
        this.notificationService.showSuccess('Welcome to your dashboard!');
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load user profile.');
        this.router.navigate(['/login'], { queryParams: { userType: this.userType } });
      }
    });
  }

  openBookingWizard(service: string) {
    this.selectedService = service;
    this.isBookingWizardOpen = true;
    this.currentWizardStep = 1;
    this.wizardTitle = 'Search Service Providers';
    this.wizardInfo = 'View available service providers for the selected service.';
    this.wizardProgress = 0;
    this.selectedProviderId = null;
    this.selectedProviderDetails = null;
    this.selectedTimeSlot = null;
    this.selectedDate = null;
    this.isPastDateSelected = false;
    this.isManualDateInvalid = false;
    this.fetchServiceProviders(service);
  }

  closeBookingWizard() {
    this.isBookingWizardOpen = false;
    this.currentWizardStep = 0;
    this.wizardTitle = '';
    this.wizardInfo = '';
    this.wizardProgress = 0;
    this.selectedProviderId = null;
    this.selectedProviderDetails = null;
    this.selectedTimeSlot = null;
    this.selectedDate = null;
    this.isPastDateSelected = false;
    this.isManualDateInvalid = false;
    this.serviceProviders = [];
    this.timeSlots = [];
  }

  nextWizardStep() {
    if (this.currentWizardStep === 1 && this.selectedProviderId) {
      this.currentWizardStep = 2;
      this.wizardTitle = 'Review Booking';
      this.wizardInfo = 'Review the selected provider and choose a time slot.';
      this.wizardProgress = 33;
      this.selectedProviderDetails = this.serviceProviders.find(p => p.id === this.selectedProviderId) || null;
      if (this.selectedDate) {
        this.loadTimeSlots(); // Load time slots if a date is already selected
      }
    } else if (this.currentWizardStep === 2) {
      this.currentWizardStep = 3;
      this.wizardTitle = 'Booking Details';
      this.wizardInfo = 'Review your booking details before completion.';
      this.wizardProgress = 66;
    } else if (this.currentWizardStep === 3) {
      this.currentWizardStep = 4;
      this.wizardTitle = 'Completed';
      this.wizardInfo = 'Your booking has been successfully submitted.';
      this.wizardProgress = 100;
      // this.closeBookingWizard(); // For now, close the wizard
    }
  }

  prevWizardStep() {
    if (this.currentWizardStep > 1) {
      this.currentWizardStep--;
      if (this.currentWizardStep === 1) {
        this.wizardTitle = 'Search Service Providers';
        this.wizardInfo = 'View available service providers for the selected service.';
        this.wizardProgress = 33;
        this.selectedTimeSlot = null;
        this.selectedDate = null;
        this.isPastDateSelected = false;
        this.isManualDateInvalid = false;
      } else if (this.currentWizardStep === 2) {
        this.wizardTitle = 'Review Booking';
        this.wizardInfo = 'Review the selected provider and choose a time slot.';
        this.wizardProgress = 66;
      }
    }
  }

  selectProvider(providerId: number, event: any) {
    if (event.target.checked) {
      this.selectedProviderId = providerId;
      // Disable other checkboxes
      this.serviceProviders.forEach(provider => {
        if (provider.id !== providerId) {
          // You might need to access the actual DOM element to disable
          // or manage this state in your component's data
        }
      });
    } else {
      this.selectedProviderId = null;
      // Enable all checkboxes
      // Again, DOM manipulation or component state management is needed
    }
  }

    selectProviderCard(providerId: number) {
    this.selectedProviderId = providerId;
  }

  loadTimeSlots() {
    // Replace this with your actual logic to fetch available time slots
    for (let i = 0; i < 24; i++) {
      const startHour = i % 12 === 0 ? 12 : i % 12;
      const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
      const ampmStart = i < 12 ? 'AM' : 'PM';
      const ampmEnd = (i + 1) < 12 || (i + 1) === 24 ? 'AM' : 'PM';
      this.timeSlots?.push(`${this.formatHour(startHour)}:00 ${ampmStart} - ${this.formatHour(endHour)}:00 ${ampmEnd}`);
    }
    return this.timeSlots;
  }

    formatHour(hour: number): string {
    return hour < 10 ? '0' + hour : '' + hour;
  }

  fetchServiceProviders(service: string) {
    // Replace this with your actual API call to fetch service providers
    this.fetchProvidersSubscription = this.userService.getServiceProviders(service).subscribe({
      next: (providers: ServiceProvider[]) => {
        this.serviceProviders = providers;//.map(p => ({ ...p, distance: Math.random() * 10 }));; // Mock distance
        // Sort options can be implemented here or in the UI with sorting functions
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load service providers.');
        this.closeBookingWizard();
      }
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.isPastDateSelected = !!this.selectedDate && this.selectedDate < today;
    this.isManualDateInvalid = false;
    if (this.selectedDate && !this.isPastDateSelected) {
      this.loadTimeSlots();
    } else {
      this.timeSlots = [];
      this.selectedTimeSlot = null;
    }
  }

  formatDateForDisplay(date: Date | null): string {
    if (!date) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // Fri
      month: 'short',   // Apr
      day: 'numeric',   // 18
      year: 'numeric'  // 2025
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  validateManualDateInput(event: any) {
    const inputDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(inputDate.getTime())) {
      this.isManualDateInvalid = true;
      this.selectedDate = null;
      this.timeSlots = [];
      this.selectedTimeSlot = null;
    } else if (inputDate < today) {
      this.isPastDateSelected = true;
      this.isManualDateInvalid = false;
      this.selectedDate = inputDate;
      this.timeSlots = [];
      this.selectedTimeSlot = null;
    } else {
      this.isPastDateSelected = false;
      this.isManualDateInvalid = false;
      this.selectedDate = inputDate;
      this.loadTimeSlots();
    }
  }
}
