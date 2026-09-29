const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Meeting = require("./models/Meeting");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve frontend files from SmartMeetingPrep folder
app.use(express.static(path.join(__dirname, "..")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// GET all meetings
app.get("/api/meetings", async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new meeting
app.post("/api/meetings", async (req, res) => {
    try {
        const meeting = new Meeting(req.body);
        const savedMeeting = await meeting.save();

        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});