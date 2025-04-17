import { TestBed } from '@angular/core/testing';

import { BookingsServiceService } from './bookings.service.service';

describe('BookingsServiceService', () => {
  let service: BookingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
