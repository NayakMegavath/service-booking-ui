import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private router: Router) {}

  login(formData: any): void {
    // Your login logic here
    console.log('Login Form Data:', formData);

    // Example of setting an error message if login fails
    if (formData.username !== 'test' || formData.password !== 'password') {
      this.errorMessage = 'Invalid username or password.';
    } else {
      this.errorMessage = ''; // Clear any previous error message
      this.router.navigate(['/dashboard']); // Example navigation on successful login
    }
  }

  goToLandingPage(): void {
    this.router.navigate(['/']); // Assuming '/' is your landing page route
  }
}