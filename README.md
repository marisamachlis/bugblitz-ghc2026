# Leafy Co. The Green Nook — Premium House Plants

An Angular storefront for house plants and care supplies, backed by a shared
Supabase database.

For more information, check out the Bug Blitz guide: https://dianagracie.github.io/bugblitz-guide-ghc2026/index.html.

> **Note:** There are intentionally baked-in bugs in the app, but there should be products displayed when you run the app. If there are none, please see [troubleshooting](#troubleshooting).

## Run locally

You need **Node ≥ 22** (which comes with npm) and internet access. Clone this
repo, then from the project root pick one of the two paths below.

### Path A — Standard npm (recommended, works on any OS)

```bash
npm install && npm start
```

### Path B — Makefile shortcut (if you already have `make` and `nvm`)

The repo also ships a `Makefile` that wraps `nvm install` (using `.nvmrc`),
dependency install, and the dev server in one go:

```bash
make setup && make dev
```

This works well when both tools are set up. It **may not work** depending on
your environment — missing `make`, no `nvm`, non-Unix shell, or corporate
restrictions — so if it errors, fall back to Path A.

### After either path

Open **http://localhost:4200** (add `?team=<id>` to load a specific team — see
[Switching teams](#switching-teams) below).

If you don't want to set up a local node environment, see [Try it in StackBlitz](#try-it-in-stackblitz) below.

### Troubleshooting

#### Switching to Mock API Mode

If a corporate firewall blocks connections to Supabase, switch to the local Mock API using any of these methods:

* **In the App Nav Bar:** Click the **Workshop Mode: Live Supabase** badge and select **Switch to Mock API**.
* **Via URL:** Append `&mock=true` to your URL (e.g., `http://localhost:4200/?team=<team_number>&mock=true`).
* **Environment Default:** Set `mock: true` in `src/environments/environment.ts`.

> **Note:** Look for the **Workshop Mode: Mock API** badge to confirm mock mode is active.

### Never installed Node before?

**Easiest:** download and run the installer from [nodejs.org](https://nodejs.org/) — first-party installers for macOS (`.pkg`), Windows (`.msi`), and Linux. Pick the LTS release (currently 22.x). After it finishes, open a new terminal, then `cd` into the project root and run `npm install && npm start`.

**If you want to manage multiple Node versions**, use a version manager. The project ships a `.nvmrc` file so version managers pick the right Node version automatically.

**macOS / Linux — [nvm](https://github.com/nvm-sh/nvm):**

Pick one install method:

*A. Upstream installer (personal machines)*

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

The URL is from the official [nvm-sh/nvm](https://github.com/nvm-sh/nvm) repo,
pinned to a git tag. If you'd rather read the script first:

```bash
curl -o /tmp/nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
less /tmp/nvm-install.sh    # inspect
bash /tmp/nvm-install.sh
```

*B. Homebrew (corporate / managed machines)*

If your machine restricts `curl | bash` installs, or you already manage tools with Homebrew:

```bash
brew install nvm
mkdir -p "$HOME/.nvm"
```

Then add these lines to your `~/.zshrc` (or `~/.bashrc`) so nvm loads in every shell:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && . "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
```

**Windows — [nvm-windows](https://github.com/coreybutler/nvm-windows):**

Download the installer from the [releases page](https://github.com/coreybutler/nvm-windows/releases) and run it. Open a new PowerShell or Command Prompt window afterwards so `nvm` is on your PATH.

**After installing a version manager:** open a new terminal, then from the project root:

```bash
nvm install       # reads .nvmrc, installs the right Node version
nvm use           # activates it in the current shell
npm install       # install project dependencies
npm start         # start the dev server at http://localhost:4200
```

### npm scripts

| Command         | What it does |
|-----------------|--------------|
| `npm install`   | Install project dependencies |
| `npm start`     | Start the app on port 4200 and local mock API on port 4300 |
| `npm run start:app-only` | Start Angular only (no mock server) |
| `npm run build` | Production build |

### Make targets (Path B only)

If Path B works for you, these additional Make targets are available:

| Target        | What it does |
|---------------|--------------|
| `make setup`  | Verify Node ≥ 22 (or install via nvm) and `npm install` |
| `make dev`    | Start the app on port 4200 and local mock API on port 4300 |
| `make build`  | Production build |
| `make clean`  | Remove `node_modules` and `package-lock.json` |
| `make`        | Show available targets |

## Switching teams

Use the **Team** toggle in the header next to the API mode badge to enter your assigned team number.
**Team: None** shares live data with other participants who haven’t selected a team.
If you are in Mock API mode, data is not shared with your team.

You can also add your team number to the URL, for example:
`http://localhost:4200/?team=<id>` and press **Enter** to load that team.

You can also update the default team configured in
[`src/environments/environment.ts`](src/environments/environment.ts).

> Note that the `?team=<id>` URL parameter overrides the default.

## Try it in StackBlitz

Don't want to set up a local Node environment? We have an option to run the project in StackBlitz instead (recommended if you want a quick start option). Check out the [Set Up Guide](https://dianagracie.github.io/bugblitz-guide-ghc2026/index.html#setup) for details.

## Project layout

```text
src/
├── app/
│   ├── components/ # Storefront UI components and pages
│   ├── data/       # Supabase client, data adapter, and product metadata
│   ├── models/     # Shared application interfaces
│   ├── services/   # Storefront state, behavior, and shared data service
│   └── workshop/  # Angular workshop setup — outside the bug exercises
│       ├── components/workshop-mode-toggle/
│       └── services/ # Mode selection and mock HTTP adapter
├── environments/  # Supabase connection, default team, and default mode
└── main.ts        # Application bootstrap and routes
workshop/          # Workshop setup, node mock server - outside of bug exercises
Makefile           # Local setup and development scripts
```
