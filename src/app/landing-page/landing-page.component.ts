import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  currentYear: number = new Date().getFullYear();
  services = [
    // ... your service data
  ];
  showRegisterDropdown = false;
  showLoginDropdown = false;

  constructor(private router: Router) {}

  toggleRegisterDropdown(): void {
    this.showRegisterDropdown = !this.showRegisterDropdown;
    this.showLoginDropdown = false; // Close other dropdown if open
  }

  toggleLoginDropdown(): void {
    this.showLoginDropdown = !this.showLoginDropdown;
    this.showRegisterDropdown = false; // Close other dropdown if open
  }

  navigateToRegister(userType: 'client' | 'service-provider'): void {
    this.router.navigate(['/register'], { queryParams: { userType } });
    this.showRegisterDropdown = false; // Close dropdown after navigation
  }

  navigateToLogin(userType: 'client' | 'service-provider'): void {
    this.router.navigate(['/login'], { queryParams: { userType } });
    this.showLoginDropdown = false; // Close dropdown after navigation
  }

  requestDemoClick(serviceId: number): void {
    console.log(`Request demo clicked for service ID: ${serviceId}`);
    // Implement your request demo logic here
  }

  bookServiceClick(serviceId: number): void {
    console.log(`Book service clicked for service ID: ${serviceId}`);
    this.router.navigate(['/login']); // Existing Book Service navigation
  }

  submitDemoRequest(formData: any): void {
    console.log('Demo Request Form Submitted:', formData);
    // Implement your form submission logic here
  }
}