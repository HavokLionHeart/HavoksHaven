import FloatingText from './FloatingText.js';

export default class Resource {
    constructor(x, y, size, hp, type, color, rewards) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.hp = hp;
      this.maxHp = hp;
      this.type = type;
      this.color = color;
      this.rewards = { ...rewards }; // Clone to avoid reference issues
      this.harvesting = false;
      this.isDead = false;
    }
  
    update(hero, floatingTexts) {
      if (this.isDead) return;
      
      const dx = this.x - hero.x;
      const dy = this.y - hero.y;
      const dist = Math.hypot(dx, dy);
  
      if (dist < this.size + hero.size && hero.stamina > 0) {
        this.harvesting = true;
        const dmg = hero.getHarvestPower() * 0.1;
        this.hp -= dmg;
        hero.reduceStamina(0.5);
  
        if (this.hp <= 0) {
          this.die(hero, floatingTexts);
        }
      } else {
        this.harvesting = false;
      }
    }
  
    die(hero, floatingTexts) {
      if (this.isDead) return; // Prevent double-death
      
      this.isDead = true;
      
      // Award rewards once
      for (const [key, val] of Object.entries(this.rewards)) {
        hero.inventory.add(key, val);
        floatingTexts.push(new FloatingText(this.x, this.y, `${key} +${val}`));
      }
      
      // Award gold separately if exists
      if (this.rewards["Gold"]) {
        hero.gold += this.rewards["Gold"];
      }
      
      this.size = 0; // Make invisible but keep object for cleanup
    }
  
    draw(ctx) {
      if (this.isDead || this.size <= 0) return;
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
  
      // Health bar
      if (this.hp > 0 && this.hp < this.maxHp) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 20, this.y - this.size - 15, 40, 3);
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - 20, this.y - this.size - 15, 40 * (this.hp / this.maxHp), 3);
      }
    }
  }