const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Simple animation loop
let x = 0;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#007bff";
  ctx.fillRect(x, 100, 50, 50);
  x = (x + 2) % canvas.width;
  requestAnimationFrame(draw);
}
draw();

