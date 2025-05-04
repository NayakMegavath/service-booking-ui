import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'choose-account',
    loadComponent: () => import('./choose-account/choose-account.component').then((m) => m.ChooseAccountComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/client-dashboard/client-dashboard.component').then((m) => m.ClientDashboardComponent) },
      { path: 'bookings', loadComponent: () => import('./pages/bookings/bookings.component').then((m) => m.BookingsComponent) },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
    ],
  },
  { path: 'logout', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) }, // Top-level logout route
];