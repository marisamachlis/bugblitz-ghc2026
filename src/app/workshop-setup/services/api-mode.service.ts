// ============================================================================
// ℹ️ WORKSHOP SETUP: Toggle between Mock or Live data.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================ 

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiModeService {
  // Reactive signal tracking whether mock mode is active
  readonly mock = signal<boolean>(this.checkInitialMode());

  switchMode(targetMockState: boolean): void {
    const currentUrl = new URL(window.location.href);

    if (targetMockState) {
      currentUrl.searchParams.set('mock', 'true');
    } else {
      currentUrl.searchParams.set('mock', 'false');
    }

    // Reload page with updated parameter (preserving other query params like team=X)
    window.location.href = currentUrl.toString();
  }

  private checkInitialMode(): boolean {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('mock')) return params.get('mock') === 'true';
    }
    return false;
  }
}