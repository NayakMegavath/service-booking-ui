// // src/app/pages/profile/profile.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//   ],
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
// })
// export class ProfileComponent implements OnInit {
//   profile = {
//     name: '',
//     email: '',
//     phone: ''
//   };

//   constructor() {}

//   ngOnInit(): void {
//     // You can load profile data from API here
//     this.profile = {
//       name: 'John Doe',
//       email: 'john@example.com',
//       phone: '123-456-7890'
//     };
//   }

//   saveProfile(): void {
//     console.log('Saving profile...', this.profile);
//     // Call your service to save updated profile
//   }
// }

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
