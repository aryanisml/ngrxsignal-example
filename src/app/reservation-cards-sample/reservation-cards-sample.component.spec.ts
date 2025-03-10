import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCardsSampleComponent } from './reservation-cards-sample.component';

describe('ReservationCardsSampleComponent', () => {
  let component: ReservationCardsSampleComponent;
  let fixture: ComponentFixture<ReservationCardsSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCardsSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCardsSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
