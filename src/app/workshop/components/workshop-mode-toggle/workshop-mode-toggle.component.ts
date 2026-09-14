// ============================================================================
// ℹ️ WORKSHOP SETUP: Toggle between Mock or Live data.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================ 

import { Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModeService } from '../../services/api-mode.service';

@Component({
  selector: 'app-workshop-mode-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-mode-toggle.component.html',
  styleUrls: ['./workshop-mode-toggle.component.scss']
})
export class WorkshopModeToggleComponent {
  @Input() inline = false;
  readonly apiMode = inject(ApiModeService);
  private elementRef = inject(ElementRef);

  isPopoverOpen = signal(false);

  togglePopover(): void {
    this.isPopoverOpen.update(open => !open);
  }

  switchMode(targetMock: boolean): void {
    this.apiMode.switchMode(targetMock);
    this.isPopoverOpen.set(false);
  }

  // Auto-close popover when clicking outside the component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPopoverOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
    onEscape(): void {
    this.isPopoverOpen.set(false);
    }
}
