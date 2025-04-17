// src/app/logout/logout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path to your AuthService

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: '', // This component doesn't need a visible template
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Get the current user type (you might need to adjust this based on how you store it)
    let userType: string | null = null;
    this.authService.getCurrentUserType().subscribe((type: any) => {
      userType = type || null;
      this.performLogout(userType);
    });
  }

  performLogout(userType: string | null): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { userType: userType } });
  }
}