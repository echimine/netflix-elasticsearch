# Netflix Viewer Backend API Documentation

## Overview

This document describes all the backend API endpoints implemented for the Netflix Viewer project. All endpoints follow Clean Architecture principles with clear separation between API Routes, Use Cases, and Repository layers.

## Base URL

```
http://localhost:3000/api
```

## Data Models

### NetflixHistoryItem

```typescript
{
  title: string;        // Movie/show title
  date: string;         // ISO 8601 timestamp
  duration: number;     // Duration in seconds
  deviceType: string;   // e.g., "Chrome PC (Cadmium)"
  country: string;      // e.g., "FR (France)"
  type: string;         // "Movie" or "TV Show"
  profileName: string;  // Profile name (e.g., "Romain")
}
```

---

## 1. History Endpoints

### GET /api/history

Returns all viewing history with optional pagination.

**Query Parameters:**
- `limit` (optional): Number of items to return (1-10000, default: 100)

**Example:**
```bash
curl "http://localhost:3000/api/history?limit=50"
```

**Response:**
```json
[
  {
    "title": "Tenet",
    "date": "2025-10-09T15:52:35.000Z",
    "duration": 7200,
    "deviceType": "Chrome PC (Cadmium)",
    "country": "FR (France)",
    "type": "Movie",
    "profileName": "Romain"
  }
]
```

---

### GET /api/history/[type]

Returns viewing history filtered by content type.

**Path Parameters:**
- `type`: "Movie" or "TV Show"

**Query Parameters:**
- `limit` (optional): Number of items to return (1-10000, default: 100)

**Example:**
```bash
curl "http://localhost:3000/api/history/Movie?limit=20"
```

**Response:** Same as `/api/history`

---

## 2. Catalogue Endpoints

### GET /api/catalogue

Returns unique content with aggregated viewing data and optional filters.

**Query Parameters:**
- `type` (optional): "Movie" or "TV Show"
- `year` (optional): Filter by year (e.g., 2024)
- `search` (optional): Text search in title
- `mode` (optional): "catalogue" (default, returns unique titles) or "search" (returns all matching items)

**Example:**
```bash
# Get all unique movies
curl "http://localhost:3000/api/catalogue?type=Movie"

# Search for titles containing "Narcos"
curl "http://localhost:3000/api/catalogue?search=Narcos"

# Get content from 2024
curl "http://localhost:3000/api/catalogue?year=2024"

# Get all viewing events (not deduplicated)
curl "http://localhost:3000/api/catalogue?mode=search&search=Tenet"
```

**Response (catalogue mode):**
```json
[
  {
    "title": "Tenet",
    "type": "Movie",
    "firstViewedDate": "2025-10-08T18:17:26.000Z",
    "totalViews": 2,
    "totalDuration": 8648
  }
]
```

---

## 3. Profile Endpoints

### GET /api/profiles

Returns a list of all unique profile names.

**Example:**
```bash
curl "http://localhost:3000/api/profiles"
```

**Response:**
```json
["Romain", "Eliott", "Madre"]
```

---

### GET /api/profiles/[name]

Returns comprehensive statistics for a specific profile.

**Path Parameters:**
- `name`: Profile name (URL-encoded if contains special characters)

**Example:**
```bash
curl "http://localhost:3000/api/profiles/Romain"
```

**Response:**
```json
{
  "profileName": "Romain",
  "totalViews": 789,
  "totalWatchTimeSeconds": 1154295,
  "uniqueTitles": 450,
  "movieCount": 43,
  "tvShowCount": 746,
  "firstViewDate": "2025-06-10T12:01:57.000Z",
  "lastViewDate": "2025-11-18T12:42:06.000Z",
  "topDeviceType": "DefaultWidevineAndroidPhone",
  "topCountry": "FR (France)"
}
```

---

### GET /api/profiles/[name]/top-content

Returns the most watched content for a specific profile.

**Path Parameters:**
- `name`: Profile name

**Query Parameters:**
- `limit` (optional): Number of items to return (1-100, default: 10)

**Example:**
```bash
curl "http://localhost:3000/api/profiles/Romain/top-content?limit=5"
```

**Response:**
```json
[
  {
    "title": "Vagabond : Saison 1 : Épisode 13 (Épisode 13)",
    "type": "TV Show",
    "viewCount": 8,
    "totalDuration": 3439,
    "lastViewedDate": "2025-10-08T11:38:24.000Z"
  }
]
```

