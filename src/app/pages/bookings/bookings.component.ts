import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    MatMenuModule
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

  dataSource!: MatTableDataSource<Booking>;
  gridDisplayedColumns: string[] = ['serviceType', 'providerName', 'bookingDate', 'address', 'status', 'options'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bookingsService: BookingsService,
    private readonly cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private readonly userContextService: UserContextService
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

  viewDetails(booking: any) {
    alert(`Details for Upcoming Booking ID: ${booking.id}`);
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
}