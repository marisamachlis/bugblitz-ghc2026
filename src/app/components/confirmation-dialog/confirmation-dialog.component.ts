import { Component, input, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit {
  clearCart = input(false);
  confirmed = output<void>();
  cancelled = output<void>();
  private confirmOverlayEl: HTMLElement | null = null;

  ngOnInit() {
    this.confirmOverlayEl = document.createElement('div');
    this.confirmOverlayEl.style.position = 'fixed';
    this.confirmOverlayEl.style.inset = '0';
    this.confirmOverlayEl.style.zIndex = '2000';
    this.confirmOverlayEl.style.background = 'rgba(0, 0, 0, 0.2)';
    this.confirmOverlayEl.addEventListener('click', () => this.cancelled.emit());
    document.body.appendChild(this.confirmOverlayEl);
  }

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }
}
