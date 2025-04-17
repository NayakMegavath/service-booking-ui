import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-dashboard.component.html', 
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent {
  username = 'John Doe';
  selectedService = '';
  selectedProvider = '';
  services = ['Electrician', 'Plumbing', 'Mechanic', 'Painter', 'House Cleaning', 'Vehicle Wash'];
  providers: string[] = [];
  upcomingBookings = [
    { service: 'Electrician', date: '2025-04-20' },
    { service: 'Painter', date: '2025-04-22' }
  ];

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

  generateMockProviders(): string[] {
    return [
      'The Bright Spark (Electrician)',
      'Reliable Plumbing Services',
      'QuickFix Auto Mechanics',
      'Color Splash Painters',
      'Clean Sweep Home Services',
      'Sparkling Wheels Vehicle Wash'
    ];
  }
}
