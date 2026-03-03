// modes.js

const params = new URLSearchParams(window.location.search);
const mood = params.get("mood") || "neutral";

const moodTitle = document.getElementById("moodTitle");
const moodSub = document.getElementById("moodSub");

const momentCard = document.getElementById("momentCard");
const journalCard = document.getElementById("journalCard");
const tuneCard = document.getElementById("tuneCard");

momentCard.href = `moment.html?mood=${mood}`;

const stack = document.querySelector(".modeStack");

function moveToTop(card){
  stack.prepend(card);
}

if (mood === "good") {
  document.body.classList.add("theme-good");
  moodTitle.textContent = "Glad you're feeling good today!";
  moodSub.textContent = "Recommended mode: Want to keep the calm going? Try Tune Out.";
  moveToTop(tuneCard);
}

else if (mood === "rough") {
  document.body.classList.add("theme-rough");
  moodTitle.textContent = "Hey, it’s totally okay to take a pause!";
  moodSub.textContent = "Recommended mode: Try writing out your feelings. ";
  moveToTop(journalCard);
}

else if (mood === "overwhelmed") {
  document.body.classList.add("theme-overwhelmed");
  moodTitle.textContent = "It sounds like you're feeling overwhelmed.";
  moodSub.textContent = "Recommended mode: Let's slow things down for a moment and just breathe.";
  moveToTop(momentCard);
}

else {
  document.body.classList.add("theme-neutral");
  moodTitle.textContent = "That’s okay! You don’t need to have a clear answer.";
  moodSub.textContent = "Recommended mode: Try writing out your thoughts if it helps.";
  moveToTop(journalCard);
}
