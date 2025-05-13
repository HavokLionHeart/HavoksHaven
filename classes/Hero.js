export default class Hero {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 20;
      this.speed = 2;
      this.target = { x, y };
      this.strength = 5;
      this.harvestingSkill = 3;
      this.toolPower = 2;
      this.stamina = 100;
      this.staminaMax = 100;

    }
  
    setTarget(x, y) {
      this.target = { x, y };
    }
  
    update() {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > this.speed) {
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
      }
    }
  
    getHarvestPower() {
      return this.toolPower + this.strength + this.harvestingSkill;
    }
  
    draw(ctx) {
      ctx.fillStyle = "deepskyblue";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    reduceStamina(amount) {
      this.stamina = Math.max(0, this.stamina - amount);
    }
    
    recoverStamina(amount) {
      this.stamina = Math.min(this.staminaMax, this.stamina + amount);
    }
    
  }
  