import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

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
  @Input() isSidebarCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<boolean>();

  @Input() userType: string | null = null;
  @Input() userName: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  toggleSidebarInternal() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.toggleSidebar.emit(this.isSidebarCollapsed);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}