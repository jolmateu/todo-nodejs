const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const uri = "mongodb+srv://jolmateu:8bO7WE2zMSTrCxSZ@cluster0.3mvfv.mongodb.net/?retryWrites=true&w=majority";

const DB_NAME = 'todo';

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(express.json()); // Parse JSON requests

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to the database');
    const db = client.db(DB_NAME);
    const tasksCollection = db.collection('tasks');

    // Path to obtain tasks from MongoDB
    app.get('/tasks', async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    });

    app.post('/tasks', async (req, res) => {
      const newTask = req.body;
      await tasksCollection.insertOne(newTask);
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    });

    app.put('/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      const updatedTask = req.body;
      await tasksCollection.updateOne({ _id: taskId }, { $set: updatedTask });
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    });

    app.delete('/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      try {
        await tasksCollection.deleteOne({ _id: taskId });
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting task');
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // If there is an error, this will help prevent the Node.js application from hanging
    // It's a best practice to close the client when you are done with it
    console.log("This is finally");
  }
}

startServer().catch(console.dir);
