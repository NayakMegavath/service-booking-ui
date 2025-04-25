// // src/app/bookings/bookings.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsService } from '../../bookings.service.service';
import { Booking } from '../../../domain/interface/booking';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent {
  isLoading = false;
  bookings: Booking[] = [];
  displayedColumns: string[] = ['serviceType', 'providerName', 'bookingDate', 'timeSlot', 'status'];
  upcomingBookings = [
    {
      id: 1,
      service: 'Electrician',
      provider: 'Ravi Kumar',
      date: '2025-04-20',
      time: '10:00 AM',
      status: 'Upcoming',
    },
    {
      id: 2,
      service: 'House Cleaning',
      provider: 'Meena Verma',
      date: '2025-04-22',
      time: '2:00 PM',
      status: 'Upcoming',
    },
  ];

  pastBookings = [
    {
      id: 3,
      service: 'Plumber',
      provider: 'Amit Singh',
      date: '2025-04-10',
      time: '11:00 AM',
      status: 'Completed',
      rated: true,
    },
  ];
  constructor(private bookingsService: BookingsService) {}

  ngOnInit(): void {
        //this.loadBookingHistory();
      }
    
    // loadBookingHistory(): void {
    //   this.bookingsService.getUserBookingHistory(this.clientId, 'client').subscribe({
    //     next: (history: Booking[]) => {
    //       this.bookingHistory = history;
    //       this.filterBookings();
    //     },
    //     error: (error: any) => {
    //       this.notificationService.showError('Failed to load booking history.');
    //     }
    //   });
    // }

  viewDetails(booking: any) {
    alert(`Details for Booking ID: ${booking.id}`);
  }
}
