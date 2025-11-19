import { Client } from "@elastic/elasticsearch";

// Initialize Elasticsearch client with environment variables
export const client = new Client({
  node: process.env.ELASTIC_URL || 'http://localhost:9200',
});