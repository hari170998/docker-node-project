const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connection string from environment (set in docker-compose.yml)
const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://admin:secret123@mongo:27017/mydb?authSource=admin";

async function startServer() {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    const db = client.db("mydb");
    const users = db.collection("users");

    // Root route
    app.get("/", (req, res) => {
      res.send(`
        <h1>Welcome to the Node + Mongo App</h1>
        <form method="POST" action="/submit">
          <label>Name: <input type="text" name="name" /></label><br/>
          <label>Email: <input type="email" name="email" /></label><br/>
          <label>Age: <input type="number" name="age" /></label><br/>
          <button type="submit">Submit</button>
        </form>
        <p>Or visit <a href="/users">/users</a> to see all saved users.</p>
      `);
    });

    // Save user
    app.post("/submit", async (req, res) => {
      const { name, email, age } = req.body;
      if (!name || !email || !age) {
        return res.status(400).send("All fields (name, email, age) are required.");
      }
      await users.insertOne({ name, email, age: parseInt(age) });
      res.send("✅ User saved successfully!");
    });

    // List users
    app.get("/users", async (req, res) => {
      const allUsers = await users.find().toArray();
      res.json(allUsers);
    });

    // Start server
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  }
}

startServer();

