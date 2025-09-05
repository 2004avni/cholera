const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT; // Use only the port provided by Render

app.get('/api/data', (req, res) => {
  const results = [];
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
      res.status(500).send('Error reading CSV file');
    });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
