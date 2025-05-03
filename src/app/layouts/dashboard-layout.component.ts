import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../domain/application/user/user.service';
import { NotificationService } from '../../domain/application/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RaiseQuery } from '../../domain/interface/query';
import { SidebarComponent } from '../components/sidebar-component/sidebar.component';
import { AuthService } from '../../domain/application/auth/auth.service';
import { UserContext, UserContextService } from '../shared/services/user-context.service';

@Component({
  selector: 'app-dashboard-layout', // Adjust the selector as needed
  standalone: true,
  imports: [RouterOutlet, RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html', // Corrected templateUrl
  styleUrls: ['./dashboard-layout.component.scss'] // If you have a CSS file
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  clientId!: number;
  userAvatarUrl: string | null = null;
  userProfileSubscription!: Subscription;
  isProfileDropdownVisible: boolean = false;
  currentUserType!: string;
  showQueryModal: boolean = false;
  query: RaiseQuery = { serviceType: '', providerName: '', description: '' };
  queryFormControls: FormGroup;
  userTypeSubscription!: Subscription;

  constructor(
    private router: Router,
    private readonly userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private authService: AuthService,
    private readonly userContextService: UserContextService
  ) {
    this.queryFormControls = this.fb.group({
      serviceType: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userTypeSubscription = this.authService.getCurrentUserType().subscribe((type: any) => {
      this.currentUserType = type;
      if(this.currentUserType){
        this.loadUserProfile();
      }
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
    this.userTypeSubscription?.unsubscribe();
  }

  loadUserProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.userAvatarUrl = user.avatarUrl || null;
        this.clientId = user?.clientId;
        const context: UserContext = {
          userType: this.currentUserType,
          clientId: user.clientId || 0,
          userName: this.firstName +' '+this.lastName
        };
        this.userContextService.setUserContext(context);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.notificationService.showError('Failed to load user information.');
        this.router.navigate(['/login']);
      }
    } else {
      this.fetchUserProfile();
    }
  }

  fetchUserProfile(): void {
    this.userService.getUserProfile();
    this.userProfileSubscription = this.userService.userProfile$.subscribe({
      next: (user: any) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userAvatarUrl = user.avatarUrl || null;
        this.clientId = user?.id;
        const context: UserContext = {
          userType: this.currentUserType,
          clientId: this.clientId || 0,
          userName: this.firstName +' '+this.lastName
        };
        this.userContextService.setUserContext(context);
        this.notificationService.showSuccess('Welcome to your dashboard!');
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load user profile.');
        this.router.navigate(['/login'], { queryParams: { userType: this.currentUserType } });
      }
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.isProfileDropdownVisible = false;
  }

  navigateToSettings(): void {
    this.router.navigate(['/settings']);
    this.isProfileDropdownVisible = false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  openQueryModal(): void {
    this.showQueryModal = true;
    this.queryFormControls.reset();
    this.query = { serviceType: '', providerName: '', description: '' };
  }

  closeQueryModal(): void {
    this.showQueryModal = false;
  }

  submitQuery(): void {
    if (this.queryFormControls.valid) {
       let queryData: RaiseQuery = {
        serviceType: '',
        providerName: '', // Example date
        description: ''
      };
      this.userService.submitQuery(queryData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Your query has been submitted successfully.');
          this.closeQueryModal();
          this.query = { serviceType: '', providerName: '', description: '' }; // Reset query form
          this.queryFormControls.reset();
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to submit your query.');
          console.error('Error submitting query:', error);
        }
      });
    } else {
      this.notificationService.showWarning('Please fill out all required fields in the query form.');
      this.queryFormControls.markAllAsTouched();
    }
  }
}