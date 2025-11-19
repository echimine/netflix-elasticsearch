# Netflix Elasticsearch Project

This project indexes Netflix viewing history into Elasticsearch for analysis and visualization.

## Prerequisites

- **Node.js** (v18 or later)
- **Docker** & **Docker Compose**

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd netflix-elasticsearch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory. You can copy the example:

   ```bash
   cp env.example .env
   ```

2. Ensure your `.env` contains the following for local development:
   ```env
   ELASTIC_URL=http://localhost:9200
   ```

## Running the Project

### 1. Start Elasticsearch

Start the database container using Docker:

```bash
docker compose up -d
```

- **Elasticsearch** will be available at `http://localhost:9200`

> **Note:** Wait a minute for the container to fully start. You can check status with `docker ps`.

### 2. Ingest Data

Run the cleaning and ingestion script to parse `data/historic_netflix.csv` and send it to Elasticsearch:

```bash
npm run clean-data
```

If successful, you should see:
`Successfully indexed X documents.`

### 3. Start the Web App

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Stopping the Project

To stop and remove the Docker container:

```bash
docker compose down
```

## Documentation

- [Guide des Requêtes Elasticsearch](ELASTICSEARCH_QUERIES.md)
- [Documentation API](API_DOCUMENTATION.md)

## Troubleshooting

- **Connection Error**: Ensure Docker is running and you waited enough time for Elasticsearch to start.
