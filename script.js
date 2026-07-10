const introScreen = document.getElementById("introScreen");
const cardScreen = document.getElementById("cardScreen");
const sunButton = document.getElementById("sunButton");
const envelope = document.getElementById("envelope");
const envelopeHint = document.getElementById("envelopeHint");
const letter = document.getElementById("letter");
const revealButton = document.getElementById("revealButton");
const card = document.getElementById("card");
const heartButton = document.getElementById("heartButton");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

let opened = false;
let revealed = false;
let dragging = false;
let startY = 0;
let lastY = 0;

function setTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light");
    themeIcon.textContent = "☀";
    themeText.textContent = "Light";
  } else {
    document.body.classList.remove("light");
    themeIcon.textContent = "☾";
    themeText.textContent = "Dark";
  }
  localStorage.setItem("pondatiTheme", mode);
}

const savedTheme = localStorage.getItem("pondatiTheme") || "dark";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});

sunButton.addEventListener("click", () => {
  introScreen.classList.add("is-hidden");

  setTimeout(() => {
    cardScreen.classList.add("is-visible");
    showToast("I kept a letter for you, maa");
    createPetals(12);
  }, 430);
});

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("touchend", (event) => {
  event.preventDefault();
  openEnvelope();
}, { passive: false });

function openEnvelope() {
  if (opened) return;

  opened = true;
  envelope.classList.add("is-open");
  envelopeHint.style.display = "none";

  setTimeout(() => {
    letter.classList.add("is-visible");
    showToast("Swipe the letter up slowly");
    createPetals(10);
  }, 420);
}

revealButton.addEventListener("click", revealPhoto);

heartButton.addEventListener("click", () => {
  createPetals(42);
  showToast("I miss you terribly too, maa");
});

function yPosition(event) {
  if (event.touches && event.touches.length) return event.touches[0].clientY;
  return event.clientY;
}

function startDrag(event) {
  if (!opened || revealed) return;

  dragging = true;
  startY = yPosition(event);
  lastY = startY;
  letter.style.transition = "none";
}

function moveDrag(event) {
  if (!dragging || revealed) return;

  lastY = yPosition(event);
  const diff = lastY - startY;

  if (diff < 0) {
    const y = Math.max(-210, diff);
    const opacity = Math.max(0.28, 1 + diff / 180);
    const rotate = Math.max(-4, diff / 42);

    letter.style.transform = `translateY(${y}px) rotate(${rotate}deg) scale(1)`;
    letter.style.opacity = opacity;
  }
}

function endDrag() {
  if (!dragging || revealed) return;

  dragging = false;
  letter.style.transition = "";

  const diff = lastY - startY;

  if (diff < -65) {
    revealPhoto();
  } else {
    letter.style.transform = "";
    letter.style.opacity = "";
  }
}

letter.addEventListener("touchstart", startDrag, { passive: true });
letter.addEventListener("touchmove", moveDrag, { passive: true });
letter.addEventListener("touchend", endDrag);

letter.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("mouseup", endDrag);

function revealPhoto() {
  if (!opened || revealed) return;

  revealed = true;
  letter.classList.add("is-swiped");

  setTimeout(() => {
    card.classList.add("is-photo-revealed");
    showToast("This is the face my morning misses");
    createPetals(32);
  }, 360);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");

  setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function createPetals(count) {
  const symbols = ["♡", "♥", "✦", "❦"];

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 15 + Math.random() * 21 + "px";
    petal.style.color = Math.random() > 0.5
      ? "rgba(255,248,237,.88)"
      : "rgba(245,206,130,.86)";
    petal.style.animationDuration = 3.4 + Math.random() * 3.1 + "s";
    petal.style.animationDelay = Math.random() * 0.45 + "s";

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 7200);
  }
}
