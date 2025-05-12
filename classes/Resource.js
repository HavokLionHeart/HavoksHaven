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
      console.log(`+ ${this.type} rewards:`, this.rewards);
      this.hp = 0;
      this.size = 0;
      this.rewards = {};
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
  