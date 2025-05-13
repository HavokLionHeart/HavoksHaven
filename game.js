import Hero from './classes/Hero.js';
import Resource from './classes/Resource.js';
import { getRandomResource } from './data/resourceDrops.js';
import MadCowInn from './classes/MadCowInn.js';

const inn = new MadCowInn(160, 580);

const goldUI = document.getElementById("gold");
const staminaUI = document.getElementById("stamina");
const adButton = document.getElementById("ad-button");
const invList = document.getElementById("inventory-list");
const innStatus = document.getElementById("inn-status");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hero = new Hero(160, 580);
const resources = [];

// Spawn a few random resource sprites
for (let i = 0; i < 5; i++) {
  const r = getRandomResource();
  resources.push(r);
}

// Handle clicks for movement
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hero.setTarget(x, y);
});

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  goldUI.textContent = Math.floor(hero.gold ?? 0);
  staminaUI.textContent = Math.floor(hero.stamina);

  // Check Inn proximity
const insideInn = inn.isHeroInside(hero);
innStatus.textContent = insideInn ? "Inn bonus active: 🐄" : "";

hero.regenerateStamina(insideInn ? 10 : 1);

// Update inventory UI
invList.innerHTML = '';
const items = hero.inventory.getAll();
const cap = hero.inventory.getCap();
for (const [key, val] of Object.entries(items)) {
  invList.innerHTML += `<li>${key}: ${val} / ${cap}</li>`;
}

  
  // Draw and update resources
  resources.forEach((r) => {
    r.update(hero);
    r.draw(ctx);
  });

  // Move and draw hero
  hero.update();
  hero.draw(ctx);
  inn.draw(ctx);


  requestAnimationFrame(loop);
}
adButton.addEventListener("click", () => {
  alert("Simulating ad reward... 💰");
  hero.gold *= 2;
});

loop();
