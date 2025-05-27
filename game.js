import Hero from './classes/Hero.js';
import Resource from './classes/Resource.js';
import { getRandomResource } from './data/resourceDrops.js';
import MadCowInn from './classes/MadCowInn.js';

// Load background image
const bgImage = new Image();
bgImage.src = "./assets/bg.png";

// Floating text system
const floatingTexts = [];
class FloatingText {
  constructor(x, y, text, color = "#FFF") {
    this.x = x;
    this.y = y;
    this.text = text;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.y -= 0.5;
    this.alpha -= 0.01;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = "14px sans-serif";
    ctx.fillText(this.text, this.x, this.y);
    ctx.globalAlpha = 1;
  }

  isDead() {
    return this.alpha <= 0;
  }
}


const inn = new MadCowInn(300, 500);


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const inventoryIcon = {
  x: canvas.width - 50,
  y: canvas.height - 50,
  size: 40
};

let inventoryPanelOpen = false;
let inventoryPanelY = canvas.height;
let inventoryTargetY = canvas.height;

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Dynamic icon position (follows panel)
  const backpackY = inventoryIcon.y - (inventoryPanelOpen ? 160 : 0);

  const clickedBackpack = (
    x >= inventoryIcon.x &&
    x <= inventoryIcon.x + inventoryIcon.size &&
    y >= backpackY &&
    y <= backpackY + inventoryIcon.size
  );

  if (clickedBackpack) {
    inventoryPanelOpen = !inventoryPanelOpen;
    inventoryTargetY = inventoryPanelOpen ? canvas.height - 150 : canvas.height;
  } else {
    hero.setTarget(x, y);
  }
});



const hero = new Hero(160, 580);
const resources = [];

// Spawn a few random resource sprites
for (let i = 0; i < 5; i++) {
  const r = getRandomResource();
  resources.push(r);
}

// Game loop
function loop() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  floatingTexts.forEach((t) => {
    t.update();
    t.draw(ctx);
  });
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    if (floatingTexts[i].isDead()) floatingTexts.splice(i, 1);
  }
  
    // HUD setup
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText(`Gold: ${Math.floor(hero.inventory.get("Gold"))}`, 10, 20);
  ctx.fillText(`Stamina: ${Math.floor(hero.stamina)}`, 150, 20);

 // Inventory panel (draw this first)
inventoryPanelY += (inventoryTargetY - inventoryPanelY) * 0.2;
ctx.fillStyle = "#000";
ctx.fillRect(0, inventoryPanelY, canvas.width, 150);
ctx.strokeStyle = "#555";
ctx.strokeRect(0, inventoryPanelY, canvas.width, 150);

ctx.fillStyle = "#fff";
ctx.font = "12px sans-serif";
let i = 0;
for (const [key, val] of Object.entries(hero.inventory.getAll())) {
  ctx.fillText(`${key}: ${val} / ${hero.inventory.getCap()}`, 10, inventoryPanelY + 20 + i * 20);
  i++;
}

// THEN draw backpack button over it
const backpackY = inventoryIcon.y - (inventoryPanelOpen ? 160 : 0);
ctx.fillStyle = "#222";
ctx.fillRect(inventoryIcon.x, backpackY, inventoryIcon.size, inventoryIcon.size);
ctx.fillStyle = "#fff";
ctx.font = "12px sans-serif";
ctx.fillText("🎒", inventoryIcon.x + 10, backpackY + 25);



  // Check Inn proximity
const insideInn = inn.isHeroInside(hero);

hero.regenerateStamina(insideInn ? 10 : 1);

  
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


loop();
