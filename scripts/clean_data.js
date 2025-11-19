const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Path to the Netflix history CSV file
const csvFilePath = path.join(__dirname, '../data/historic_netflix.csv');

const results = [];

// Create a read stream for the CSV file and pipe it through csv-parser
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data)) // Collect each row of data
  .on('end', () => {
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

    // Output the cleaned data as JSON to the console
    console.log(JSON.stringify(cleanedData, null, 2));
  });

