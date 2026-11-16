const game = {
  count: 6,
  colors: [],
  answer: "",
  score: 0,
  round: 0,
  locked: false,
  nextRoundTimer: null,
};

const codeDisplay = document.querySelector("#rgb-code");
const messageDisplay = document.querySelector("#game-message");
const swatchesDisplay = document.querySelector("#swatches");
const scoreDisplay = document.querySelector("#score");
const roundDisplay = document.querySelector("#round-label");
const easyButton = document.querySelector("#easy-mode");
const hardButton = document.querySelector("#hard-mode");

function randomColor() {
  const channels = Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));
  return `rgb(${channels.join(", ")})`;
}

function startRound() {
  window.clearTimeout(game.nextRoundTimer);
  game.nextRoundTimer = null;
  game.colors = Array.from({ length: game.count }, randomColor);
  game.answer = game.colors[Math.floor(Math.random() * game.colors.length)];
  game.locked = false;
  game.round += 1;

  codeDisplay.textContent = game.answer;
  messageDisplay.textContent = "Selecciona la muestra que coincide";
  roundDisplay.textContent = `RONDA ${String(game.round).padStart(2, "0")}`;
  renderSwatches();
}

function renderSwatches() {
  swatchesDisplay.replaceChildren();

  game.colors.forEach((color, index) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    swatch.setAttribute("aria-label", `Muestra de color ${index + 1}`);
    swatch.addEventListener("click", () => selectColor(swatch, color));
    swatchesDisplay.append(swatch);
  });
}

function selectColor(swatch, selectedColor) {
  if (game.locked) return;

  if (selectedColor === game.answer) {
    game.locked = true;
    game.score += 1;
    scoreDisplay.textContent = String(game.score);
    messageDisplay.textContent = "¡Correcto! Buen ojo.";
    swatchesDisplay.querySelectorAll(".swatch").forEach((item) => {
      item.style.backgroundColor = game.answer;
      item.disabled = true;
    });
    game.nextRoundTimer = window.setTimeout(() => {
      game.nextRoundTimer = null;
      startRound();
    }, 1100);
    return;
  }

  swatch.classList.add("is-hidden");
  swatch.disabled = true;
  messageDisplay.textContent = "No es ese. Prueba con otro.";
}

function setDifficulty(count) {
  game.count = count;
  const isEasy = count === 3;
  easyButton.classList.toggle("is-active", isEasy);
  hardButton.classList.toggle("is-active", !isEasy);
  easyButton.setAttribute("aria-pressed", String(isEasy));
  hardButton.setAttribute("aria-pressed", String(!isEasy));
  startRound();
}

document.querySelector("#new-game").addEventListener("click", startRound);
easyButton.addEventListener("click", () => setDifficulty(3));
hardButton.addEventListener("click", () => setDifficulty(6));

startRound();