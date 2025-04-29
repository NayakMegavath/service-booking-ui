import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  upcomingBookings!: Booking[];
  userName: string= '';
  userProfileSubscription!: Subscription;
  private fetchProvidersSubscription!: Subscription;
  selectedDate: Date | null = null;
  dateFilter!: (date: Date | null) => boolean;
  isPastDateSelected = false;
  isManualDateInvalid = false;
  bookingsSubscription!: Subscription;
  bookingHistorySubscription!: Subscription;
  bookingHistory: Booking[] = [];
  inProgressBookings: Booking[] = [];
  previousBookings: Booking[] = [];

  selectedBookingForDetails: Booking | null = null;
  isBookingDetailsPopupVisible = false;
  isEditMode = false;
  editedDate: Date | null = null;
  editedCommunicationAddress: string = '';
  editedAddressLine1: string = '';
  editedAddressLine2: string = '';
  editedCity: string = '';
  editedState: string = '';
  editedZip: string = '';

  @Input() userType: string | null = null;
    constructor(
    private router: Router,
    private readonly userService: UserService,
    private notificationService: NotificationService,
    private bookingService: BookingsService,
    private readonly cdr: ChangeDetectorRef,
    private loaderService: LoaderService
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
    this.bookingsSubscription?.unsubscribe();
    this.bookingHistorySubscription?.unsubscribe();
  }

  getServiceIcon(service: string): string {
    return `/assets/icons/${service.toLowerCase().replace(/ /g, '-')}.png`;
  }

  viewDetails(booking: Booking) {
    this.selectedBookingForDetails = booking;
        this.isBookingDetailsPopupVisible = true;
        this.isEditMode = false;
        this.editedDate = booking.appointmentDate ? new Date(booking.appointmentDate) : null;

        this.editedAddressLine1 = booking.addressLine1 || '';
        this.editedAddressLine2 = booking.addressLine2 || '';
        this.editedCity = booking.city || '';
        this.editedState = booking.state || '';
        this.editedZip = booking.zip || '';
}

getDisplayAddress(booking: Booking | null): string {
  if (!booking) {
      return '';
  }
  let addressParts = [booking.addressLine1];
  if (booking.addressLine2) {
      addressParts.push(booking.addressLine2);
  }
  addressParts.push(`${booking.city}, ${booking.state} - ${booking.zip}`);
  return addressParts.join(', ');
}

  loadUserProfile(): void {
    this.loaderService.show();
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.clientId = user?.id;
        this.userName = this.firstName +' '+this.lastName;
        if(this.clientId > 0){
          this.loadBookingHistory();
        }
        this.loaderService.hide();
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.notificationService.showError('Failed to load user information.');
        this.loaderService.hide();
        this.router.navigate(['/login'], { queryParams: { userType: this.userType } });
      }
    } else {
      this.fetchUserProfile();
    }
  }

  fetchUserProfile(): void {
    this.loaderService.show();
    this.userProfileSubscription = this.userService.getUserProfile().subscribe({
      next: (user: any) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.clientId = user?.id;
        this.userName = this.firstName +' '+this.lastName;
        this.notificationService.showSuccess('Welcome to your dashboard!');
        if(this.clientId > 0){
          this.loadBookingHistory();
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load user profile.');
        this.loaderService.hide();
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
      // this.closeBookingWizard(); // For now, close the wizard
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
          this.loadBookingHistory();
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

    loadBookingHistory(): void {
      this.loaderService.show();
      this.bookingHistorySubscription = this.userService.getUserBookingHistory(this.clientId, 'client').subscribe({
        next: (history: Booking[]) => {
          this.bookingHistory = history;
          this.filterBookings();
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to load booking history.');
          this.loaderService.hide();
        }
      });
    }

    
  filterBookings(): void {
    this.inProgressBookings = this.bookingHistory.filter((booking : Booking) => booking.status === 'Pending' || booking.status === 'Confirmed'); // Adjust status values as needed
    this.previousBookings = this.bookingHistory.filter((booking : Booking) => booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'Rejected'); // Adjust status values as needed
    this.cdr.detectChanges();
    this.loaderService.hide();
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

  fetchServiceProviders(service: string) {
    // Replace this with your actual API call to fetch service providers
    this.loaderService.show();
    this.fetchProvidersSubscription = this.userService.getServiceProviders(service).subscribe({
      next: (providers: ServiceProvider[]) => {
        this.serviceProviders = providers;//.map(p => ({ ...p, distance: Math.random() * 10 }));; // Mock distance
        // Sort options can be implemented here or in the UI with sorting functions
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

  onDateChange(event: any) {
    this.selectedDate = event.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.isPastDateSelected = !!this.selectedDate && this.selectedDate < today;
    this.isManualDateInvalid = false;
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

  closeBookingDetailsPopup() {
    this.isBookingDetailsPopupVisible = false;
    this.isEditMode = false;
    this.selectedBookingForDetails = null;
}

enableEditMode() {
    this.isEditMode = true;
    this.cdr.detectChanges();
}

cancelBooking(bookingId: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        this.loaderService.show();
        this.bookingService.cancelBooking(bookingId).subscribe({
            next: (response: any) => {
                this.notificationService.showSuccess('Booking cancelled successfully.');
                this.loadBookingHistory();
                this.closeBookingDetailsPopup();
                this.loaderService.hide();
            },
            error: (error: any) => {
                this.notificationService.showError('Failed to cancel booking.');
                this.loaderService.hide();
            }
        });
    }
}

saveEditedBooking() {
    if (this.selectedBookingForDetails && this.editedDate && this.editedCommunicationAddress) {
        this.loaderService.show();
        const updatedBooking = {
            id: this.selectedBookingForDetails.id,
            appointmentDate: this.editedDate,
            addressLine1: this.editedAddressLine1,
            addressLine2: this.editedAddressLine2,
            city: this.editedCity,
            state: this.editedState,
            zip: this.editedZip,
            // Add other fields if needed
        };
        this.bookingService.saveBookingDetails(updatedBooking).subscribe({
            next: (response : any) => {
                this.notificationService.showSuccess('Booking details updated successfully.');
                this.loadBookingHistory();
                this.closeBookingDetailsPopup();
                this.loaderService.hide();
                this.isEditMode = false;
            },
            error: (error: any) => {
                this.notificationService.showError('Failed to update booking details.');
                this.loaderService.hide();
            }
        });
    } else {
        this.notificationService.showError('Please ensure date and communication address are filled.');
    }
}
}
