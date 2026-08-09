const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const mongoUrl = "mongodb://mongo:27017";
const client = new MongoClient(mongoUrl);

let db;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/submit", async (req, res) => {

    try {

        const { name, email, age } = req.body;

        const user = {
            name: name,
            email: email,
            age: Number(age),
            createdAt: new Date()
        };

        await db.collection("users").insertOne(user);

        console.log("User saved successfully");

        res.send(`
            <h1>Successfully Saved!</h1>

            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Age: ${age}</p>

            <br>

            <a href="/">Go Back</a>
        `);

    } catch (error) {

        console.error(error);

        res.status(500).send("Error saving user");

    }

});

async function startServer() {

    try {

        await client.connect();

        console.log("Connected to MongoDB");

        db = client.db("myapp");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("MongoDB connection failed:", error);

    }

}

startServer();
