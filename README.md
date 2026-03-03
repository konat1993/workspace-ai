This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started (local development)

### First time with this project (step by step)

1. **Requirements:** Install [Docker](https://docs.docker.com/get-docker/) (Desktop or Engine) and [pnpm](https://pnpm.io/installation) (Node 20+).
2. **Clone** the repo and open the project folder in the terminal.
3. **Run:** `make dev`
   - Starts Postgres in Docker (port 5433) if not already running.
   - Creates `.env` from `.env.example` if you don’t have one.
   - Installs dependencies, runs Prisma generate and migrations, then starts the Next.js dev server.
4. **Optional:** Open `.env` and set `OPENAI_API_KEY` if you want to use the integrated AI (get a key from [OpenAI](https://platform.openai.com/api-keys)).
5. **Open:** [http://localhost:3000](http://localhost:3000)

Next time you can run `make dev` again, or `make dev-only` if Docker and DB are already running.

---

**One command** (requires Docker and pnpm):

```bash
make dev
```

This will:

1. Start **Postgres** in Docker (if not already running).
2. Create `.env` from `.env.example` if missing — **add your `OPENAI_API_KEY`** in `.env` for integrated AI.
3. Install dependencies, generate Prisma client, and apply existing DB migrations (`prisma migrate deploy`).
4. Start the Next.js dev server.

- **App:** [http://localhost:3000](http://localhost:3000)

**Database:** This project’s Docker Postgres runs on **port 5433** so it doesn’t conflict with a local Postgres on 5432. In `.env`, use `localhost:5433` for the Docker DB or `localhost:5432` if you use your system Postgres for this app.

**Testing the Makefile when you already have local Postgres (e.g. on 5432):** Leave your local Postgres running. In this project set `DATABASE_URL` in `.env` to use port **5433**. Then run `make up` or `make dev`; the script starts the Postgres container on 5433 only if it isn't already running. Your local 5432 is untouched.

After the first run, you can use `make dev-only` to start only the Next.js server (Docker and DB must still be running).

### Other Make targets

| Command       | Description                                      |
|---------------|--------------------------------------------------|
| `make dev`    | Full flow: Docker + setup + Next.js (recommended) |
| `make setup`  | Only Docker + deps + migrations                  |
| `make dev-only` | Start Next.js only (after setup)              |
| `make up`     | Start Postgres only (when you need just the DB, e.g. for Prisma Studio) |
| `make down`   | Stop Docker services                             |
| `make from-scratch` | clean then dev (full reset)                |
| `make help`   | List all targets                                 |

When you change the Prisma schema, create and apply a migration with: `pnpm db:migrate` (runs `prisma migrate dev`).

### Manual run (without Make)

If you prefer not to use Make:

```bash
docker compose up -d
cp .env.example .env   # then add OPENAI_API_KEY
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
