import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhtmlSchedulerComponent } from './dhtml-scheduler.component';

describe('DhtmlSchedulerComponent', () => {
  let component: DhtmlSchedulerComponent;
  let fixture: ComponentFixture<DhtmlSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhtmlSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhtmlSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
