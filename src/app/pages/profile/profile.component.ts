// // src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    avatar: 'https://i.pravatar.cc/100',
    serviceInterests: ['Electrician', 'Plumber', 'House Cleaning'],
  };
}
