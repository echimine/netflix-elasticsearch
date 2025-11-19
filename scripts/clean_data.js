const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });
const csvFilePath = path.join(__dirname, '../data/historic_netflix.csv');

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    const cleanedData = results
      .filter(item => {
        if (item['Attributes'] && item['Attributes'].includes('Autoplayed: user action: None;')) {
            return false;
        }
        return true;
      })
      .map(item => {
        const durationParts = item['Duration'].split(':');
        let durationSeconds = 0;
        if (durationParts.length === 3) {
          durationSeconds = 
            parseInt(durationParts[0]) * 3600 + 
            parseInt(durationParts[1]) * 60 + 
            parseInt(durationParts[2]);
        }

        const startTime = new Date(item['Start Time']).toISOString();

        return {
          title: item['Title'],
          date: startTime,
          duration: durationSeconds,
          deviceType: item['Device Type'],
          country: item['Country'],
        };
      });

    console.log(`Parsed ${cleanedData.length} records. Indexing to Elasticsearch...`);

    const indexName = 'netflix_history';
    
    try {
        // Optional: Check if index exists, create if not (bulk does this automatically usually, but explicit is nice)
        // For simplicity, we'll just bulk index.
        
        const body = cleanedData.flatMap(doc => [
            { index: { _index: indexName } },
            doc
        ]);

        const { errors, items } = await client.bulk({ body });

        if (errors) {
            const erroredDocuments = items.filter((item) => item.index && item.index.error);
            console.log('Errors occurred during bulk indexing:', erroredDocuments);
        } else {
            console.log(`Successfully indexed ${items.length} documents.`);
        }
    } catch (error) {
        console.error('Elasticsearch error:', error);
    }
  });