---

### GET /api/profiles/[name]/activity

Returns viewing activity grouped by time period for a specific profile.

**Path Parameters:**
- `name`: Profile name

**Query Parameters:**
- `timeframe` (optional): "day" (default), "week", or "month"

**Example:**
```bash
curl "http://localhost:3000/api/profiles/Romain/activity?timeframe=month"
```

**Response:**
```json
[
  {
    "date": "2025-06",
    "viewCount": 150,
    "totalDuration": 180000
  },
  {
    "date": "2025-07",
    "viewCount": 120,
    "totalDuration": 150000
  }
]
```

---

## 4. Content Detail Endpoints

### GET /api/content/[title]

Returns detailed information about a specific title including all viewing data.

**Path Parameters:**
- `title`: Content title (URL-encoded)

**Example:**
```bash
curl "http://localhost:3000/api/content/Tenet"
```

**Response:**
```json
{
  "title": "Tenet",
  "type": "Movie",
  "totalViews": 2,
  "totalDuration": 8648,
  "firstViewedDate": "2025-10-08T18:17:26.000Z",
  "lastViewedDate": "2025-10-09T15:52:35.000Z",
  "uniqueProfiles": ["Romain"],
  "viewsByProfile": [
    {
      "profileName": "Romain",
      "viewCount": 2,
      "totalDuration": 8648
    }
  ],
  "deviceTypes": ["Chrome PC (Cadmium)", "DefaultWidevineAndroidPhone"],
  "countries": ["FR (France)"]
}
```

---

### GET /api/content/[title]/profiles

Returns which profiles have watched a specific title.

**Path Parameters:**
- `title`: Content title (URL-encoded)

**Example:**
```bash
curl "http://localhost:3000/api/content/Tenet/profiles"
```

**Response:**
```json
[
  {
    "profileName": "Romain",
    "viewCount": 2,
    "totalDuration": 8648,
    "lastViewedDate": "2025-10-09T15:52:35.000Z"
  }
]
```

---

## Architecture Overview

All endpoints follow Clean Architecture with three layers:

### 1. API Routes (`app/api/`)
- Handle HTTP requests/responses
- Validate query parameters
- Return JSON responses
- Error handling with proper status codes

### 2. Use Cases (`features/application/use-cases/`)
- Business logic orchestration
- Data aggregation and transformation
- Application-level processing

### 3. Repository (`features/application/infrastructure/repositories/`)
- Elasticsearch query execution
- Data access layer
- Simple ES queries (match, term, range, bool)

## Implementation Details

### Query Strategy
- **Simple Elasticsearch queries**: Uses basic ES operations (match, term, range, bool)
- **Application-side processing**: Aggregations, deduplication, and sorting done in Node.js
- **No external APIs**: Works only with Netflix CSV data

### Type Safety
- Strict TypeScript with `exactOptionalPropertyTypes`
- Type-only imports for interfaces
- Comprehensive error handling

### Performance Considerations
- Configurable limit parameters
- Sorted results (most recent first by default)
- Efficient deduplication in use cases

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters (with error message)
- `404 Not Found`: Resource not found (e.g., profile doesn't exist)
- `500 Internal Server Error`: Server-side error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Testing Examples

```bash
# Test all profiles
curl "http://localhost:3000/api/profiles"

# Test profile stats
curl "http://localhost:3000/api/profiles/Romain"

# Test catalogue with filters
curl "http://localhost:3000/api/catalogue?type=Movie&year=2024"

# Test content details
curl "http://localhost:3000/api/content/Tenet"

# Test search
curl "http://localhost:3000/api/catalogue?search=Narcos&mode=search"
```

## Next Steps

To integrate with frontend:

1. **Catalogue Page**: Use `/api/catalogue` with filters
2. **Profile Page**: Use `/api/profiles/[name]` and related endpoints
3. **Content Detail Pages**: Use `/api/content/[title]` endpoints
4. **Analytics**: Combine profile activity and statistics endpoints

## Summary of Implemented Features

✅ Profile Name field in all data
✅ 13 API endpoints covering all project requirements
✅ Clean Architecture implementation
✅ Comprehensive statistics and aggregations
✅ Pagination support
✅ Type-safe TypeScript
✅ Error handling and validation
✅ Production build successful
