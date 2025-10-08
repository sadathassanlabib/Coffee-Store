const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bcozk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db('coffeeDb').collection('coffees');
    const userCollection = client.db('coffeeDb').collection('users');

    // COFFEES
    app.get('/coffees', async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // USERS
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const userProfile = req.body;
      const result = await userCollection.insertOne(userProfile);
      res.send(result);
    });

    console.log('MongoDB connected successfully');
  } finally {
    // Do not close client in serverless, Vercel keeps it alive
  }
}
run().catch(console.dir);

// Default route
app.get('/', (req, res) => res.send('Coffee server is running'));

// ✅ Vercel deploy এর জন্য
module.exports = app;
