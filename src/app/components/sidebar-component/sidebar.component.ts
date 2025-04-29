import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../domain/application/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  userTypeFromUrl: string | null = null;
  private routeSubscription!: Subscription;
  isSidebarCollapsed: boolean = false;
  
  @Input() userType: string | null = null;

  constructor(private router: Router
  ) {}
   
   ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
