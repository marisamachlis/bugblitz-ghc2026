# One-command local setup for Leafy Co.
#
#   make            → show this help
#   make setup      → first-time: verify Node ≥ 22, install deps
#   make dev        → start dev server on http://localhost:4200
#   make build      → production build
#   make clean      → wipe node_modules and package-lock.json
#
# The dev/build/setup targets automatically use an nvm-installed Node
# (matched to .nvmrc) when available, so you don't have to `nvm use`.

SHELL := /bin/bash
.DEFAULT_GOAL := help

NODE_MAJOR := 22
NVM_DIR    ?= $(HOME)/.nvm

# Newest nvm-installed Node vNODE_MAJOR.*, if any. Preferring the binary
# directory over sourcing nvm.sh dodges every shell-compat quirk (e.g.
# NVM_CD_FLAGS=-q leaking from a zsh parent into bash).
NVM_NODE_BIN := $(shell ls -1d $(NVM_DIR)/versions/node/v$(NODE_MAJOR).*/bin 2>/dev/null | sort -Vr | head -1)

# Bash snippet prefixed to install/dev/build recipes: prepends the
# nvm-installed node/bin to PATH when we found one, so `node` and `npm`
# resolve to the right version without touching nvm.sh.
define WITH_NODE
	if [ -n "$(NVM_NODE_BIN)" ]; then export PATH="$(NVM_NODE_BIN):$$PATH"; fi;
endef

.PHONY: help setup check-node install dev build clean

help:
	@echo "Leafy Co. — local dev"
	@echo ""
	@echo "  make setup   First-time setup: verify Node, install deps"
	@echo "  make dev     Start dev server → http://localhost:4200"
	@echo "  make build   Production build"
	@echo "  make clean   Remove node_modules and package-lock.json"
	@echo ""
	@echo "New machine? See README.md → 'Run locally'."

# Ensure we have a usable Node ≥ NODE_MAJOR. Resolution order:
#   1. nvm-installed vNODE_MAJOR.* under $(NVM_DIR) → use it directly.
#   2. nvm is installed but no matching Node → source nvm.sh (with a
#      clean env) and run `nvm install` from .nvmrc.
#   3. `node` already in PATH and new enough → accept it.
#   4. Otherwise print how to install nvm.
check-node:
	@if [ -n "$(NVM_NODE_BIN)" ] && [ -x "$(NVM_NODE_BIN)/node" ]; then \
		echo "✓ Using $(NVM_NODE_BIN)/node ($$($(NVM_NODE_BIN)/node -v))"; \
		exit 0; \
	fi; \
	if [ -s "$(NVM_DIR)/nvm.sh" ]; then \
		echo "→ nvm detected; installing Node from .nvmrc"; \
		unset NVM_CD_FLAGS NVM_BIN NVM_INC; \
		if ! . "$(NVM_DIR)/nvm.sh" >/dev/null 2>&1; then \
			echo "✗ Could not source $(NVM_DIR)/nvm.sh under bash."; \
			echo "  Run this once in your shell, then re-run 'make setup':"; \
			echo "    nvm install $(NODE_MAJOR)"; \
			exit 1; \
		fi; \
		nvm install >/dev/null && nvm use; \
		exit 0; \
	fi; \
	v=$$(node -v 2>/dev/null || echo none); \
	if [ "$$v" = "none" ]; then \
		echo "✗ Node is not installed."; \
		echo ""; \
		echo "Install nvm, then re-run 'make setup'. Pick one:"; \
		echo ""; \
		echo "  A) curl (upstream, recommended for personal machines):"; \
		echo "       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"; \
		echo ""; \
		echo "  B) Homebrew (better for corporate/managed machines):"; \
		echo "       brew install nvm && mkdir -p \$$HOME/.nvm"; \
		echo "       # then add to your ~/.zshrc:"; \
		echo "       #   export NVM_DIR=\"\$$HOME/.nvm\""; \
		echo "       #   [ -s \"\$$(brew --prefix)/opt/nvm/nvm.sh\" ] && . \"\$$(brew --prefix)/opt/nvm/nvm.sh\""; \
		echo ""; \
		echo "  Then open a NEW terminal and: cd $$(pwd) && make setup"; \
		echo "  See README.md for full details."; \
		exit 1; \
	fi; \
	major=$$(echo $$v | sed 's/^v//' | cut -d. -f1); \
	if [ "$$major" -lt "$(NODE_MAJOR)" ]; then \
		echo "✗ Node $$v is too old. Need Node ≥ $(NODE_MAJOR)."; \
		echo ""; \
		echo "Easiest fix — install nvm and it will read .nvmrc. Pick one:"; \
		echo ""; \
		echo "  A) curl (upstream, recommended for personal machines):"; \
		echo "       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"; \
		echo ""; \
		echo "  B) Homebrew (better for corporate/managed machines):"; \
		echo "       brew install nvm && mkdir -p \$$HOME/.nvm"; \
		echo "       # then add to your ~/.zshrc:"; \
		echo "       #   export NVM_DIR=\"\$$HOME/.nvm\""; \
		echo "       #   [ -s \"\$$(brew --prefix)/opt/nvm/nvm.sh\" ] && . \"\$$(brew --prefix)/opt/nvm/nvm.sh\""; \
		echo ""; \
		echo "  Then open a NEW terminal and: cd $$(pwd) && make setup"; \
		echo "  See README.md for full details."; \
		exit 1; \
	fi; \
	echo "✓ Node $$v"

install: check-node
	@$(WITH_NODE) npm install

setup: install
	@echo ""
	@echo "✓ Setup complete."
	@echo "  Run 'make dev' to start the app at http://localhost:4200"

dev: check-node
	@$(WITH_NODE) npm start

build: check-node
	@$(WITH_NODE) npm run build

clean:
	rm -rf node_modules package-lock.json
	@echo "✓ Cleaned. Run 'make setup' to reinstall."
