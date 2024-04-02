const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'webtech_project';
const collectionName = 'adoption_form'; // Name of the collection to store form data

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Route handler for root endpoint
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    // Route to handle form submission
    app.post('/adoption', (req, res) => {
      const formData = req.body;

      // Insert form data into MongoDB
      collection.insertOne(formData)
        .then(result => {
          console.log('Form data inserted');
          res.send('Form submitted successfully');
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Internal server error');
        });
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
