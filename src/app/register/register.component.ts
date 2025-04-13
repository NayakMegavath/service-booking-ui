import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../register.service';
import { Subscription } from 'rxjs';
import { LoaderService } from '../loader.service';

interface Skill {
  value: string;
  label: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  userType: 'client' | 'service-provider' = 'client';
  registrationHeading: string = 'Register';
  infoText: string = 'Please fill out the form below to create your account.';
  skills: Skill[] = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'painting', label: 'Painting' },
    { value: 'gardening', label: 'Gardening' },
    // Add more skills as needed
  ];
  selectedSkills: string[] = [];
  formErrors: any = {};
  registerData: any = {};
  showPasswordRules = false;
  passwordVisible = false;
  showCrossedEye = true; // Initially show the crossed eye
  eyeIconVisible = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>`;
  eyeIconCrossed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zM12 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    <path d="M3.51 18.99l17.02-13.98-1.41-1.42-17.02 13.98 1.41 1.42z" />
  </svg>`;

  registerUserSubscription!: Subscription;
  constructor(private router: Router, 
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userType = params['userType'] === 'service-provider' ? 'service-provider' : 'client';
      this.registrationHeading = `Register as ${this.userType === 'client' ? 'Client' : 'Service Provider'}`;
      this.infoText = this.userType === 'client'
        ? 'Please fill out the form below to create your client account.'
        : 'Please fill out the form below to create your service provider account.';
    });
  }

  onSubmit(): void {
    this.loaderService.show();
    this.formErrors = {}; // Reset errors
    this.registerData.userType = this.userType;
    if (this.userType === 'service-provider') {
      this.registerData.skills = this.selectedSkills;
      if (this.selectedSkills.length === 0) {
        this.formErrors.skills = 'Please select at least one skill.';
        return;
      }
    }
    // Implement your actual registration API call here
    // Call the registration service
    this.registerUserSubscription = this.registerService.registerUser(this.registerData).subscribe({
      next: (response: boolean) => {
        if(response){
          this.router.navigate(['/login']); // Redirect on success
          this.loaderService.hide();
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
        // Handle registration error (e.g., display error message to the user)
        // You might want to parse the error response from the API
        if (error && error.error && error.error.message) {
          // Example: this.formErrors.general = error.error.message;
        } else {
          // this.formErrors.general = 'Registration failed. Please try again.';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.registerUserSubscription?.unsubscribe();
  }

  toggleSkill(skillValue: string): void {
    const isAlreadySelected = this.selectedSkills.includes(skillValue);

    if (isAlreadySelected) {
      this.selectedSkills = this.selectedSkills.filter(skill => skill !== skillValue);
    } else if (this.selectedSkills.length < 3) {
      this.selectedSkills = [...this.selectedSkills, skillValue];
    }
  }

  isSkillSelected(skillValue: string): boolean {
    return this.selectedSkills.includes(skillValue);
  }

  validatePhone(): void {
    if (!this.registerData.phoneNumber) {
      this.formErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(this.registerData.phoneNumber)) {
      this.formErrors.phoneNumber = 'Phone number must be 10 digits.';
    } else {
      delete this.formErrors.phoneNumber;
    }
  }

  validatePassword(): void {
    const password = this.registerData.password;
    if (!password) {
      this.formErrors.password = 'Password is required.';
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[^\w\s]/.test(password);

    if (password.length < 8) {
      this.formErrors.password = 'Password must be at least 8 characters long.';
    } else if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
      this.formErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    } else {
      delete this.formErrors.password;
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  getSkillLabel(skillValue: string): string | undefined {
    const skill = this.skills.find(s => s.value === skillValue);
    return skill ? skill.label : undefined;
  }

  removeSkill(index: number): void {
    this.selectedSkills.splice(index, 1);
  }

  togglePasswordRules(): void {
    this.showPasswordRules = !this.showPasswordRules;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.showCrossedEye = !this.showCrossedEye;
  }
}
