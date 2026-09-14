import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let component: ConfirmationDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('clearCart', true);
    fixture.detectChanges();
  });

  afterEach(() => {
    for (const element of Array.from(document.body.children)) {
      if ((element as HTMLElement).style.zIndex === '2000') {
        element.remove();
      }
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the clear-cart confirmation and offer', () => {
    expect(fixture.nativeElement.textContent).toContain('clear all items');
    expect(fixture.nativeElement.textContent).toContain('GHC2026');
  });

  it('should emit when confirming or cancelling', () => {
    let confirmed = false;
    let cancelled = false;
    component.confirmed.subscribe(() => (confirmed = true));
    component.cancelled.subscribe(() => (cancelled = true));

    component.confirm();
    component.cancel();

    expect(confirmed).toBeTrue();
    expect(cancelled).toBeTrue();
  });
});
