# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that indexes Netflix viewing history into Elasticsearch for analysis and visualization. The project uses TypeScript with strict mode enabled and follows Clean Architecture principles.

## Development Commands

### Setup and Running
- `npm install` - Install dependencies
- `docker compose up -d` - Start Elasticsearch container (wait ~1 minute for full startup)
- `docker compose down` - Stop Elasticsearch container
- `npm run clean-data` - Parse CSV data from `data/historic_netflix.csv` and index to Elasticsearch
- `npm run dev` - Start Next.js development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Configuration

Required `.env` file in root directory:
```
ELASTIC_URL=http://localhost:9200
```

Copy from `env.example` if needed.

## Architecture

### Clean Architecture Pattern

The codebase follows Clean Architecture with clear separation of concerns:

1. **API Routes** (`app/api/`) - HTTP layer, receives requests and returns responses
2. **Use Cases** (`features/application/use-cases/`) - Business logic layer, orchestrates data flow
3. **Repositories** (`features/application/infrastructure/repositories/`) - Data access layer, interacts with Elasticsearch

Example flow:
```
app/api/history/route.ts
  → GetAllHistoryUseCase
    → NetflixRepository
      → Elasticsearch Client
```

### Key Directories

- `app/` - Next.js 16 App Router pages and API routes
- `client/` - Elasticsearch client initialization (`elastic-search-client.ts`)
- `features/application/` - Clean Architecture layers (use-cases, infrastructure/repositories)
- `scripts/` - Data processing scripts (e.g., `clean_data.ts` for CSV ingestion)
- `data/` - Contains `historic_netflix.csv` source file
- `lib/` - Shared utilities

### Elasticsearch Integration

**Client Setup**: Singleton Elasticsearch client in `client/elastic-search-client.ts` using `@elastic/elasticsearch` package.

**Index Name**: `historic_netflix`

**Document Schema**:
```typescript
{
  title: string;        // Movie/show title
  date: string;         // ISO 8601 timestamp
  duration: number;     // Duration in seconds
  deviceType: string;   // e.g., "TV", "Mobile"
  country: string;      // e.g., "FR (France)"
  type: string;         // "Movie" or "TV Show" (inferred from title)
}
```

**Type Detection Logic**: TV shows are identified by keywords in title: "Season", "Saison", "Episode", "Épisode", "Mini-série", "Limited Series", "Partie". Everything else is classified as "Movie".

**Data Filtering**: The ingestion script filters out autoplayed items where `Attributes` contains "Autoplayed: user action: None;".

## API Endpoints

### `GET /api/history`
Returns all viewing history (limited to 30 items by default). Uses `match_all` query.

### `GET /api/history/[type]`
Returns viewing history filtered by type ("Movie" or "TV Show"). Uses `term` query on `type.keyword` field.

Both endpoints follow the same Clean Architecture pattern and return arrays of `NetflixHistoryItem` objects.

## TypeScript Configuration

- Strict mode enabled with additional safety options: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Path alias: `@/*` maps to project root
- Module system: ESNext with `"type": "module"` in package.json
- Targets ESNext for modern JavaScript features

## Docker Setup

Single-node Elasticsearch 8.15.0 container with security disabled for local development:
- Port: 9200
- Volume: `esdata` for persistent storage
- Memory: 512MB min/max heap size
- Security features (SSL, authentication) disabled

## Additional Documentation

- `API_DOCUMENTATION.md` - Detailed API endpoint documentation with curl examples
- `ELASTICSEARCH_QUERIES.md` - Guide for querying Elasticsearch with match, term, range, bool, and aggregation examples
- `README.md` - Setup and installation instructions
