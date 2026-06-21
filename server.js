const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Fake database
let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
];


// CREATE
app.post("/users", (req, res) => {
    const { name } = req.body;

    const user = {
        id: users.length + 1,
        name
    };

    users.push(user);

    res.status(201).json(user);
});


// READ ALL
app.get("/users", (req, res) => {
    res.json(users);
});


// READ ONE
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});


// UPDATE
app.put("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body;

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.name = name;

    res.json(user);
});


// DELETE
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    users.splice(userIndex, 1);

    res.json({
        message: "User deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});