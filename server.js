const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Serve all static song files
app.use("/songs", express.static(path.join(__dirname, "songs")));

// API route to return list of songs for the selected mood
app.get("/api/music/:mood", (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const moodPath = path.join(__dirname, "songs", mood);

  if (!fs.existsSync(moodPath)) {
    return res.status(404).json({ error: `No songs found for mood: ${mood}` });
  }

  const songs = fs
    .readdirSync(moodPath)
    .filter(file => file.endsWith(".mp3"))
    .map(file => ({
      title: path.parse(file).name,
      url: `/songs/${mood}/${file}`,
    }));

  res.json(songs);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🎵 Server running at http://localhost:${PORT}`));
