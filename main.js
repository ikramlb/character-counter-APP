let btnToggle = document.querySelector('.btnToggle');
let textarea = document.querySelector('.zone-de-saise');
let totalChars = document.querySelector('.total-character .count');
let wordCount = document.querySelector('.word-count .count');
let sentenceCount = document.querySelector('.sentens-count .count');
let readingTime = document.querySelector('.reading-time');
let excludeSpacesCheckbox = document.querySelector('#spaces');
let limitCheckbox = document.querySelector('#limites');
let letterDensityDiv = document.querySelector('.letter-density');

let maxChars = null;
btnToggle.addEventListener('click', () => {
  let body = document.body;
  let sunIcon = document.querySelector("#sunIcon");
  let moonIcon = document.querySelector("#moonIcon");

  body.classList.toggle("darkmood");
  sunIcon.style.display = body.classList.contains("darkmood") ? "none" : "inline";
  moonIcon.style.display = body.classList.contains("darkmood") ? "inline" : "none";
});
textarea.addEventListener('input', updateCounts);
excludeSpacesCheckbox.addEventListener('change', updateCounts);
limitCheckbox.addEventListener('change', () => {
  if (limitCheckbox.checked) {
    let userLimit = prompt("Enter the maximum number of characters:");
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
  let words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  let sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  wordCount.textContent = words;
  sentenceCount.textContent = sentences;

  let minutes = words / 200;
  let seconds = Math.round((minutes * 60) % 60);
  let roundedMinutes = Math.floor(minutes);

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
  let letters = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
  let counts = {};

  for (let char of letters) {
    counts[char] = (counts[char] || 0) + 1;
  }

  letterDensityDiv.innerHTML = '';

  if (Object.keys(counts).length === 0) {
    letterDensityDiv.innerHTML = "<p style='color:#777;'>No letters yet...</p>";
    return;
  }

  let totalLetters = letters.length;
  let sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([char, count]) => {
    let percent = ((count / totalLetters) * 100).toFixed(2);
    let barContainer = document.createElement('div');
    barContainer.classList.add('letter-bar');

    let label = document.createElement('span');
    label.classList.add('letter-label');
    label.textContent = `${char.toUpperCase()} (${percent}%)`;

    let bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.width = `${percent}%`;

    barContainer.append(label);
    barContainer.append(bar);
    letterDensityDiv.append(barContainer);
  });
}
