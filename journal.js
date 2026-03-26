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

  // 🎉 CONFETTI
  for (let i = 0; i < 80; i++) {
  let piece = document.createElement("span");

  piece.style.left = Math.random() * 100 + "vw";
  piece.style.animationDelay = Math.random() * 0.5 + "s";
  piece.style.transform = `rotate(${Math.random()*360}deg)`;

  // 🎨 ADD THIS LINE
  piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  confettiContainer.appendChild(piece);


    setTimeout(() => {
      piece.remove();
    }, 1500);
  }
});
