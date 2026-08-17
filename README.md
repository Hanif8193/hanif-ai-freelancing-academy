# Hanif AI Freelancing Academy

**Learn. Build. Freelance with AI.**

An interactive, AI-powered freelancing education platform that teaches users freelancing from beginner to advanced level.

## Features

- **Interactive eBook** - Learn at your own pace with comprehensive content
- **AI-Powered Learning** - Leverage AI coding agents and tools
- **Spec-Driven Development** - Master professional development methodologies
- **Real-World Projects** - Build portfolio pieces and gain practical experience
- **Responsive Design** - Learn on any device
- **Dark/Light Theme** - Read comfortably in any environment

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Hanif8193/hanif-ai-freelancing-academy.git

# Navigate to the project directory
cd freelancing-academy

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run start
```

The development server will start at `http://localhost:3000`.

### Production Build

```bash
# Build for production
npm run build

# Serve the production build locally
npm run serve
```

## Project Structure

```
hanif-ai-freelancing-academy/
├── .opencode/           # OpenCode configuration
├── .specify/            # SpecKit templates and scripts
├── specs/               # Feature specifications
│   ├── m1-foundation/   # M1 specification
│   └── m2-docusaurus-foundation/  # M2 specification
├── docs/                # Documentation content
│   ├── getting-started/
│   ├── freelancing/
│   ├── ai-development/
│   ├── spec-driven-development/
│   ├── projects/
│   ├── resources/
│   └── about/
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   └── styles/          # CSS/styles
├── static/              # Static assets
├── docusaurus.config.js # Docusaurus configuration
├── sidebars.js          # Sidebar navigation
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # Vercel deployment
└── README.md            # This file
```

## Documentation Structure

- **Getting Started** - Begin your freelancing journey
- **Freelancing Fundamentals** - Master the basics of freelancing
- **AI-Powered Development** - Learn to use AI coding agents and tools
- **Spec-Driven Development** - Adopt professional development methodologies
- **Projects** - Real-world projects and portfolio building
- **Resources** - Templates, tools, and learning materials
- **About** - Learn about the academy and our mission

## Technology Stack

- **Framework**: Docusaurus 3.x
- **Language**: TypeScript
- **UI**: React 18+
- **Content**: Markdown/MDX
- **Styling**: CSS Modules
- **Deployment**: Vercel

## Available Scripts

- `npm run start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm run clear` - Clear Docusaurus cache
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

### Vercel (Recommended)

This project is configured for Vercel deployment.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Docusaurus and deploy

### Manual Deployment

```bash
# Build for production
npm run build

# The output will be in the `build` directory
# Upload this directory to your hosting provider
```

## Deployment (Vercel) — M8

The production architecture is **static Docusaurus + Vercel Functions on the same origin**:

- The Docusaurus site is built with `npm run build` into `build/` (deployed as-is).
- The AI APIs are served by Vercel Functions in the `api/` directory:
  - `POST /api/ask` — `api/ask.ts` (reuses the M4 ask handler)
  - `GET /api/ask/health` — `api/ask/health.ts` (reuses the M4 health handler; **never makes AI calls**)
  - `POST /api/tutor` — `api/tutor.ts` (reuses the M5 tutor handler)
- The frontend (`/ask-the-book`, `/tutor`) calls the same-origin `/api/…` routes, so **no frontend changes are needed**.
- The same routes are served locally by the Docusaurus dev-server middleware (`npm run start`).

### Required environment variables (Vercel project settings — never in a tracked file)

| Variable | Purpose |
|---|---|
| `EMBEDDING_PROVIDER` | `gemini` or `openai` (default `gemini`) |
| `LLM_PROVIDER` | `gemini` or `openai` (default `gemini`) |
| `GEMINI_API_KEY` | Required when a provider is `gemini` |
| `OPENAI_API_KEY` | Required when a provider is `openai` |
| `VECTOR_STORE_TYPE` | `memory` (local dev, default) or `turso` (production) |
| `TURSO_DATABASE_URL` | Turso database URL (only when `VECTOR_STORE_TYPE=turso`) |
| `TURSO_AUTH_TOKEN` | **Secret** — Turso auth token (only when `VECTOR_STORE_TYPE=turso`) |
| `TURSO_TABLE` | Chunk table name (default `hanif_academy_chunks`) |
| `VECTOR_DIMENSIONS` | Embedding dimensions (default: derived from the embedding provider — Gemini 768, OpenAI 1536) |
| `API_RATE_LIMIT_MAX` | Per-instance request cap (default `30`) |
| `API_RATE_LIMIT_WINDOW_MS` | Rate-limit window (default `60000`) |

