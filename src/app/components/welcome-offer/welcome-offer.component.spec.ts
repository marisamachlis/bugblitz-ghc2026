import { TestBed } from '@angular/core/testing';
import { WelcomeOfferComponent } from './welcome-offer.component';

describe('WelcomeOfferComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeOfferComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WelcomeOfferComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});