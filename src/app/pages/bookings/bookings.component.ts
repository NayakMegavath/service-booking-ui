import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../../../domain/application/booking/bookings.service.service';
import { Booking } from '../../../domain/interface/booking';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderService } from '../../../domain/application/loader/loader.service';
import { UserContextService } from '../../shared/services/user-context.service';
import { Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '../../../domain/application/notification/notification.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule, 
    MatInputModule, 
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit, OnDestroy {
  isLoading = false;
  bookings: Booking[] = [];
  clientId!: number;
  userType!: string;
  private contextSub!: Subscription;
  bookingHistory: Booking[] = [];
  upcomingBookings!: Booking[];
  pastBookings!: Booking[];
  bookingHistorySubscription!: Subscription;
  selectedBookingForDetails: Booking | null = null;
  isBookingDetailsPopupVisible = false;
  isEditMode = false;
  isRescheduleMode = false;
  editedDate: Date | null = null;
  editedAddressLine1: string = '';
  editedAddressLine2: string = '';
  editedCity: string = '';
  editedState: string = '';
  editedZip: string = '';
  isPastEditedDate = false;
  selectedDate: Date | null = null;
  dateFilter!: (date: Date | null) => boolean;
  futureDateFilter!: (date: Date | null) => boolean;
  isPastDateSelected = false;
  isManualDateInvalid = false;
  bookingsSubscription!: Subscription;
  inProgressBookings: Booking[] = [];
  previousBookings: Booking[] = [];

  dataSource!: MatTableDataSource<Booking>;
  gridDisplayedColumns: string[] = ['serviceType', 'providerName', 'bookingDate', 'address', 'status', 'options'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() isFromDashboard!: boolean;

  constructor(private bookingsService: BookingsService,
    private readonly cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private readonly userContextService: UserContextService,
    private bookingService: BookingsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadUserContextSubscription();
    this.loadBookingHistorySubscription();
  }

  loadUserContextSubscription() {
    this.userContextService.getUserContext$().subscribe(context => {
      if (context) {
        this.userType = context.userType;
        this.clientId = context.clientId;
      }
      this.bookingsService.getUserBookingHistory(this.clientId, this.userType);
    });
  }

  loadBookingHistorySubscription() {
    this.bookingHistorySubscription = this.bookingsService.bookingHistory$.subscribe((res: Booking[]) => {
      if (res) {
        this.bookingHistory = res;
        this.filterBookings();
        this.dataSource = new MatTableDataSource(this.pastBookings);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  filterBookings(): void {
    this.upcomingBookings = this.bookingHistory.filter((booking: Booking) => booking.status === 'Pending' || booking.status === 'Confirmed');
    this.pastBookings = this.bookingHistory.filter((booking: Booking) => booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'Rejected');
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.contextSub?.unsubscribe();
    this.bookingHistorySubscription?.unsubscribe();
  }

  viewDetails(booking: Booking) {
    this.selectedBookingForDetails = booking;
    this.isBookingDetailsPopupVisible = true;
    this.isEditMode = false;
    this.isRescheduleMode = false;
    this.editedDate = booking.appointmentDate ? new Date(booking.appointmentDate) : null;
    this.editedAddressLine1 = booking.addressLine1 || '';
    this.editedAddressLine2 = booking.addressLine2 || '';
    this.editedCity = booking.city || '';
    this.editedState = booking.state || '';
    this.editedZip = booking.zip || '';
  }

  viewBooking(booking: Booking) {
    alert(`View details for Past Booking ID: ${booking.id}`);
    // Implement your view logic here
  }

  editBooking(booking: Booking) {
    alert(`Edit booking with ID: ${booking.id}`);
    // Implement your edit logic here
  }

  removeBooking(booking: Booking) {
    alert(`Remove booking with ID: ${booking.id}`);
    // Implement your remove logic here
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  saveEditedBooking() {
    if (this.selectedBookingForDetails && this.editedDate) {
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
        next: (response: any) => {
          this.notificationService.showSuccess('Booking details updated successfully.');
          this.loadBookingHistory();
          this.closeBookingDetailsPopup();
          this.loaderService.hide();
          this.isEditMode = false;
          this.isRescheduleMode = false;
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to update booking details.');
          this.loaderService.hide();
        }
      });
    } else {
      this.notificationService.showError('Please ensure the date is selected.');
    }
  }

  loadBookingHistory(): void {
    this.loaderService.show();
    this.bookingHistorySubscription = this.bookingService.bookingHistory$.subscribe((res: Booking[]) => {
      if (res) {
        this.bookingHistory = res;
        this.filterBookings();
      }
    });
  }

  closeBookingDetailsPopup() {
    this.isBookingDetailsPopupVisible = false;
    this.isEditMode = false;
    this.isRescheduleMode = false;
    this.selectedBookingForDetails = null;
    this.isPastEditedDate = false;
  }

  enableEditMode() {
    this.isEditMode = true;
    this.isRescheduleMode = false;
    this.cdr.detectChanges();
  }

  enableRescheduleMode() {
    this.isRescheduleMode = true;
    this.isEditMode = true;
    this.editedDate = this.selectedBookingForDetails?.appointmentDate ? new Date(this.selectedBookingForDetails.appointmentDate) : null;
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

  onDateChange(event: any) {
    this.selectedDate = event.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.isPastDateSelected = !!this.selectedDate && this.selectedDate < today;
    this.isManualDateInvalid = false;
    this.isPastEditedDate = !!this.editedDate && this.editedDate <= today;
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

}