See `.env.example` for the full list.

### Deploy

```bash
vercel            # preview deployment
vercel --prod     # production deployment
```

The Node.js runtime for the functions follows `engines.node` in `package.json` (`>=20`) or the project's Node.js Version setting in the Vercel dashboard.

### Verify after deploy

1. Static pages load: `/`, `/docs`, `/ask-the-book`, `/tutor`.
2. `GET /api/ask/health` returns `{ "status": "configured" | "initialized", ... }` (no AI call).
3. `POST /api/ask` and `POST /api/tutor` return the expected 200/400/429 shapes.

### Known limitations (M8)

- The vector store is a local JSON file (`data/vector-store.json`, gitignored) — it is **not** deployed to Vercel. M9 adds the production Turso provider (see the M9 section below); the hosted store still needs to be populated with a production ingestion once the Turso database is created and the embedding quota is available.
- Rate limiting is per serverless instance (in-memory); a hosted limiter (e.g. Upstash) is the future replacement.
- Site search (Algolia DocSearch) is disabled until real credentials exist (see below).

### Search

Site search is intentionally **disabled** (M8): the previous Algolia config used placeholder credentials (`YOUR_APP_ID` / `YOUR_ALGOLIA_API_KEY`) that would fail at runtime. To enable search later, add a real DocSearch/Algolia configuration to `themeConfig.algolia` in `docusaurus.config.ts`, or adopt a local search plugin.

### MCP (local only)

The MCP server runs over stdio for local/desktop agents: `npm run mcp` (7 tools). Remote/Streamable HTTP MCP with auth and rate limiting is a future milestone.

## Deployment (Vercel) — M9 (Production Vector Database, Turso)

M9 adds a production **Turso Cloud** vector store (native `vector32`/`vector_distance_cos` — no pgvector, no vec0 extension) behind the existing `VectorStore` interface. Local development keeps using the JSON store (`VECTOR_STORE_TYPE=memory`); production switches with `VECTOR_STORE_TYPE=turso`.

### Turso Cloud setup (human action — not automated)

