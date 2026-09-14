import { TestBed } from '@angular/core/testing';
import { CareComponent } from './care.component';

describe('CareComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CareComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
