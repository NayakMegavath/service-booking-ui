import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import the module
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule, NgIf],
  template: `
    <div class="loader-container" *ngIf="isLoading">
      <mat-progress-spinner diameter="50"></mat-progress-spinner>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription!: Subscription;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loaderService.isLoading$.subscribe(
      (loading: any) => {
        this.isLoading = loading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}