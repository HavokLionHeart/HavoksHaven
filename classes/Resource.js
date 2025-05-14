export default class Resource {
    constructor(x, y, size, hp, type, color, rewards) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.hp = hp;
      this.maxHp = hp;
      this.type = type;
      this.color = color;
      this.rewards = rewards;
      this.harvesting = false;
    }
  
    update(hero) {
      const dx = this.x - hero.x;
      const dy = this.y - hero.y;
      const dist = Math.hypot(dx, dy);
  
      if (dist < this.size + hero.size) {
        this.harvesting = true;
      
        if (hero.stamina > 0 && this.hp > 0) {
          const dmg = hero.getHarvestPower() * 0.1;
          this.hp -= dmg;
          hero.reduceStamina(0.5);
        }
      
        if (this.hp <= 0) {
          this.die();
          if (this.rewards["Gold"]) {
            hero.gold += this.rewards["Gold"];
          }
        }
      
      
        
        const dmg = hero.getHarvestPower() * 0.1;
        this.hp -= dmg;
        if (this.hp <= 0) {
          this.die();
        }
      } else {
        this.harvesting = false;
      }
    }
  
    die() {
      document.getElementById("harvest-log").textContent = 
  `Harvested ${Object.keys(this.rewards).join(', ')}`;
      this.hp = 0;
      this.size = 0;
      this.rewards = {};
      for (const [key, val] of Object.entries(this.rewards)) {
        hero.inventory.add(key, val);
      }
      for (const [key, val] of Object.entries(this.rewards)) {
        hero.inventory.add(key, val);
        floatingTexts.push(new FloatingText(this.x, this.y, `${key} +${val}`));
      }
      
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
  
      // Health bar
      if (this.hp > 0 && this.hp < this.maxHp) {
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - 20, this.y - this.size - 10, 40 * (this.hp / this.maxHp), 4);
      }
    }
  }
  