const releaseBtn = document.getElementById("releaseBtn");
const journalInput = document.getElementById("journalInput");
const affirmation = document.getElementById("affirmation");
const confettiContainer = document.getElementById("confetti");

const params = new URLSearchParams(window.location.search);
const mood = params.get("mood") || "neutral";

document.getElementById("backBtn").href = `modes.html?mood=${mood}`;

if (mood === "good") {
  document.body.classList.add("theme-good");
} else if (mood === "rough") {
  document.body.classList.add("theme-rough");
} else if (mood === "overwhelmed") {
  document.body.classList.add("theme-overwhelmed");
} else {
  document.body.classList.add("theme-neutral");
}

releaseBtn.addEventListener("click", () => {
  // clear text
  journalInput.value = "";

  // show affirmation (fade in)
  affirmation.style.display = "block";
  affirmation.style.opacity = 0;

  let opacity = 0;
  const fade = setInterval(() => {
    opacity += 0.05;
    affirmation.style.opacity = opacity;
    if (opacity >= 1) clearInterval(fade);
  }, 50);
const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#ff9f1c", "#c77dff"];

  //  CONFETTI
if (confettiContainer) {

  const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#ff9f1c", "#c77dff"];

  for (let i = 0; i < 80; i++) {
    let piece = document.createElement("span");

    piece.style.position = "absolute"; // 🔴 important safety
    piece.style.top = "0px";           // 🔴 ensures it starts on screen
    piece.style.left = Math.random() * window.innerWidth + "px";

    piece.style.width = "8px";
    piece.style.height = "12px";

    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    piece.style.animation = "fall 1.5s linear forwards";

    confettiContainer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 1500);
  }
}

