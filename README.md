# Leafy Co. The Green Nook — Premium House Plants

An Angular storefront for house plants and care supplies, backed by a shared
Supabase database.

For more information, check out the Bug Blitz guide: https://dianagracie.github.io/2026-Workshop-Guide/index.html.

## Run locally

You need **Node ≥ 22** (which comes with npm) and internet access. Clone this
repo, then from the project root pick one of the two paths below.

### Path A — Standard npm (recommended, works on any OS)

```bash
npm install
npm start
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
| `npm start`     | Start Angular dev server at http://localhost:4200 |
| `npm run build` | Production build |

### Make targets (Path B only)

If Path B works for you, these additional Make targets are available:

| Target        | What it does |
|---------------|--------------|
| `make setup`  | Verify Node ≥ 22 (or install via nvm) and `npm install` |
| `make dev`    | Start Angular dev server at http://localhost:4200 |
| `make build`  | Production build |
| `make clean`  | Remove `node_modules` and `package-lock.json` |
| `make`        | Show available targets |

## Switching teams

Every request goes to the Supabase RPC `team_query` with a team id. Which team
you see is resolved (in order):

1. `environment.team` — build-time constant in
   [`src/environments/environment.ts`](src/environments/environment.ts). Set it
   to force a team for everyone. Empty by default.
2. The `?team=<id>` URL query param — read at page load.
3. Fallback to team `1`.

So without any config, `http://localhost:4200/` shows team 1;
`http://localhost:4200/?team=2` shows team 2; and so on. To switch teams while
the app is open, the build-time constant in
   [`src/environments/environment.ts`](src/environments/environment.ts) cannot be set. If not, then you can change the URL and **fully reload** — the DB client is
initialized once per page load.

## Try it in StackBlitz

Don't want to set up a local Node environment? We have an option to run the project in StackBlitz instead (recommended if you want a quick start option). Check out the [Set Up Guide](https://dianagracie.github.io/2026-Workshop-Guide/index.html#setup) for details.

## Project layout

```
## Project Layout

```text
src/
├── app/          # Angular UI components (header, cart modal, checkout, cards)
├── lib/          # Application data layer, state services, and Supabase client
└── environments/ # Supabase URLs and default team configuration
Makefile          # Local setup and development scripts
```
