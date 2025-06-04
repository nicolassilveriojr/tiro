const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const scoreText = document.getElementById("score");
const finalScore = document.getElementById("final-score");

let player, bullets, enemies, keys, score, gameOver, shootSound;

const playerSize = 40;
const bulletSize = 5;
const enemySize = 30;

function init() {
  player = { x: canvas.width / 2 - playerSize / 2, y: canvas.height - 60, speed: 5 };
  bullets = [];
  enemies = [];
  keys = {};
  score = 0;
  gameOver = false;
  spawnEnemies();
  updateScore();
  shootSound = new AudioContext();
}

function drawPlayer() {
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, playerSize, playerSize);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize * 2);
  });
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
  });
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleInput();
  updateBullets();
  updateEnemies();
  checkCollisions();
  drawPlayer();
  drawBullets();
  drawEnemies();

  requestAnimationFrame(update);
}

function handleInput() {
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - playerSize) player.x = canvas.width - playerSize;
}

function updateBullets() {
  bullets = bullets.filter(b => b.y > -10);
  bullets.forEach(b => b.y -= 7);
}

function updateEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemy.y = -enemySize;
      enemy.x = Math.random() * (canvas.width - enemySize);
    }
  });
}

function checkCollisions() {
  // Tiro em inimigo
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + enemySize &&
        b.x + bulletSize > e.x &&
        b.y < e.y + enemySize &&
        b.y + bulletSize * 2 > e.y
      ) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += 10;
        updateScore();
      }
    });
  });

  // Inimigo atinge jogador
  enemies.forEach(enemy => {
    if (
      player.x < enemy.x + enemySize &&
      player.x + playerSize > enemy.x &&
      player.y < enemy.y + enemySize &&
      player.y + playerSize > enemy.y
    ) {
      endGame();
    }
  });
}

function updateScore() {
  scoreText.textContent = "Pontuação: " + score;
}

function endGame() {
  gameOver = true;
  gameContainer.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScore.textContent = `Você fez ${score} pontos.`;
}

function spawnEnemies() {
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - enemySize),
      y: Math.random() * -300,
      speed: 2 + Math.random() * 2
    });
  }
}

function shoot() {
  bullets.push({ x: player.x + playerSize / 2 - bulletSize / 2, y: player.y });
  try {
    const oscillator = shootSound.createOscillator();
    oscillator.frequency.value = 600;
    oscillator.connect(shootSound.destination);
    oscillator.start();
    oscillator.stop(shootSound.currentTime + 0.05);
  } catch {}
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if ((e.key === " " || e.key === "Spacebar") && !gameOver) {
    shoot();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  gameOverScreen.style.display = "none";
  init();
  update();
});

restartButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContainer.style.display = "block";
  gameOverScreen.style.display = "none";
  init();
  update();
});
