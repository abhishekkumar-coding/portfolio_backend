const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const Contact = require("./models/Contact");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Predefined subjects
const subjects = ["Web Development", "App Development", "SEO", "Digital Marketing", "Consultation"];

// GET route to get predefined subjects
app.get("/api/subjects", (req, res) => {
  res.json(subjects);
});

// POST route to handle form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Create a new contact entry
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();
    res.status(200).json({ msg: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Set port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
