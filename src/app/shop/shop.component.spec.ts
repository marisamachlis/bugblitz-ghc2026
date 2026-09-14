import { TestBed } from '@angular/core/testing';
import { ShopComponent } from './shop.component';

describe('ShopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShopComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
