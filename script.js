const introPage = document.getElementById("introPage");
const cardPage = document.getElementById("cardPage");
const sunButton = document.getElementById("sunButton");
const envelope = document.getElementById("envelope");
const envelopeHint = document.getElementById("envelopeHint");
const letter = document.getElementById("letter");
const revealButton = document.getElementById("revealButton");
const stage = document.getElementById("stage");
const heartButton = document.getElementById("heartButton");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const loveSong = document.getElementById("loveSong");

let opened = false;
let revealed = false;
let dragging = false;
let startY = 0;
let lastY = 0;
let songPlaying = false;

function setTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light");
    themeIcon.textContent = "☀";
  } else {
    document.body.classList.remove("light");
    themeIcon.textContent = "☾";
  }
  localStorage.setItem("pondatiTheme", mode);
}

setTheme(localStorage.getItem("pondatiTheme") || "dark");

themeToggle.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light") ? "dark" : "light");
});

function updateMusicButton() {
  if (songPlaying) {
    musicButton.classList.add("playing");
    musicIcon.textContent = "Ⅱ";
  } else {
    musicButton.classList.remove("playing");
    musicIcon.textContent = "♪";
  }
}

async function toggleSong() {
  try {
    if (loveSong.paused) {
      loveSong.volume = 0.72;
      await loveSong.play();
      songPlaying = true;
      showToast("Playing our morning song");
    } else {
      loveSong.pause();
      songPlaying = false;
      showToast("Song paused");
    }
  } catch (error) {
    songPlaying = false;
    showToast("Tap once more to play the song");
  }
  updateMusicButton();
}

musicButton.addEventListener("click", toggleSong);

sunButton.addEventListener("click", () => {
  introPage.classList.remove("active");

  setTimeout(() => {
    cardPage.classList.add("active");
    showToast("I kept a letter for you, maa");
    createPetals(12);

    loveSong.volume = 0.72;
    loveSong.play().then(() => {
      songPlaying = true;
      updateMusicButton();
    }).catch(() => {});
  }, 340);
});

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("touchend", (event) => {
  event.preventDefault();
  openEnvelope();
}, { passive: false });

function openEnvelope() {
  if (opened) return;

  opened = true;
  envelope.classList.add("open");
  envelopeHint.style.display = "none";

  setTimeout(() => {
    letter.classList.add("visible");
    showToast("Swipe the letter up slowly");
    createPetals(10);
  }, 400);
}

revealButton.addEventListener("click", revealPhoto);

heartButton.addEventListener("click", () => {
  createPetals(42);
  showToast("I LOVEEEE YOUUU SOOO SOO MUCHH AND I MISS YOUUU TERRIBLYYY MAAA MUAHHHHH");
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
    const y = Math.max(-190, diff);
    const opacity = Math.max(0.30, 1 + diff / 180);
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

  if (diff < -62) {
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
  letter.classList.add("swiped");

  setTimeout(() => {
    stage.classList.add("revealed");
    showToast("This is the face my morning misses");
    createPetals(32);
  }, 320);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
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
      : "rgba(246,207,134,.86)";
    petal.style.animationDuration = 3.4 + Math.random() * 3.1 + "s";
    petal.style.animationDelay = Math.random() * 0.45 + "s";

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), 7200);
  }
}
