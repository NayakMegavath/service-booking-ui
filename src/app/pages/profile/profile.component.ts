import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { Subject, takeUntil } from 'rxjs';
import { Profile } from '../../../domain/interface/profile';
import { ChangePasswordData } from '../../../domain/interface/change-password';
import { NotificationPreferences } from '../../../domain/interface/notification-preferences';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: Profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    avatar: 'https://i.pravatar.cc/150',
    address: '123 Main Street, Anytown',
    serviceInterests: [],
  };

  showEditProfilePopup = false;
  editProfileData: Profile = { ...this.profile }; // Initialize with current profile data
  savingProfile = false;
  profileUpdateError = '';
  profileUpdateSuccess = '';

  showChangePasswordPopup = false;
  changePasswordData: ChangePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  };
  changingPassword = false;
  changePasswordError = '';
  otpSentMessage = '';
  showOtpConfirmation = false;
  otpConfirmationError = '';

  showNotificationPreferencesPopup = false;
  notificationPreferences: NotificationPreferences = {
    newBooking: true,
    bookingReminder: true,
    bookingUpdate: true,
    promotions: false,
  };
  savingPreferences = false;
  notificationPreferenceError = '';
  notificationPreferenceSuccess = '';

  private readonly destroy$ = new Subject<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {}

  ngOnInit(): void {
    // Fetch actual profile and preferences from service
    // Example: this.profileService.getProfile().pipe(takeUntil(this.destroy$)).subscribe(data => this.profile = data);
    // Example: this.notificationService.getPreferences().pipe(takeUntil(this.destroy$)).subscribe(prefs => this.notificationPreferences = prefs);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  uploadAvatar(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profile.avatar = e.target?.result as string;
      // In a real application, upload to server and update profile
      console.log('New avatar:', this.profile.avatar);
    };
    reader.readAsDataURL(file);
  }

  openEditProfilePopup(): void {
    this.editProfileData = { ...this.profile }; // Populate form with current data
    this.showEditProfilePopup = true;
    this.profileUpdateError = '';
    this.profileUpdateSuccess = '';
  }

  closeEditProfilePopup(): void {
    this.showEditProfilePopup = false;
  }

  saveProfile(form: NgForm): void {
    if (form.valid) {
      this.savingProfile = true;
      this.profileUpdateError = '';
      // Simulate API call to save profile data
      setTimeout(() => {
        this.savingProfile = false;
        this.profile = { ...this.editProfileData }; // Update displayed profile
        this.profileUpdateSuccess = 'Profile updated successfully!';
        setTimeout(() => this.closeEditProfilePopup(), 1500); // Close after a short delay
        console.log('Updated Profile Data:', this.profile);
        // In a real app, you would call your profile service to update the data
      }, 1500);
    } else {
      this.profileUpdateError = 'Please ensure all required fields are filled.';
    }
  }

  openChangePasswordPopup(): void {
    this.showChangePasswordPopup = true;
    this.changePasswordData = { currentPassword: '', newPassword: '', confirmPassword: '', otp: '' };
    this.changePasswordError = '';
    this.otpSentMessage = '';
    this.showOtpConfirmation = false;
    this.otpConfirmationError = '';
  }

  closeChangePasswordPopup(): void {
    this.showChangePasswordPopup = false;
  }

  changePassword(): void {
    if (this.changePasswordData.newPassword === this.changePasswordData.confirmPassword) {
      this.changingPassword = true;
      this.changePasswordError = '';
      // Simulate API call to check current password and send OTP
      setTimeout(() => {
        if (this.changePasswordData.currentPassword === 'password123') { // Replace with actual API call
          this.changingPassword = false;
          this.otpSentMessage = 'OTP sent to your registered email/phone.';
          this.showOtpConfirmation = true;
        } else {
          this.changingPassword = false;
          this.changePasswordError = 'Incorrect current password.';
        }
      }, 1500);
    } else {
      this.changePasswordError = 'New passwords do not match.';
    }
  }

  confirmPasswordChange(): void {
    this.otpConfirmationError = '';
    // Simulate API call to verify OTP and update password
    setTimeout(() => {
      if (this.changePasswordData.otp === '123456') { // Replace with actual API call
        this.closeChangePasswordPopup();
        alert('Password changed successfully!'); // Replace with proper notification
      } else {
        this.otpConfirmationError = 'Incorrect OTP.';
      }
    }, 1000);
  }

  openNotificationPreferencesPopup(): void {
    this.showNotificationPreferencesPopup = true;
    this.notificationPreferenceError = '';
    this.notificationPreferenceSuccess = '';
    // Fetch current preferences if not already loaded
  }

  closeNotificationPreferencesPopup(): void {
    this.showNotificationPreferencesPopup = false;
  }

  saveNotificationPreferences(): void {
    this.savingPreferences = true;
    this.notificationPreferenceError = '';
    // Simulate API call to save notification preferences
    setTimeout(() => {
      this.savingPreferences = false;
      this.notificationPreferenceSuccess = 'Notification preferences saved successfully!';
      // In a real app, you might want to close the popup after a short delay
      // setTimeout(() => this.closeNotificationPreferencesPopup(), 1000);
    }, 1000);
  }
}