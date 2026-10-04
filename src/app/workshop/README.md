# Workshop setup

These files support running and setting up the workshop and are outside the bug exercises.
This folder contains Angular runtime code. Node tooling lives in the root
[`workshop/`](../../../workshop/) folder. Both are outside the bug exercises.

For the exercises, start with [`../components/`](../components/) and
[`../services/`](../services/).

## Start the app

From the repository root, run:

```bash
npm start
```

This starts the app at http://localhost:4200 and the local mock API on port
4300. Angular opens its port first so StackBlitz initially previews the app.
Both data modes are available; starting the servers does not select a mode.

## Choose a data mode

Use the **Workshop Mode** menu in the app header, or open:

- **Mock API:** http://localhost:4200/?mock=true
- **Live Supabase:** http://localhost:4200/?mock=false

Without a `mock` query parameter, the app uses `environment.mock` in
[`src/environments/environment.ts`](../../environments/environment.ts).
An explicit `mock=true` or `mock=false` overrides that default.

Mock mode uses sample products and coupons. Orders come from your local
checkout activity and can be looked up by email. Orders are cleared when the server restarts.

## Facilitator configuration

The team selector limit is maintained in [`workshop.config.ts`](./workshop.config.ts).
Facilitators can update `WORKSHOP_CONFIG.maxTeamNumber` (currently 50) when the
available teams change. This setting is outside participant environment setup
and the bug exercises.

This is a client-side selector limit, not an access-control boundary. Anyone
editing their own copy of the source can change it; database access must be
controlled on the backend.

## Files in this folder

| Path | Purpose |
|------|---------|
| `workshop.config.ts` | Facilitator-maintained team selector limit |
| `services/api-mode.service.ts` | Selects live or mock mode |
| `services/mock-store.service.ts` | Mock HTTP adapter |
| `components/workshop-mode-toggle/` | Header menu for switching modes |
