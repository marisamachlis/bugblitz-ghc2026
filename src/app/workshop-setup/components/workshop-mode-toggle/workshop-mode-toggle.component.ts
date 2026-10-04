// ============================================================================
// ℹ️ WORKSHOP SETUP: Toggle between Mock or Live data, team selection.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================ 

import { Component, ElementRef, HostListener, Input, inject, signal } from '@angular/core';
import { WORKSHOP_CONFIG } from '../../workshop.config';
import { getTeamId } from '../../../data/db';
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

  readonly teamId = getTeamId();
  readonly maxTeamNumber = WORKSHOP_CONFIG.maxTeamNumber;
  isTeamPopoverOpen = signal(false);
  isPopoverOpen = signal(false);

  toggleTeamPopover(): void {
    this.isPopoverOpen.set(false);
    this.isTeamPopoverOpen.update(open => !open);
  }

  selectTeam(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    if (input.reportValidity()) this.switchTeam(String(input.valueAsNumber));
  }

  switchTeam(team: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set('team', team);
    window.location.href = url.toString();
  }

  togglePopover(): void {
    this.isTeamPopoverOpen.set(false);
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
      this.isTeamPopoverOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isPopoverOpen.set(false);
    this.isTeamPopoverOpen.set(false);
  }
}
