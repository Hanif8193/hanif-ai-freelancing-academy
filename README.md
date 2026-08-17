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
git clone https://github.com/hanif-ai/freelancing-academy.git

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
| `VECTOR_STORE_TYPE` | `memory` (local dev, default) or `postgres` (production) |
| `POSTGRES_URL` | **Secret** — Supabase/Postgres connection string (only when `VECTOR_STORE_TYPE=postgres`) |
| `PGVECTOR_TABLE` | pgvector table name (default `hanif_academy_chunks`) |
| `PGVECTOR_DIMENSIONS` | Embedding dimensions (default: derived from the embedding provider — Gemini 768, OpenAI 1536) |
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

- The vector store is a local JSON file (`data/vector-store.json`, gitignored) — it is **not** deployed to Vercel. M9 adds the production pgvector provider (see the M9 section below); the hosted store still needs to be populated with a production ingestion once Supabase is set up and the embedding quota is available.
- Rate limiting is per serverless instance (in-memory); a hosted limiter (e.g. Upstash) is the future replacement.
- Site search (Algolia DocSearch) is disabled until real credentials exist (see below).

### Search

Site search is intentionally **disabled** (M8): the previous Algolia config used placeholder credentials (`YOUR_APP_ID` / `YOUR_ALGOLIA_API_KEY`) that would fail at runtime. To enable search later, add a real DocSearch/Algolia configuration to `themeConfig.algolia` in `docusaurus.config.ts`, or adopt a local search plugin.

### MCP (local only)

The MCP server runs over stdio for local/desktop agents: `npm run mcp` (7 tools). Remote/Streamable HTTP MCP with auth and rate limiting is a future milestone.

## Deployment (Vercel) — M9 (Production Vector Database)

M9 adds a production **PostgreSQL + pgvector** vector store behind the existing `VectorStore` interface. Local development keeps using the JSON store (`VECTOR_STORE_TYPE=memory`); production switches with `VECTOR_STORE_TYPE=postgres`.

### Supabase setup (human action — not automated)

1. Create a Supabase project (free tier is sufficient).
2. Run the schema migration against the project's connection string:

   ```bash
   npm run migrate:pgvector
   # requires VECTOR_STORE_TYPE=postgres and POSTGRES_URL in .env
   ```

   The migration is **idempotent** — it creates the `vector` extension, the `hanif_academy_chunks` table, and the HNSW cosine index. It never drops data.

3. Add the environment variables to Vercel (Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `VECTOR_STORE_TYPE` | `postgres` |
   | `POSTGRES_URL` | the Supabase connection string (**secret** — never commit it) |
   | `PGVECTOR_TABLE` | `hanif_academy_chunks` (default) |
   | `PGVECTOR_DIMENSIONS` | leave unset — derived from the embedding provider |

4. Populate the hosted store with a production ingestion (separate, approved run after the embedding quota is available):

   ```bash
   npm run ingest   # with VECTOR_STORE_TYPE=postgres
   ```

### How it works

- `src/rag/providers/vector-store/postgres.ts` — all 7 `VectorStore` methods via parameterized SQL; cosine similarity mapped as `1 - (embedding <=> $query)`.
- `createVectorStore(config)` in `src/rag/providers/factory.ts` — picks `memory` / `chroma` / `postgres` from `VECTOR_STORE_TYPE`. Ask the Book, Tutor, MCP, and `scripts/ingest.ts` all construct the store through it.
- The local JSON store (`data/vector-store.json`) remains the local-development default and is untouched.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Development Milestones

- **M1** - Foundation & Specification (Complete)
- **M2** - Docusaurus Foundation (Current)
- **M3** - Initial Learning Content (Upcoming)
- **M4+** - AI Features (RAG, Tutor, Translation, MCP)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: [https://hanif-ai-freelancing-academy.vercel.app](https://hanif-ai-freelancing-academy.vercel.app)
- **Issues**: [GitHub Issues](https://github.com/hanif-ai/freelancing-academy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hanif-ai/freelancing-academy/discussions)

## Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Designed for accessibility and performance
- Created with Spec-Driven Development methodology