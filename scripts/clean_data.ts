import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { client } from '../client/elastic-search-client';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Netflix history CSV file
const csvFilePath = path.join(__dirname, '../data/historic_netflix.csv');

interface NetflixHistoryItem {
  Title: string;
  'Start Time': string;
  Duration: string;
  Attributes: string;
  'Device Type': string;
  Country: string;
}

interface CleanedNetflixData {
  title: string;
  date: string;
  duration: number;
  deviceType: string;
  country: string;
  type: string;
}

const results: NetflixHistoryItem[] = [];

// Create a read stream for the CSV file and pipe it through csv-parser
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data: NetflixHistoryItem) => results.push(data)) // Collect each row of data
  .on('end', async () => {
    // Process the collected data
    const cleanedData: CleanedNetflixData[] = results
      .filter((item) => {
        // Filter out autoplayed items (where user didn't take action)
        if (item['Attributes'] && item['Attributes'].includes('Autoplayed: user action: None;')) {
          return false;
        }
        return true;
      })
      .map((item) => {
        // Convert Duration string (HH:MM:SS) to total seconds
        const durationParts = item['Duration'].split(':');
        let durationSeconds = 0;
        if (durationParts.length === 3) {
          const hours = durationParts[0] ?? '0';
          const minutes = durationParts[1] ?? '0';
          const seconds = durationParts[2] ?? '0';
          durationSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
        }

        // Convert Start Time to ISO 8601 date string
        const startTime = new Date(item['Start Time']).toISOString();

        // Infer type from Title
        const title = item['Title'];
        let type = 'Movie';
        const tvShowKeywords = [
          'Season',
          'Saison',
          'Episode',
          'Épisode',
          'Mini-série',
          'Limited Series',
          'Partie',
        ];
        if (tvShowKeywords.some((keyword) => title.includes(keyword))) {
          type = 'TV Show';
        }

        // Return the cleaned and transformed object
        return {
          title: item['Title'],
          date: startTime,
          duration: durationSeconds,
          deviceType: item['Device Type'],
          country: item['Country'],
          type: type,
        };
      });

    console.log(`Parsed ${cleanedData.length} records. Indexing to Elasticsearch...`);

    const indexName = 'historic_netflix';

    try {
      // Prepare bulk body
      const body = cleanedData.flatMap((doc) => [{ index: { _index: indexName } }, doc]);

      // Execute bulk index
      const { errors, items } = await client.bulk({ body });

      if (errors) {
        const erroredDocuments = items.filter((item) => item.index && item.index.error);
        console.log('Errors occurred during bulk indexing:', erroredDocuments);
      } else {
        console.log(`Successfully indexed ${items.length} documents.`);
      }
    } catch (error: any) {
      console.error('Elasticsearch error:', error);
      if (error.meta && error.meta.body) {
        console.error('Error body:', JSON.stringify(error.meta.body, null, 2));
      }
    }
  });
