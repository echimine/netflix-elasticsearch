require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Client } = require('@elastic/elasticsearch');

// Initialize Elasticsearch client with environment variables
const client = new Client({
  node: process.env.ELASTIC_URL || 'http://localhost:9200',
});

// Path to the Netflix history CSV file
const csvFilePath = path.join(__dirname, '../data/historic_netflix.csv');

const results = [];

// Create a read stream for the CSV file and pipe it through csv-parser
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data)) // Collect each row of data
  .on('end', async () => {
    // Process the collected data
    const cleanedData = results
      .filter(item => {
        // Filter out autoplayed items (where user didn't take action)
        if (item['Attributes'] && item['Attributes'].includes('Autoplayed: user action: None;')) {
            return false;
        }
        return true;
      })
      .map(item => {
        // Convert Duration string (HH:MM:SS) to total seconds
        const durationParts = item['Duration'].split(':');
        let durationSeconds = 0;
        if (durationParts.length === 3) {
          durationSeconds = 
            parseInt(durationParts[0]) * 3600 + 
            parseInt(durationParts[1]) * 60 + 
            parseInt(durationParts[2]);
        }

        // Convert Start Time to ISO 8601 date string
        const startTime = new Date(item['Start Time']).toISOString();

        // Return the cleaned and transformed object
        return {
          title: item['Title'],
          date: startTime,
          duration: durationSeconds,
          deviceType: item['Device Type'],
          country: item['Country'],
        };
      });

    console.log(`Parsed ${cleanedData.length} records. Indexing to Elasticsearch...`);

    const indexName = 'historic_netflix';
    
    try {
        // Prepare bulk body
        const body = cleanedData.flatMap(doc => [
            { index: { _index: indexName } },
            doc
        ]);

        // Execute bulk index
        const { errors, items } = await client.bulk({ body });

        if (errors) {
            const erroredDocuments = items.filter((item) => item.index && item.index.error);
            console.log('Errors occurred during bulk indexing:', erroredDocuments);
        } else {
            console.log(`Successfully indexed ${items.length} documents.`);
        }
    } catch (error) {
        console.error('Elasticsearch error:', error);
        if (error.meta && error.meta.body) {
            console.error('Error body:', JSON.stringify(error.meta.body, null, 2));
        }
    }
  });
