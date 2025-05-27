export default class FloatingText {
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
  