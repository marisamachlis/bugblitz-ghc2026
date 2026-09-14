import { TestBed } from '@angular/core/testing';
import { PlantsComponent } from './plants.component';

describe('PlantsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlantsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
