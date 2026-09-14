// ============================================================================
// ℹ️ WORKSHOP SETUP: Team selection configuration.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================ 

import { DefaultUrlSerializer, Params, UrlTree } from '@angular/router';

// Include workshop settings in RouterLink hrefs as well as in navigations,
// so opening a link in another tab keeps the same data source and team.
export class SessionUrlSerializer extends DefaultUrlSerializer {
  private readonly sessionParams: Params;

  constructor(search: string) {
    super();
    const query = new URLSearchParams(search);
    const team = query.get('team')?.trim();
    const mock = query.get('mock');
    this.sessionParams = {
      ...(team ? { team } : {}),
      ...(mock === 'true' || mock === 'false' ? { mock } : {}),
    };
  }

  override serialize(tree: UrlTree): string {
    return super.serialize(new UrlTree(
      tree.root,
      { ...this.sessionParams, ...tree.queryParams },
      tree.fragment,
    ));
  }
}
