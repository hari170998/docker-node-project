const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/submit", (req, res) => {
    const { name, email, age } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Age:", age);

    res.send(`
        <h1>Form Submitted!</h1>

        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Age: ${age}</p>

        <a href="/">Go Back</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
