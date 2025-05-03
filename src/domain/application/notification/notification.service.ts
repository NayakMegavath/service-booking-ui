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
        panelClass: ['simple-success'], // Correct panelClass
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
        panelClass: ['simple-error'], // Correct panelClass
      }
    );
  }

  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: duration,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['simple-warning'], // Correct panelClass
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
      data: config?.data,
      ...config,
    });
  }
}