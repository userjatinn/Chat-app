require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");

const app = express();
const port = 8000;

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend
app.use(express.json());

// API to handle message submission
app.post("/api/messages", async (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).json({ error: "Username and message are required." });
    }

    await pusher.trigger("chat", "message", { username, message });
    res.status(200).json({ success: true });
});

// Start server
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
