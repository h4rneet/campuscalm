const releaseBtn = document.getElementById("releaseBtn");
const journalInput = document.getElementById("journalInput");
const affirmation = document.getElementById("affirmation");

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
