const musicSuggestions = {
  happy: [
    "🎶 'Happy' by Pharrell Williams",
    "🎶 'Can't Stop the Feeling!' by Justin Timberlake",
    "🎶 'Walking on Sunshine' by Katrina & The Waves"
  ],
  sad: [
    "🎶 'Someone Like You' by Adele",
    "🎶 'Fix You' by Coldplay",
    "🎶 'Let Her Go' by Passenger"
  ],
  energetic: [
    "🎶 'Eye of the Tiger' by Survivor",
    "🎶 'Stronger' by Kanye West",
    "🎶 'Don't Stop Me Now' by Queen"
  ],
  relaxed: [
    "🎶 'Weightless' by Marconi Union",
    "🎶 'Sunset Lover' by Petit Biscuit",
    "🎶 'Breathe Me' by Sia"
  ]
};

const moodColors = {
  happy: "linear-gradient(135deg, #4a2c2a, #1c2526)",
  sad: "linear-gradient(135deg, #2c2e44, #1a1b26)",
  energetic: "linear-gradient(135deg, #3d1c1c, #2e1a1a)",
  relaxed: "linear-gradient(135deg, #2a3b4c, #1c2526)"
};

const moodAlbumArt = {
  // Use the path to your saved image
  happy: "./images/black-disk-art.png",
  sad: "./images/black-disk-art.png",
  energetic: "./images/black-disk-art.png",
  relaxed: "./images/black-disk-art.png",
};

let currentMood = null;
let currentTrackIndex = 0;

async function showMusic(mood) {
  currentMood = mood;
  currentTrackIndex = 0;

  // Fetch songs from backend based on mood folder
  const response = await fetch(`http://localhost:5000/api/music/${mood}`);
  const tracks = await response.json();

  const display = document.getElementById("music-display");

  if (!tracks.length) {
    display.innerHTML = `<h2>No songs found for ${mood} mood 😢</h2>`;
    return;
  }

  // Update song list in your existing UI
  display.innerHTML = `
    <h2>${mood.toUpperCase()} Mood Songs</h2>
    <ul>${tracks.map(t => `<li>${t.title}</li>`).join('')}</ul>
  `;

  // Keep your background, album art, etc.
  document.body.style.background = moodColors[mood];
  document.getElementById("album-art").src = moodAlbumArt[mood];
  document.getElementById("song-title").textContent = tracks[currentTrackIndex].title;

  // Play the first song automatically
  const audio = document.getElementById("audio");
  audio.src = `http://localhost:5000${tracks[currentTrackIndex].url}`;
  audio.play();

  // Store the tracks for next/prev control
  window.currentTracks = tracks;
}

// Keep your existing next/prev buttons working
function updateTrack(direction) {
  if (!window.currentTracks || !currentMood) return;

  currentTrackIndex =
    (currentTrackIndex + direction + window.currentTracks.length) %
    window.currentTracks.length;

  const song = window.currentTracks[currentTrackIndex];
  const audio = document.getElementById("audio");
  const albumArt = document.getElementById("album-art");
  const songTitle = document.getElementById("song-title");

  songTitle.textContent = song.title;
  albumArt.src = moodAlbumArt[currentMood];
  audio.src = `http://localhost:5000${song.url}`;
  audio.play();
}


function updateTrack(direction) {
  if (!currentMood) return;
  const tracks = musicSuggestions[currentMood];
  currentTrackIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
  const albumArt = document.getElementById("album-art");
  const songTitle = document.getElementById("song-title");
  songTitle.textContent = tracks[currentTrackIndex].replace('🎶 ', '');
  albumArt.src = moodAlbumArt[currentMood];
  albumArt.classList.remove("spin");
  void albumArt.offsetWidth; // Force reflow to restart animation
  albumArt.classList.add("spin");
}

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");

playBtn.addEventListener("click", () => {
  audio.play();
  playBtn.classList.add("active");
  pauseBtn.classList.remove("active");
  document.getElementById("album-art").classList.add("spin");
});

pauseBtn.addEventListener("click", () => {
  audio.pause();
  pauseBtn.classList.add("active");
  playBtn.classList.remove("active");
  document.getElementById("album-art").classList.remove("spin");
});

prevBtn.addEventListener("click", () => {
  updateTrack(-1);
});

nextBtn.addEventListener("click", () => {
  updateTrack(1);
});