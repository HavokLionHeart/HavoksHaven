export default class MadCowInn {
    constructor(x, y, range = 50) {
      this.x = x;
      this.y = y;
      this.range = range;
    }
  
    isHeroInside(hero) {
      const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
      return dist < this.range;
    }
  
    draw(ctx) {
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
      ctx.fillStyle = "#000";
      ctx.font = "10px sans-serif";
      ctx.fillText("Inn", this.x - 10, this.y - 15);
    }
  }
  