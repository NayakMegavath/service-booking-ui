import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingsComponent } from '../bookings/bookings.component';
import { UserService } from '../../../domain/application/user/user.service';
import { NotificationService } from '../../../domain/application/notification/notification.service';
import { Subscription } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ServiceProvider } from '../../../domain/interface/service-provider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BookingsService } from '../../../domain/application/booking/bookings.service.service';
import { Booking } from '../../../domain/interface/booking';
import { LoaderService } from '../../../domain/application/loader/loader.service';
import { UserContextService } from '../../shared/services/user-context.service';


@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, BookingsComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  selectedService = '';
  selectedProviderId: number | null = null;
  selectedProviderDetails: ServiceProvider | null = null;
  firstName: string = '';
  lastName: string = '';
  clientId!: number;
  isBookingWizardOpen = false;
  currentWizardStep = 0;
  wizardTitle = '';
  wizardInfo = '';
  wizardProgress = 0;
  selectedTimeSlot: string | null = null;
  services = ['Electrician', 'Plumbing', 'Carpenter', 'Mechanic', 'Painter', 'House Cleaning', 'Vehicle Wash'];
  providers: string[] = [];
  serviceProviders: ServiceProvider[] = [];
  userName: string= '';
  userProfileSubscription!: Subscription;
  private fetchProvidersSubscription!: Subscription;
  selectedDate: Date | null = null;
  dateFilter!: (date: Date | null) => boolean;
  futureDateFilter!: (date: Date | null) => boolean;
  isPastDateSelected = false;
  isManualDateInvalid = false;
  bookingsSubscription!: Subscription;
  bookingHistorySubscription!: Subscription;
  bookingHistory: Booking[] = [];
  isPastEditedDate = false;
  editedDate: Date | null = null;
  isSidebarCollapsed = false;
  userType!: string;

  constructor(
    private router: Router,
    private readonly userService: UserService,
    private notificationService: NotificationService,
    private bookingService: BookingsService,
    private readonly cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private readonly userContextService: UserContextService
  ) {
    this.dateFilter = (date: Date | null): boolean => {
      if (!date) {
        return true;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    };
    this.futureDateFilter = (date: Date | null): boolean => {
      if (!date) {
        return true;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today; // Only allow future dates
    };
  }

  ngOnInit(): void {
    this.loadUserContextSubscription();
  }

  loadUserContextSubscription() {
    this.userContextService.getUserContext$().subscribe(context => {
      if (context) {
        this.userType = context.userType;
        this.clientId = context.clientId;
        this.userName = context?.userName;
      }
      if (this.userType && this.clientId) {
        this.bookingService.getUserBookingHistory(this.clientId, this.userType);
      }
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
    this.fetchProvidersSubscription?.unsubscribe();
    this.bookingsSubscription?.unsubscribe();
    this.bookingHistorySubscription?.unsubscribe();
  }

  getServiceIcon(service: string): string {
    return `/assets/icons/${service.toLowerCase().replace(/ /g, '-')}.png`;
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
  }

  nextWizardStep() {
    if (this.currentWizardStep === 1 && this.selectedProviderId) {
      this.currentWizardStep = 2;
      this.wizardTitle = 'Schedule Booking';
      this.wizardInfo = 'Please review the selected service provider and choose a preferred date for the appointment.';
      this.wizardProgress = 33;
      this.selectedProviderDetails = this.serviceProviders.find(p => p.id === this.selectedProviderId) || null;
    } else if (this.currentWizardStep === 2) {
      this.currentWizardStep = 3;
      this.wizardTitle = 'Review Booking';
      this.wizardInfo = 'Review your booking details before completion.';
      this.wizardProgress = 66;
    } else if (this.currentWizardStep === 3) {
      this.wizardTitle = 'Completed';
      this.wizardInfo = 'Your booking has been successfully submitted.';
      this.wizardProgress = 100;
      this.saveBookingDetails();
    }
  }

  saveBookingDetails() {
    this.loaderService.show();
    const bookingDetails = {
      appointmentDate: this.selectedDate,
      serviceType: this.selectedService,
      status: 'Pending',
      clientId: this.clientId,
      serviceProfessionalId: this.selectedProviderId
    };

    this.bookingsSubscription = this.bookingService.saveBookingDetails(bookingDetails).subscribe({
      next: (result) => {
        if (result) {
          this.currentWizardStep = 4;
          this.notificationService.showSuccess('Booking details saved successfully.');
          // this.loadBookingHistory();
          this.cdr.detectChanges();
          this.loaderService.hide();
        }
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to save booking details. Please try again later.');
        this.loaderService.hide();
      }
    });
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

  selectProviderCard(providerId: number) {
    this.selectedProviderId = providerId;
  }

  fetchServiceProviders(service: string) {
    this.loaderService.show();
    this.fetchProvidersSubscription = this.userService.getServiceProviders(service).subscribe({
      next: (providers: ServiceProvider[]) => {
        this.serviceProviders = providers;
        this.cdr.detectChanges();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load service providers.');
        this.closeBookingWizard();
        this.loaderService.hide();
      }
    });
  }

  formatDateForDisplay(date: Date | null): string {
    if (!date) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      this.selectedTimeSlot = null;
    } else if (inputDate < today) {
      this.isPastDateSelected = true;
      this.isManualDateInvalid = false;
      this.selectedDate = inputDate;
      this.selectedTimeSlot = null;
    } else {
      this.isPastDateSelected = false;
      this.isManualDateInvalid = false;
      this.selectedDate = inputDate;
    }
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.isPastDateSelected = !!this.selectedDate && this.selectedDate < today;
    this.isManualDateInvalid = false;
      this.isPastEditedDate = !!this.editedDate && this.editedDate <= today;
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

}