const goldEl = document.getElementById("gold");
const timerEl = document.getElementById("wave-timer");
const upgradeBtn = document.getElementById("upgrade-building");
const watchAdBtn = document.getElementById("watch-ad");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game State
let gold = 0;
let waveTimer = 24;
let buildingUnlocked = false;
let enemies = [];

function updateUI() {
  goldEl.textContent = gold;
  timerEl.textContent = waveTimer;

  if (!buildingUnlocked && gold >= 50) {
    upgradeBtn.disabled = false;
  } else {
    upgradeBtn.disabled = true;
  }
}

// Simple game loop every 1s
setInterval(() => {
  
  // Wave countdown
  waveTimer -= 1;
  if (waveTimer <= 0) {
    spawnEnemyWave();
    waveTimer = 24;
  }

  updateUI();
}, 1000);

upgradeBtn.addEventListener("click", () => {
  if (gold >= 50 && !buildingUnlocked) {
    gold -= 50;
    buildingUnlocked = true;
    upgradeBtn.textContent = "Mad Cow Inn Unlocked! 🐄";
    upgradeBtn.disabled = true;
  }
});

watchAdBtn.addEventListener("click", () => {
  alert("Simulating ad... 💰");
  gold *= 2;
  updateUI();
});

// Enemy placeholder rendering
function spawnEnemyWave() {
  enemies.push({ x: 800, y: 200, hp: 10 });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each enemy
  enemies.forEach(enemy => {
    enemy.x -= 2;
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, 30, 30);
  });

  requestAnimationFrame(draw);
}
draw();
