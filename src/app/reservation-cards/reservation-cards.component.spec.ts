import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCardsComponent } from './reservation-cards.component';

describe('ReservationCardsComponent', () => {
  let component: ReservationCardsComponent;
  let fixture: ComponentFixture<ReservationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
