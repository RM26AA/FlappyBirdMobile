const bird = document.getElementById("bird");
const container = document.getElementById("gameContainer");
const scoreDisplay = document.getElementById("score");

let birdTop = container.clientHeight / 2;
const gravity = 2;
let isGameOver = false;
let score = 0;
let pipes = [];

function flap() {
  if (isGameOver) return;
  birdTop -= 50;
  if (birdTop < 0) birdTop = 0;
  bird.style.top = birdTop + "px";
}

function createPipe() {
  if (isGameOver) return;

  const gap = 150;
  const pipeWidth = 60;
  const minHeight = 50;
  const maxHeight = container.clientHeight - gap - minHeight;

  // Generate random height for top pipe
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
  const bottomHeight = container.clientHeight - topHeight - gap;

  console.log("Creating pipes:", topHeight, bottomHeight);

  // Create top pipe
  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = topHeight + "px";
  topPipe.style.left = container.clientWidth + "px"; // Start off right edge

  // Create bottom pipe
  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.left = container.clientWidth + "px"; // Start off right edge

  container.appendChild(topPipe);
  container.appendChild(bottomPipe);

  pipes.push({ topPipe, bottomPipe, passed: false });
}

function movePipes() {
  pipes.forEach((pipe, index) => {
    // Current left position in pixels
    let left = parseInt(pipe.topPipe.style.left);

    // Move pipes left by 2 pixels
    left -= 2;

    pipe.topPipe.style.left = left + "px";
    pipe.bottomPipe.style.left = left + "px";

    // Remove pipes if off screen
    if (left + 60 < 0) {
      container.removeChild(pipe.topPipe);
      container.removeChild(pipe.bottomPipe);
      pipes.splice(index, 1);
    }

    // Check if bird passed pipe for scoring
    if (!pipe.passed && left + 60 < 50) {
      score++;
      scoreDisplay.textContent = score;
      pipe.passed = true;
    }

    // Collision detection
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.topPipe.getBoundingClientRect();
    const bottomRect = pipe.bottomPipe.getBoundingClientRect();

    const hitTopPipe =
      birdRect.left < topRect.right &&
      birdRect.right > topRect.left &&
      birdRect.top < topRect.bottom;

    const hitBottomPipe =
      birdRect.left < bottomRect.right &&
      birdRect.right > bottomRect.left &&
      birdRect.bottom > bottomRect.top;

    if (hitTopPipe || hitBottomPipe) {
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

  birdTop += gravity;

  // Check if bird hits ground or flies above screen
  if (birdTop + bird.clientHeight > container.clientHeight || birdTop < 0) {
    endGame();
    return;
  }

  bird.style.top = birdTop + "px";

  movePipes();

  requestAnimationFrame(gameLoop);
}

// Tap/click to flap
window.addEventListener("click", flap);
window.addEventListener("touchstart", flap);

// Start pipe creation after 1 second delay
setTimeout(() => {
  createPipe();
  setInterval(createPipe, 2500);
}, 1000);

// Start the game loop immediately
requestAnimationFrame(gameLoop);


