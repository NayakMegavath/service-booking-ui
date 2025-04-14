import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: duration,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['simple-success'], // Ensure this class is applied
      }
    );
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: duration,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['simple-error'], // Ensure this class is applied
      }
    );
  }

  showMessage(
    message: string,
    panelClass: string | string[],
    duration: number = 3000,
    actionLabel: string = 'Close',
    config?: MatSnackBarConfig
  ): void {
    this.snackBar.open(message, actionLabel, {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: Array.isArray(panelClass) ? panelClass : [panelClass],
      data: config?.data, // Pass through any data for styling
      ...config,
    });
  }
}