// import { Component } from '@angular/core';
// import { RegisterService } from '../register.service';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [FormsModule], // Add FormsModule to imports
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.scss'
// })
// export class RegisterComponent {
//   registerData = { username: '', email: '', password: '' };

//   constructor(private registerService: RegisterService,
//     private router: Router
//   ) {}

//   onSubmit() {
//     this.registerService.register(this.registerData.username, this.registerData.email, this.registerData.password).subscribe((response: any) => {
//       console.log('Registered successfully:', response);
//     });
//   };

//   onCancel() {
//     this.router.navigate(['/']);
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterService]
})
export class RegisterComponent {
  registerData: any = {}; // Initialize with an empty object
  formErrors: any = {};

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  validatePhone() {
    if (this.registerData.phone && this.registerData.phone.length < 10) {
      this.formErrors.phone = 'Phone number must be 10 digits.';
    } else {
      delete this.formErrors.phone;
    }
  }

  validatePassword() {
    if (this.registerData.password && this.registerData.password.length < 8) {
      this.formErrors.password = 'Password must be at least 8 characters long.';
    } else if (this.registerData.password && this.registerData.password.length > 20) {
      this.formErrors.password = 'Password cannot be longer than 20 characters.';
    } else {
      delete this.formErrors.password;
    }
  }

  validateEmail() {
    if (this.registerData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.registerData.email)) {
        this.formErrors.email = 'Invalid email format.';
      } else {
        delete this.formErrors.email;
      }
    } else {
      delete this.formErrors.email; // Clear error if email is optional and empty
    }
  }

  onSubmit() {
    this.formErrors = {}; // Reset errors on submit
    let hasErrors = false;

    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'password'];
    requiredFields.forEach(field => {
      if (!this.registerData[field]) {
        this.formErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        hasErrors = true;
      }
    });

    // Validate phone number
    this.validatePhone();
    if (this.formErrors.phone) {
      hasErrors = true;
    }

    // Validate email (if entered)
    this.validateEmail();
    if (this.formErrors.email) {
      hasErrors = true;
    }

    // Validate password
    this.validatePassword();
    if (this.formErrors.password) {
      hasErrors = true;
    }

    if (hasErrors) {
      return; // Stay on the same page if there are errors
    }

    // If no errors, proceed with registration
    this.registerService.register(this.registerData).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        // Handle error
      }
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}