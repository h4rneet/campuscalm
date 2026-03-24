const releaseBtn = document.getElementById("releaseBtn");
const journalInput = document.getElementById("journalInput");
const affirmation = document.getElementById("affirmation");

const params = new URLSearchParams(window.location.search);
const mood = params.get("mood") || "neutral";

document.getElementById("backBtn").href = `modes.html?mood=${mood}`;

releaseBtn.addEventListener("click", () => {
  journalInput.value = "";
  affirmation.style.display = "block";
  affirmation.style.opacity = 0;

  let opacity = 0;
  const fade = setInterval(() => {
    opacity += 0.05;
    affirmation.style.opacity = opacity;
    if (opacity >= 1) clearInterval(fade);
  }, 50);
});
