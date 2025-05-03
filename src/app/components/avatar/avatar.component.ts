import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // If you use routerLink

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add any necessary modules
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  isDropdownVisible: boolean = false; // Add this property
  userAvatarUrl: string = 'assets/images/user-avatar.png';
  constructor() { }

  ngOnInit(): void {
    // Here you would typically load the user's avatar URL
    // Example: this.userAvatarUrl = localStorage.getItem('userAvatar') || null;
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}