1. Create a database in **Turso Cloud** (https://turso.tech) — you will do this manually. The database must support Turso's native vector functions (`vector32`, `vector_distance_cos`).
2. Run the schema migration against the database URL:

   ```bash
   EMBEDDING_PROVIDER=openai VECTOR_STORE_TYPE=turso npm run migrate:turso
   # requires VECTOR_STORE_TYPE=turso, TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
   ```

   The migration is **idempotent and non-destructive** — `CREATE TABLE IF NOT EXISTS hanif_academy_chunks` with a native `embedding BLOB` column (`vector32`), plus a safe additive `ALTER TABLE ADD COLUMN` repair if the `embedding` column is missing from an older table. Existing rows are never dropped.

3. Add the environment variables to Vercel (Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `VECTOR_STORE_TYPE` | `turso` |
   | `TURSO_DATABASE_URL` | the Turso database URL |
   | `TURSO_AUTH_TOKEN` | the Turso auth token (**secret** — never commit it) |
   | `TURSO_TABLE` | `hanif_academy_chunks` (default) |
   | `VECTOR_DIMENSIONS` | leave unset — derived from the embedding provider |

4. Populate the hosted store with a production ingestion (separate, approved run after the embedding quota is available):

   ```bash
   npm run ingest   # with VECTOR_STORE_TYPE=turso
   ```

### How it works

- `src/rag/providers/vector-store/turso.ts` — `TursoVectorStore`, all 7 `VectorStore` methods, fully parameterized SQL via the official `@libsql/client` (Node build, Vercel-function compatible). Embeddings are stored in a single `embedding BLOB` column via Turso's native `vector32()`; search uses `vector_distance_cos(embedding, vector32(?)) AS distance` with `ORDER BY distance LIMIT ?`.
- Turso returns cosine **distance** (lower is better, 0 = identical); the store converts to the existing retriever contract: `similarity = 1 - distance`, clamped to 0–1. `Retriever.retrieve()` is unchanged.
- `createVectorStore(config)` in `src/rag/providers/factory.ts` — picks `memory` / `chroma` / `turso` from `VECTOR_STORE_TYPE`. Ask the Book, Tutor, MCP, and `scripts/ingest.ts` all construct the store through it.
- The local JSON store (`data/vector-store.json`) remains the local-development default and is untouched. The earlier PostgreSQL/pgvector implementation is preserved on disk (`postgres.ts`, `migrate-pgvector.ts`) but is no longer an active configuration option.

## Operations — M10 (Production Deployment & Operational Readiness)

### SEO

- `sitemap.xml` is generated automatically by the Docusaurus preset (site URL `https://hanif-ai-freelancing-academy.vercel.app`).
- `robots.txt` is served from `static/robots.txt` (allow-all + sitemap reference).
- Open Graph / social sharing uses `static/img/hanif-ai-social-card.svg` (`themeConfig.image`). **Before launch, export a PNG version** (1200×630) for maximum social-platform support and update the config reference.
- Canonical URLs, `og:*`/`twitter:*` tags, and meta descriptions are emitted by Docusaurus from `docusaurus.config.ts` (title/tagline/url).

### CI/CD

- `.github/workflows/ci.yml` runs on every push/PR to `master`: `npm ci` → `npm test` → `npm run typecheck` → `npm run build` (Node 20). No secrets are used (all tests are mocked).
- Deploys are manual (Vercel dashboard or `vercel --prod`); auto-deploy from CI is intentionally not wired in M10.

### Analytics & Monitoring (decision required)

- **Analytics**: no analytics are configured yet. Recommended lightweight, privacy-conscious options, in order of preference:
  1. **Vercel Web Analytics** — zero-code, no tracking-consent overhead, free tier (enable in the Vercel dashboard).
  2. **Plausible** — privacy-first script; requires a small account + script tag in `docusaurus.config.ts`.
  3. Document-only (no analytics) until a decision is made.
  Owner decision required — nothing was purchased or configured in M10.
- **Uptime monitoring**: recommended free procedure — configure a free uptime check (e.g. UptimeRobot) on `GET https://hanif-ai-freelancing-academy.vercel.app/api/ask/health`. The health endpoint is a **no-AI-call** endpoint (M8), so the check is free of API-quota usage. Manual alternative: periodically `curl -i https://hanif-ai-freelancing-academy.vercel.app/api/ask/health` and expect `200`.

### Security posture (M10 review)

- No API keys or secrets in any tracked file; `.env`/`.env.local`/`data/` are gitignored; `.env.example` contains placeholders only.
- Same-origin architecture (frontend + `/api/*` on one origin) — no CORS policy needed today; revisit if the API ever moves cross-origin.
- M8 protections in production: method enforcement (405), 16 KB body cap (413), per-instance rate limiting (429 + `Retry-After`), safe error mapping (no stack traces/raw provider errors/secrets).
- Prompt-injection boundaries intact: retrieved content is wrapped in `<academy_content>` reference data; never interpreted as instructions.

### MCP production strategy

- Local/desktop MCP over **stdio** (`npm run mcp`, 7 tools) is the supported production interface for M10.
- **Streamable HTTP (remote) MCP is deferred** until authentication and production security requirements are defined — it will not be exposed publicly without them.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Development Milestones

- **M1** - Foundation & Specification (Complete)
- **M2** - Docusaurus Foundation (Complete)
- **M3** - Initial Learning Content (Complete)
- **M4** - RAG / Ask the Book (Complete)
- **M5** - Hanif AI Tutor (Complete)
- **M6** - Translator Agent (Complete)
- **M7** - MCP Integration (Complete)
- **M8** - Production Readiness (Complete)
- **M9** - Production Vector Database / Turso (Complete)
- **M10** - Production Deployment & Operational Readiness (In progress)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: [https://hanif-ai-freelancing-academy.vercel.app](https://hanif-ai-freelancing-academy.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/Hanif8193/hanif-ai-freelancing-academy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Hanif8193/hanif-ai-freelancing-academy/discussions)

## Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Designed for accessibility and performance
- Created with Spec-Driven Development methodology