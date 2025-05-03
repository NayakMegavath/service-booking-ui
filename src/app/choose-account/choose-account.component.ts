import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-choose-account',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.scss']
})
export class ChooseAccountComponent {
  constructor(private router: Router, private location: Location) {}

  navigateToRegister(userType: 'client' | 'service-provider'): void {
    this.router.navigate(['/register'], { queryParams: { userType: userType } });
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }
}