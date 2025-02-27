import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccordinComponent } from './consumer-accordin.component';

describe('ConsumerAccordinComponent', () => {
  let component: ConsumerAccordinComponent;
  let fixture: ComponentFixture<ConsumerAccordinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerAccordinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerAccordinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
