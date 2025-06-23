
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json()); // To handle JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.static(__dirname)); // Serve static files (index.html, script.js)

// In-memory storage for capsules
let capsules = [];

// Route: Serve the front-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route: Create a new capsule
app.post('/api/capsules', (req, res) => {
    const { title, contents, dateToOpen } = req.body;

    // Validate that all fields are provided
    if (!title || !contents || !dateToOpen) {
        return res.status(400).send('Title, contents, and dateToOpen are required');
    }

    // Create a new capsule object
    const newCapsule = {
        id: capsules.length + 1,
        title,
        contents,
        dateToOpen
    };

    // Add the new capsule to the array
    capsules.push(newCapsule);
    res.status(201).json(newCapsule); // Send back the newly created capsule
});

// Route: Get all capsules
app.get('/api/capsules', (req, res) => {
    res.json(capsules); // Return all capsules
});

// Route: Get a capsule by ID
app.get('/api/capsules/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const capsule = capsules.find(c => c.id === id);

    // Check if capsule exists
    if (!capsule) {
        return res.status(404).send('Capsule not found');
    }

    // Check if the current date is after the dateToOpen
    const currentDate = new Date();
    const openDate = new Date(capsule.dateToOpen);

    // If current date is before the open date, return a message
    if (currentDate < openDate) {
        return res.status(403).send(`This capsule cannot be opened until ${capsule.dateToOpen}`);
    }

    // If the capsule can be opened, return it
    res.json(capsule);
});

// Route: Delete a capsule by ID
app.delete('/api/capsules/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const capsuleIndex = capsules.findIndex(c => c.id === id);

    // If capsule does not exist, return 404
    if (capsuleIndex === -1) {
        return res.status(404).send('Capsule not found');
    }

    // Remove the capsule from the array
    capsules.splice(capsuleIndex, 1);
    res.send(`Capsule with ID ${id} deleted successfully.`);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
