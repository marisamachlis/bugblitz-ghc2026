import { TestBed } from '@angular/core/testing';
import { CartModalComponent } from './cart-modal.component';

describe('CartModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartModalComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CartModalComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
