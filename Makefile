# One-command local dev: run `make dev` (or `make setup` once, then `make dev`).
# Requires: Docker, pnpm, Node 20+

.PHONY: up down setup dev dev-only clean from-scratch help

# Start Postgres in Docker (port 5433 = no conflict with local Postgres on 5432)
up:
	@if docker compose ps --status running 2>/dev/null | grep -q postgres; then \
		echo "Postgres container already running at localhost:5433."; \
	else \
		docker compose up -d; \
	fi
	@echo "Waiting for Postgres..."
	@until docker compose exec -T postgres pg_isready -U postgres 2>/dev/null; do sleep 1; done
	@echo "Postgres is ready at localhost:5433 (this project only). Use port 5433 in DATABASE_URL (.env)."

# Stop Docker services
down:
	docker compose down

# First-time setup: .env from .env.example (contains DATABASE_URL=localhost:5433), deps, DB migrations
setup: up
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env from .env.example (DATABASE_URL=localhost:5433) — add OPENAI_API_KEY."; fi
	@if ! grep -q 'DATABASE_URL=' .env 2>/dev/null; then grep '^DATABASE_URL=' .env.example >> .env && echo "Added DATABASE_URL from .env.example to .env"; fi
	pnpm install
	pnpm prisma generate
	pnpm prisma migrate deploy
	@echo "Setup done. DB: localhost:5433. Run 'make dev' to start the app."

# Full dev: setup once then start Next.js (idempotent; safe to run every time)
dev: setup
	@echo "Starting Next.js..."
	pnpm dev

# Start dev server only (assumes setup already run)
dev-only:
	pnpm dev

# Stop containers and remove app build artifacts. Asks whether to remove DB volume (full reset).
clean:
	@echo "Remove DB volume too? (y = full reset, all data lost; N = keep data for next run) [y/N] "; \
	read -r answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		docker compose down -v; \
		echo "Containers and DB volume removed."; \
	else \
		docker compose down; \
		echo "Containers stopped. DB data kept in volume."; \
	fi; \
	rm -rf .next node_modules

# Full reset: clean, then run dev (reinstall deps, migrations, start app)
from-scratch: clean dev

help:
	@echo "Local development (run from project root):"
	@echo "  make dev       - One command: start Docker, setup env/deps/DB, run app (recommended)"
	@echo "  make setup     - Start Docker + install deps + run migrations (run once)"
	@echo "  make dev-only  - Start Next.js only (after 'make setup')"
	@echo "  make up        - Start Postgres only (no app; use when you need just the DB)"
	@echo "  make down      - Stop Docker services"
	@echo "  make clean     - Stop Docker + rm .next/node_modules (asks: remove DB volume?)"
	@echo "  make from-scratch - clean then dev (full reset)"
	@echo "  make help      - Show this help"
