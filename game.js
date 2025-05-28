import Hero from './classes/Hero.js';
import Resource from './classes/Resource.js';
import FloatingText from './classes/FloatingText.js';
import { getRandomResource } from './data/resourceDrops.js';
import MadCowInn from './classes/MadCowInn.js';
import AdManager from './classes/AdManager.js';

// Load background image
const bgImage = new Image();
bgImage.src = "./assets/bg.png";

// Game objects
const floatingTexts = [];
const inn = new MadCowInn(300, 500);
const hero = new Hero(160, 580);
const resources = [];

// Initialize Ad Manager
const adManager = new AdManager();
window.adManager = adManager; // Make available globally for HTML buttons

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let gameRunning = true;
let doubleGoldActive = false;
let doubleGoldEndTime = 0;

// UI state
const inventoryIcon = {
  x: canvas.width - 50,
  y: canvas.height - 50,
  size: 40
};

let inventoryPanelOpen = false;
let inventoryPanelY = canvas.height;
let inventoryTargetY = canvas.height;

// Event listeners
canvas.addEventListener("click", (e) => {
  if (adManager.gameIsPaused) return; // Don't process clicks during ads
  
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

// Rewarded ad button handlers
document.getElementById('double-gold-btn').addEventListener('click', () => {
  if (doubleGoldActive) {
    alert('Double gold is already active!');
    return;
  }
  
  adManager.showRewardedAd('Double Gold Boost', '60 seconds', (rewardType, rewardAmount) => {
    activateDoubleGold();
  });
});

document.getElementById('restore-stamina-btn').addEventListener('click', () => {
  adManager.showRewardedAd('Full Stamina', '100 points', (rewardType, rewardAmount) => {
    hero.stamina = hero.staminaMax;
    // Add visual feedback
    floatingTexts.push(new FloatingText(hero.x, hero.y - 30, 'Stamina Restored!', '#00FF00'));
  });
});

// Double gold effect
function activateDoubleGold() {
  doubleGoldActive = true;
  doubleGoldEndTime = Date.now() + 60000; // 60 seconds
  floatingTexts.push(new FloatingText(hero.x, hero.y - 30, 'Double Gold Active!', '#FFD700'));
}

// Initialize resources
for (let i = 0; i < 5; i++) {
  const r = getRandomResource();
  resources.push(r);
}

// Enhanced resource collection tracking
function onResourceCollected(resourceType, amount, goldAmount) {
  // Apply double gold if active
  let finalGoldAmount = goldAmount;
  if (doubleGoldActive && Date.now() < doubleGoldEndTime) {
    finalGoldAmount *= 2;
    floatingTexts.push(new FloatingText(hero.x + 20, hero.y - 20, `2x Gold!`, '#FFD700'));
  }
  
  hero.gold += finalGoldAmount;
  
  // Notify ad manager
  adManager.onResourceCollected(resourceType, amount);
}

// Game loop
function loop() {
  // Check if game is paused by ads
  if (adManager.gameIsPaused) {
    requestAnimationFrame(loop);
    return;
  }
  
  // Check if double gold expired
  if (doubleGoldActive && Date.now() > doubleGoldEndTime) {
    doubleGoldActive = false;
    floatingTexts.push(new FloatingText(hero.x, hero.y - 30, 'Double Gold Ended', '#FF6B6B'));
  }
  
  // Clear and draw background
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // Update and draw floating texts
  floatingTexts.forEach((t) => {
    t.update();
    t.draw(ctx);
  });
  
  // Remove dead floating texts
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    if (floatingTexts[i].isDead()) {
      floatingTexts.splice(i, 1);
    }
  }
  
  // Draw HUD
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, 50);
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText(`Gold: ${Math.floor(hero.gold)}`, 10, 20);
  ctx.fillText(`Stamina: ${Math.floor(hero.stamina)}`, 150, 20);
  
  // Show double gold status
  if (doubleGoldActive) {
    const timeLeft = Math.ceil((doubleGoldEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`2x Gold: ${timeLeft}s`, 10, 40);
  }

  // Draw inventory panel
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

  // Draw backpack button
  const backpackY = inventoryIcon.y - (inventoryPanelOpen ? 160 : 0);
  ctx.fillStyle = "#222";
  ctx.fillRect(inventoryIcon.x, backpackY, inventoryIcon.size, inventoryIcon.size);
  ctx.fillStyle = "#fff";
  ctx.font = "12px sans-serif";
  ctx.fillText("🎒", inventoryIcon.x + 10, backpackY + 25);

  // Check Inn proximity and regenerate stamina
  const insideInn = inn.isHeroInside(hero);
  hero.regenerateStamina(insideInn ? 10 : 1);
  
  // Update and draw resources
  resources.forEach((r) => {
    r.update(hero, floatingTexts);
    r.draw(ctx);
  });

  // Clean up dead resources and spawn new ones
  for (let i = resources.length - 1; i >= 0; i--) {
    if (resources[i].isDead) {
      // Track the collection before removing
      const resource = resources[i];
      const goldAmount = resource.rewards.Gold || 0;
      onResourceCollected(resource.type, 1, goldAmount);
      
      resources.splice(i, 1);
      // Spawn a new resource to replace it
      resources.push(getRandomResource());
    }
  }

  // Update and draw hero
  hero.update();
  hero.draw(ctx);
  
  // Draw Inn
  inn.draw(ctx);

  requestAnimationFrame(loop);
}

// Start the game
loop();