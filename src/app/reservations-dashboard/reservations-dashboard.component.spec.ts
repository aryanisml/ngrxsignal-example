import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAccordinComponent } from './reservations-dashboard.component';

describe('ReservationAccordinComponent', () => {
  let component: ReservationAccordinComponent;
  let fixture: ComponentFixture<ReservationAccordinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAccordinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationAccordinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
