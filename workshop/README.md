# Workshop tooling

This folder contains the local Node mock API and development tooling, outside
the bug exercises. Angular workshop components and services live in
[`src/app/workshop/`](../src/app/workshop/).

Run `npm start` from the repository root. The launcher starts Angular on port
4200 before the mock API on port 4300 so StackBlitz previews the app first.

| File | Purpose |
|------|---------|
| `dev-mock.mjs` | Starts Angular and the mock server |
| `mock-api-server.mjs` | Serves mock requests and stores local checkout orders in memory |
| `mock-data.mjs` | Sample products, categories, and coupons |
| `mock-api.proxy.json` | Routes Angular's `/api` requests to the mock server |
| `*.test.mjs` | Launcher and mock API checks |

Run the checks from the repository root:

```bash
node --test workshop/*.test.mjs
```

See [workshop setup](../src/app/workshop/README.md) for selecting live or mock mode.
