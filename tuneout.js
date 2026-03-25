// Tune Out player logic (no external libraries)

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seek");
const timeNow = document.getElementById("timeNow");
const timeTotal = document.getElementById("timeTotal");

const params = new URLSearchParams(window.location.search);
const mood = params.get("mood") || "neutral";

document.getElementById("backBtn").href = `modes.html?mood=${mood}`;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function setPlayIcon(button, isPlaying) {
  button.textContent = isPlaying ? "❚❚" : "▶";
  button.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
}

const cards = document.querySelectorAll(".playerCard");

cards.forEach((card) => {
  const audio = card.querySelector(".audio");
  const playBtn = card.querySelector(".playBtn");
  const seek = card.querySelector(".seek");
  const timeNow = card.querySelector(".timeNow");
  const timeTotal = card.querySelector(".timeTotal");

  playBtn.addEventListener("click", async () => {
    const hasSource = audio.querySelector("source") && audio.querySelector("source").getAttribute("src");

    if (!hasSource) return;

    if (audio.paused) {
      try {
        cards.forEach((otherCard) => {
          const otherAudio = otherCard.querySelector(".audio");
          const otherBtn = otherCard.querySelector(".playBtn");

          if (otherAudio !== audio) {
            otherAudio.pause();
            setPlayIcon(otherBtn, false);
          }
        });

        await audio.play();
        setPlayIcon(playBtn, true);
      } catch (e) {
        console.error(e);
      }
    } else {
      audio.pause();
      setPlayIcon(playBtn, false);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    timeTotal.textContent = formatTime(audio.duration);
    seek.value = "0";
  });

  audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    seek.value = String(progress);
    timeNow.textContent = formatTime(audio.currentTime);
  });

  seek.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const target = (Number(seek.value) / 100) * audio.duration;
    audio.currentTime = target;
  });

  audio.addEventListener("ended", () => {
    setPlayIcon(playBtn, false);
    seek.value = "0";
    timeNow.textContent = "0:00";
  });
});