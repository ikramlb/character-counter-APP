const btnToggle = document.querySelector('.btnToggle');
const textarea = document.querySelector('.zone-de-saise');
const totalChars = document.querySelector('.total-character .count');
const wordCount = document.querySelector('.word-count .count');
const sentenceCount = document.querySelector('.sentens-count .count');
const readingTime = document.querySelector('.reading-time');
const excludeSpacesCheckbox = document.getElementById('spaces');
const limitCheckbox = document.getElementById('limites');
const letterDensityDiv = document.querySelector('.letter-density');

let maxChars = null;
btnToggle.addEventListener('click', () => {
  const body = document.body;
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  body.classList.toggle("darkmood");
  sunIcon.style.display = body.classList.contains("darkmood") ? "none" : "inline";
  moonIcon.style.display = body.classList.contains("darkmood") ? "inline" : "none";
});
textarea.addEventListener('input', updateCounts);
excludeSpacesCheckbox.addEventListener('change', updateCounts);
limitCheckbox.addEventListener('change', () => {
  if (limitCheckbox.checked) {
    const userLimit = prompt("Enter the maximum number of characters:");
    if (userLimit && !isNaN(userLimit) && userLimit > 0) {
      maxChars = parseInt(userLimit);
      alert(`Character limit set to ${maxChars} characters`);
    } else {
      alert("Invalid number");
      limitCheckbox.checked = false;
      maxChars = null;
    }
  } else {
    maxChars = null;
  }
  updateCounts();
});
function updateCounts() {
  let text = textarea.value;
  let chars = text.length;
  if (excludeSpacesCheckbox.checked) {
    chars = text.replace(/\s/g, '').length;
  }

  totalChars.textContent = chars;
  if (maxChars !== null) {
    if (chars > maxChars) {
      textarea.style.borderColor = "red";
      textarea.style.boxShadow = "0 0 10px red";
    } else {
      textarea.style.borderColor = "#6366F1";
      textarea.style.boxShadow = "none";
    }
  }
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  wordCount.textContent = words;
  sentenceCount.textContent = sentences;

  const minutes = words / 200;
  const seconds = Math.round((minutes * 60) % 60);
  const roundedMinutes = Math.floor(minutes);

  if (words === 0) {
    readingTime.textContent = "Approx. reading time: 0 min";
  } else if (minutes < 1) {
    readingTime.textContent = `Approx. reading time: <1 min (${seconds}s)`;
  } else {
    readingTime.textContent = `Approx. reading time: ${roundedMinutes} min`;
  }
  updateLetterDensity(text);
}
function updateLetterDensity(text) {
  const letters = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const counts = {};

  for (let char of letters) {
    counts[char] = (counts[char] || 0) + 1;
  }

  letterDensityDiv.innerHTML = '';

  if (Object.keys(counts).length === 0) {
    letterDensityDiv.innerHTML = "<p style='color:#777;'>No letters yet...</p>";
    return;
  }

  const totalLetters = letters.length;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([char, count]) => {
    const percent = ((count / totalLetters) * 100).toFixed(2);
    const barContainer = document.createElement('div');
    barContainer.classList.add('letter-bar');

    const label = document.createElement('span');
    label.classList.add('letter-label');
    label.textContent = `${char.toUpperCase()} (${percent}%)`;

    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.width = `${percent}%`;

    barContainer.appendChild(label);
    barContainer.appendChild(bar);
    letterDensityDiv.appendChild(barContainer);
  });
}
