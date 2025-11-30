# Netflix Viewing History Dashboard

This project is a web application that allows you to visualize and analyze your Netflix viewing history. It uses **Elasticsearch** to store and index data, and **Next.js** for the user interface.

## 📂 Project Structure

The project is organized as follows:

- **`app/`**: Contains the pages and routing of the Next.js application (App Router).
- **`components/`**: Reusable UI components (buttons, cards, charts, etc.).
- **`features/`**: Project-related features, functioning with a repository containing methods to communicate with Elasticsearch while using use cases (a form of clean architecture).
- **`lib/`**: Utilities and configurations (Elasticsearch client, date formatting).
- **`scripts/`**: Scripts for data management.
  - `clean_data.ts`: Main ingestion script that reads the CSV, cleans the data, and sends it to Elasticsearch.
- **`data/`**: Folder intended to contain your Netflix export file (`historic_netflix.csv`).
- **`docker-compose.yml`**: Docker configuration to launch a local Elasticsearch instance.

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (for Elasticsearch)

### 1. Install Dependencies

Install the necessary NPM packages:

```bash
npm install
```

### 2. Data Preparation

1. Download your viewing history from your Netflix account (CSV Format).
2. Rename the file to `historic_netflix.csv`.
3. Place it in the `data/` folder at the root of the project.

### 3. Launch Elasticsearch

Start the Elasticsearch container via Docker:

```bash
docker-compose up -d
```

_This will launch an Elasticsearch instance accessible at `http://localhost:9200`._

### 4. Launch the Application

Run the development script. This command will first execute the ingestion script (`clean-data`) to populate Elasticsearch, then start the web server.

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 📊 Data Model and Technical Choices

### Data Model

Raw data from the Netflix CSV is transformed to be more usable in Elasticsearch. Here is the indexed model:

- **`title`** (_String_): Title of the movie or series.
- **`date`** (_Date_): Date and time the viewing started (ISO 8601).
- **`duration`** (_Number_): Viewing duration in seconds (converted from "HH:MM:SS").
- **`deviceType`** (_String_): Device used.
- **`country`** (_String_): Country of connection.
- **`type`** (_String_): 'Movie' or 'TV Show'.
  - _Note: This field is inferred from the title. If the title contains keywords like "Season", "Episode", "Chapter", etc., it is classified as "TV Show", otherwise "Movie"._
- **`profileName`** (_String_): Name of the associated Netflix profile.

### Technical Choices

- **Elasticsearch**: Chosen for its aggregation speed and full-text search capabilities, ideal for filtering and analyzing large volumes of history.
- **Next.js (App Router)**: For high-performance server-side rendering and a modern project structure.
- **Tailwind CSS & Radix UI**: For a clean, accessible, and fast-to-develop user interface.
- **Recharts**: For data visualization (charts).

---

## 📝 Retrospective

### What Worked Well

- **Elasticsearch Performance**: Indexing and searching are extremely fast, even with a substantial history. Aggregations allow generating statistics (total time, top content) in real-time.
- **Ingestion Pipeline**: The `clean_data.ts` script is robust. Using streams allows processing the file line by line without overloading memory.
- **User Interface**: Using modular components allowed for quickly building interactive dashboards.

### Challenges Encountered

- **Netflix Data Quality**: The CSV exported by Netflix is sometimes inconsistent. It was necessary to handle "Autoplay" cases (automatic viewings of a few seconds) to avoid skewing statistics.
- **Type Inference (Movie vs Series)**: Netflix does not explicitly provide the content type in the CSV export. Inference based on the title is a heuristic solution that works 95% of the time but may fail on ambiguous titles.
- **TypeScript/ESM Configuration**: Making ES modules (for the Next.js project) and Node.js scripts (for ingestion) coexist required precise configuration of `tsconfig.json` and `package.json`.

### What I Would Do Differently

- **Data Enrichment**: Connect a third-party API (like TMDB) during ingestion to retrieve real metadata (genre, poster, cast) instead of relying solely on the raw CSV.
- **Elasticsearch Error Handling**: Improve the resilience of the ingestion script in case of temporary connection failure to Elasticsearch (retry mechanism).
- **Authentication**: Add a real authentication layer to secure access to data if the application were to be deployed publicly.
