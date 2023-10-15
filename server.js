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

    // Ruta para obtener las tareas desde la base de datos
    app.get('/tasks', async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // If there is an error, this will help prevent the Node.js application from hanging
    // It's a best practice to close the client when you are done with it
    console.log("Este es el finally");
  }
}

startServer().catch(console.dir);
