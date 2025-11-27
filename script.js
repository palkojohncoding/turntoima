/* ---- TIMER SETUP ---- */
let intervalId = null;       // interval for active player
let startTime = null;        // timestamp for active player
let elapsedBeforePause = 0;  // elapsed for active player
let activePlayerIndex = 0;   

let mainStartTime = null;    // timestamp for main timer
let mainIntervalId = null;   // interval for main timer

const gameTimer = document.getElementById("timer");
const boxes = Array.from(document.querySelectorAll(".box")); // select all .box divs
const playerCounters = boxes.map(box => box.querySelector(".player-counter"));

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const trashBtn = document.getElementById("trashBtn");
const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");

/* ---- HELPER FUNCTION ---- */
function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* ---- START BUTTON ---- */
startBtn.addEventListener("click", () => {
  // Start main timer if not running
  if (!mainIntervalId) {
    const mainElapsed = gameTimer.textContent.split(":").map(Number);
    const mainElapsedMs = mainElapsed[0]*3600*1000 + mainElapsed[1]*60*1000 + mainElapsed[2]*1000;
    mainStartTime = Date.now() - mainElapsedMs;

    mainIntervalId = setInterval(() => {
      const elapsed = Date.now() - mainStartTime;
      gameTimer.textContent = formatTime(elapsed);
    }, 1000);
  }

  // Highlight the active player's box
  boxes[activePlayerIndex].classList.add("active-player");

  // Start active player timer if not running
  if (intervalId) return;

  const currentText = playerCounters[activePlayerIndex].textContent;
  const [h, m, s] = currentText.split(":").map(Number);
  elapsedBeforePause = h * 3600 * 1000 + m * 60 * 1000 + s * 1000;

  startTime = Date.now() - elapsedBeforePause;

  intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    playerCounters[activePlayerIndex].textContent = formatTime(elapsed);
  }, 1000);
});

/* ---- PAUSE BUTTON ---- */
pauseBtn.addEventListener("click", () => {
  // Pause main timer
  if (mainIntervalId) {
    clearInterval(mainIntervalId);
    mainIntervalId = null;
    const mainElapsed = Date.now() - mainStartTime;
    gameTimer.textContent = formatTime(mainElapsed);
  }

  // Pause active player timer
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    elapsedBeforePause = Date.now() - startTime;
  }

  // Remove active border from current box
  boxes[activePlayerIndex].classList.remove("active-player");
});

/* ---- RESET / TRASH BUTTON ---- */
trashBtn.addEventListener("click", () => {
  // Stop both timers
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
  if (mainIntervalId) { clearInterval(mainIntervalId); mainIntervalId = null; }

  startTime = null;
  elapsedBeforePause = 0;
  mainStartTime = null;
  activePlayerIndex = 0;

  gameTimer.textContent = "00:00:00";
  boxes.forEach((box, i) => {
    box.classList.remove("active-player");
    playerCounters[i].textContent = "00:00:00";
  });
});

/* ---- NEXT BUTTON ---- */
nextBtn.addEventListener("click", () => {
  switchPlayer(1);
});

/* ---- PREVIOUS BUTTON ---- */
previousBtn.addEventListener("click", () => {
  switchPlayer(-1);
});

/* ---- SWITCH PLAYER FUNCTION ---- */
function switchPlayer(direction) {
  // Pause current player timer
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    elapsedBeforePause = Date.now() - startTime;
  }

  // Remove border from previous player's box
  boxes[activePlayerIndex].classList.remove("active-player");

  // Move to next/previous player
  activePlayerIndex = (activePlayerIndex + direction + boxes.length) % boxes.length;

  // Add border to new active player's box
  boxes[activePlayerIndex].classList.add("active-player");

  // Resume new player's timer from their own elapsed time
  const currentText = playerCounters[activePlayerIndex].textContent;
  const [h, m, s] = currentText.split(":").map(Number);
  elapsedBeforePause = h * 3600 * 1000 + m * 60 * 1000 + s * 1000;

  startTime = Date.now() - elapsedBeforePause;

  intervalId = setInterval(() => {
    const elapsed = Date.now() - startTime;
    playerCounters[activePlayerIndex].textContent = formatTime(elapsed);
  }, 1000);
}
