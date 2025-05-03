import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
      services = [
    {
      id: 'electrician',
      imageUrl: 'assets/images/electrician.jpg',
      altText: 'Electrician Services',
      title: 'Professional Electrician Services',
      description: 'Our certified electricians provide safe and reliable electrical repairs, installations, and maintenance for your home or business.',
    },
    {
      id: 'plumber',
      imageUrl: 'assets/images/plumbing.jpg',
      altText: 'Plumbing Services',
      title: 'Reliable Plumbing Solutions',
      description: 'From fixing leaks and unclogging drains to complete plumbing system installations, our experienced plumbers are here to help.',
    },
    {
      id: 'carpenter',
      imageUrl: 'assets/images/carpenter.jpg',
      altText: 'Carpenter Services',
      title: 'Skilled Carpentry Work',
      description: 'Our skilled carpenters offer a wide range of services, including custom furniture, repairs, renovations, and more.',
    },
    {
      id: 'painter',
      imageUrl: 'assets/images/painting.jpg',
      altText: 'Painting Services',
      title: 'Quality Painting Services',
      description: 'Transform your space with our professional painting services for interiors and exteriors. We use high-quality paints and deliver excellent results.',
    },
    {
      id: 'home-cleaning',
      imageUrl: 'assets/images/house-cleaning.jpg',
      altText: 'Home Cleaning Services',
      title: 'Thorough Home Cleaning',
      description: 'Enjoy a sparkling clean home with our professional cleaning services. We offer flexible scheduling to meet your needs.',
    },
    {
      id: 'bike-wash',
      imageUrl: 'assets/images/bike-wash.jpg',
      altText: 'Car Services',
      title: 'Bike Water Servicing',
      description: 'Enjoy a sparkling clean water service for your bike with our professional cleaning services. We offer flexible scheduling to meet your needs.',
    },
    {
      id: 'car-wash',
      imageUrl: 'assets/images/car-wash.jpg',
      altText: 'Bike Services',
      title: 'Car Water Servicing',
      description: 'Enjoy a sparkling clean water service for your car with our professional cleaning services. We offer flexible scheduling to meet your needs.',
    },
  ];
  showRegisterDropdown = false;
  showLoginDropdown = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    document.body.classList.add('landing-page');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('landing-page'); // Remove class when leaving landing page
  }

  toggleRegisterDropdown(): void {
    this.showRegisterDropdown = !this.showRegisterDropdown;
    this.showLoginDropdown = false;
  }

  toggleLoginDropdown(): void {
    this.showLoginDropdown = !this.showLoginDropdown;
    this.showRegisterDropdown = false;
  }

  navigateToLogin(userType: 'client' | 'service-provider'): void {
    this.router.navigate(['/login'], { queryParams: { userType } });
    this.showLoginDropdown = false;
  }

  submitDemoRequest(formData: any): void {
    console.log('Demo Request Form Submitted:', formData);
    // Implement your form submission logic here
  }

  requestDemo(): void {
    const demoSection = document.getElementById('request-demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  bookService(): void {
    this.router.navigate(['/choose-account']);
  }
}