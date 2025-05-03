import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ServiceProvider } from '../../domain/interface/service-provider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-grid',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './provider-grid.component.html',
  styleUrls: ['./provider-grid.component.scss']
})
export class ProviderGridComponent implements OnChanges {
  @Input() providers: ServiceProvider[] = [];
  @Input() selectedProviderId: number | null = null;
  @Input() sortOptions: { value: string; label: string }[] = [];
  @Output() providerSelected = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<string>();

  sortedProviders: ServiceProvider[] = [];
  currentSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['providers']) {
      this.sort(this.currentSortColumn);
    }
  }

  selectProvider(providerId: number) {
    this.providerSelected.emit(providerId);
  }

  sort(column: string) {
    if (this.currentSortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedProviders = [...this.providers].sort((a, b) => {
      const aValue = a[column as keyof ServiceProvider];
      const bValue = b[column as keyof ServiceProvider];

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.sortChanged.emit(column);
  }
}