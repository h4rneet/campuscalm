// Get mood from URL
const params = new URLSearchParams(window.location.search);
const mood = params.get("mood");

console.log("Selected mood:", mood);


if (mood === "good") {
  document.body.classList.add("theme-good");
}
else if (mood === "rough") {
  document.body.classList.add("theme-rough");
}
else if (mood === "overwhelmed") {
  document.body.classList.add("theme-overwhelmed");
}
else {
  document.body.classList.add("theme-neutral");
}