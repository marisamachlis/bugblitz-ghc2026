# Leafy Co. The Green Nook — Premium House Plants

An Angular storefront for house plants and care supplies, backed by a shared
Supabase database.

For more information, check out the Bug Blitz guide: https://dianagracie.github.io/2026-Workshop-Guide/index.html.

## Run locally

You need **Node ≥ 22** (which comes with npm) and internet access. If you
already have those, this is a single command:

```bash
make setup && make dev
```

Then open **http://localhost:4200** (add `?team=<id>` to load a specific team — see [Switching teams](#switching-teams) below).

If you don't want to set up a local node environment, see [Try it in StackBlitz](#try-it-in-stackblitz) below.

### Never installed Node before?

The recommended path is [nvm](https://github.com/nvm-sh/nvm), which reads the
project's `.nvmrc` and picks the right Node version automatically. Pick one
install method:

**A. Upstream installer (personal machines)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

The URL is from the official [nvm-sh/nvm](https://github.com/nvm-sh/nvm) repo,
pinned to a git tag.

```bash
curl -o /tmp/nvm-install.sh https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
less /tmp/nvm-install.sh    # to read file
bash /tmp/nvm-install.sh
```

**B. Homebrew (corporate / managed machines)**

If your machine restricts `curl | bash` installs, or you already
manage tools with Homebrew, this works too:

```bash
brew install nvm
mkdir -p "$HOME/.nvm"
```

Then add these lines to your `~/.zshrc` (or `~/.bashrc`) so nvm loads in every
shell:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix)/opt/nvm/nvm.sh" ] && . "$(brew --prefix)/opt/nvm/nvm.sh"
[ -s "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm" ] && . "$(brew --prefix)/opt/nvm/etc/bash_completion.d/nvm"
```

**After either method:** open a new terminal so nvm loads, then:

```bash
cd path/to/bugblitz-kcqdkxy4
make setup && make dev
```

`make setup` will run `nvm install` (using `.nvmrc`), install project deps,
and then `make dev` starts the dev server. If Node is missing or too old,
`make` prints a clear instruction telling you what to do.

### Make targets

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
