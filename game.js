const bird = document.getElementById("bird");
const container = document.getElementById("gameContainer");
const scoreDisplay = document.getElementById("score");

let birdTop = container.clientHeight / 2;
let isGameOver = false;
let score = 0;
let pipes = [];

// Responsive speed scaling
const baseWidth = 800; // baseline for PC
const deviceSpeedFactor = Math.max(0.7, Math.min(window.innerWidth / baseWidth, 1.5)); // Clamp factor
const pipeSpeed = 2 * deviceSpeedFactor;
const gravitySpeed = 2 * deviceSpeedFactor;
const flapStrength = 50 * deviceSpeedFactor;
const pipeGap = 150 * deviceSpeedFactor;

function flap() {
  if (isGameOver) return;
  birdTop -= flapStrength;
  if (birdTop < 0) birdTop = 0;
  bird.style.top = birdTop + "px";
}

function createPipe() {
  if (isGameOver) return;

  const pipeWidth = 60;
  const minHeight = 50;
  const maxHeight = container.clientHeight - pipeGap - minHeight;

  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
  const bottomHeight = container.clientHeight - topHeight - pipeGap;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = topHeight + "px";
  topPipe.style.left = container.clientWidth + "px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.left = container.clientWidth + "px";

  container.appendChild(topPipe);
  container.appendChild(bottomPipe);

  pipes.push({ topPipe, bottomPipe, passed: false });
}

function movePipes() {
  pipes.forEach((pipe, index) => {
    let left = parseInt(pipe.topPipe.style.left);
    left -= pipeSpeed;
    pipe.topPipe.style.left = left + "px";
    pipe.bottomPipe.style.left = left + "px";

    if (left + 60 < 0) {
      container.removeChild(pipe.topPipe);
      container.removeChild(pipe.bottomPipe);
      pipes.splice(index, 1);
    }

    if (!pipe.passed && left + 60 < 50) {
      score++;
      scoreDisplay.textContent = score;
      pipe.passed = true;
    }

    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.topPipe.getBoundingClientRect();
    const bottomRect = pipe.bottomPipe.getBoundingClientRect();

    const hitTop = birdRect.left < topRect.right &&
                   birdRect.right > topRect.left &&
                   birdRect.top < topRect.bottom;

    const hitBottom = birdRect.left < bottomRect.right &&
                      birdRect.right > bottomRect.left &&
                      birdRect.bottom > bottomRect.top;

    if (hitTop || hitBottom) {
      endGame();
    }
  });
}

function endGame() {
  isGameOver = true;
  alert("Game Over! Score: " + score);
  location.reload();
}

function gameLoop() {
  if (isGameOver) return;

  birdTop += gravitySpeed;

  if (birdTop + bird.clientHeight > container.clientHeight || birdTop < 0) {
    endGame();
    return;
  }

  bird.style.top = birdTop + "px";
  movePipes();
  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener("click", flap);
window.addEventListener("touchstart", flap);

// Start pipes with dynamic interval
const pipeInterval = 2500 / deviceSpeedFactor;

setTimeout(() => {
  createPipe();
  setInterval(createPipe, pipeInterval);
}, 1000);

// Start game loop
requestAnimationFrame(gameLoop);



