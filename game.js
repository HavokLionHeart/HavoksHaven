import Hero from './classes/Hero.js';
import Resource from './classes/Resource.js';
import { getRandomResource } from './data/resourceDrops.js';

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

  // Draw and update resources
  resources.forEach((r) => {
    r.update(hero);
    r.draw(ctx);
  });

  // Move and draw hero
  hero.update();
  hero.draw(ctx);

  requestAnimationFrame(loop);
}
loop();
