import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderGridComponent } from './provider-grid.component';

describe('ProviderGridComponent', () => {
  let component: ProviderGridComponent;
  let fixture: ComponentFixture<ProviderGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
