// Tune Out player logic (no external libraries)

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seek");
const timeNow = document.getElementById("timeNow");
const timeTotal = document.getElementById("timeTotal");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function setPlayIcon(isPlaying) {
  playBtn.textContent = isPlaying ? "❚❚" : "▶";
  playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

// Click play/pause
playBtn.addEventListener("click", async () => {
  // If no src yet, do nothing (you’ll add it later)
  if (!audio.src) {
    alert("Audio not set yet. Add a file path to the <audio> tag in tuneout.html.");
    return;
  }

  if (audio.paused) {
    try {
      await audio.play();
      setPlayIcon(true);
    } catch (e) {
      console.error(e);
    }
  } else {
    audio.pause();
    setPlayIcon(false);
  }
});

// When metadata loads, update duration
audio.addEventListener("loadedmetadata", () => {
  timeTotal.textContent = formatTime(audio.duration);
  seek.value = "0";
});

// Update seek bar while playing
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  seek.value = String(progress);
  timeNow.textContent = formatTime(audio.currentTime);
});

// Scrub
seek.addEventListener("input", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  const target = (Number(seek.value) / 100) * audio.duration;
  audio.currentTime = target;
});

// Reset UI when ended
audio.addEventListener("ended", () => {
  setPlayIcon(false);
  seek.value = "0";
  timeNow.textContent = "0:00";
});