import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Skill {
  value: string;
  label: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  userType: 'client' | 'service-provider' = 'client';
  registrationHeading: string = 'Client Registration';
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userType = params['userType'] === 'service-provider' ? 'service-provider' : 'client';
      this.registrationHeading = `${this.userType === 'client' ? 'Client' : 'Service Provider'} Registration`;
    });
  }

  register(formData: any): void {
    formData.userType = this.userType;
    if (this.userType === 'service-provider') {
      formData.skills = this.selectedSkills;
    }
    console.log('Registration Form Data:', formData);
    // Implement your registration logic here, including sending data to your backend
    this.router.navigate(['/login']); // Redirect to login after successful registration
  }

  toggleSkill(skillValue: string): void {
    const index = this.selectedSkills.indexOf(skillValue);
    if (index === -1 && this.selectedSkills.length < 3) {
      this.selectedSkills = [...this.selectedSkills, skillValue];
    } else if (index !== -1) {
      this.selectedSkills = this.selectedSkills.filter(s => s !== skillValue);
    }
    console.log('Selected Skills:', this.selectedSkills);
  }

  isSkillSelected(skillValue: string): boolean {
    return this.selectedSkills.includes(skillValue);
  }
}