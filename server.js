const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 5000;

// Step 1: Fetch data from API and save as CSV
async function fetchAndSaveCSV() {
  try {
    const response = await axios.get(
      'https://api.data.gov.in/resource/90f47d8e-946d-44cb-ae03-5101ccd586de',
      {
        params: {
          'api-key': '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b',
          format: 'json',
        },
        headers: {
          accept: 'application/json',
        },
      }
    );

    const records = response.data.records;

    if (records && records.length > 0) {
      const json2csv = new Parser();
      const csvData = json2csv.parse(records);

      fs.writeFileSync('data.csv', csvData);
      console.log('✅ data.csv file written successfully');
    } else {
      console.log('⚠️ No records found from API');
    }
  } catch (err) {
    console.error('❌ Failed to fetch or save CSV:', err.message);
  }
}

// Step 2: Endpoint to serve CSV data as JSON
app.get('/api/data', (req, res) => {
  const results = [];

  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error reading CSV file');
    });
});

// Step 3: Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await fetchAndSaveCSV(); // Download CSV when server starts
});
