const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sideLength = 50;

const horizontalMultiplier = Math.sin((2 * Math.PI) / 3);
const minDim = Math.min(canvas.width, canvas.height);
const getPoint = (x, y) => ({
  x: (x + (y % 4 > 1) / 2) * sideLength * 2 * horizontalMultiplier,
  y: (y - ~~(y / 2) / 2) * sideLength
});

ctx.fillStyle = "black";
ctx.strokeStyle = "white";
ctx.lineWidth = minDim / 108;

function run() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < (canvas.height * 3) / (2 * sideLength); i += 2) {
    for (
      let j = 0;
      j < canvas.width / (sideLength * horizontalMultiplier);
      j++
    ) {
      const offset = {
        x: 2 * (i % 4 <= 1) - 1,
        y: (i % 2) * 2 - 1
      };
      const point = getPoint(j, i);
      const otherPointsArray = [
        getPoint(j - offset.x, i + offset.y),
        getPoint(j, i + offset.y),
        getPoint(j, i - offset.y)
      ];
      for (let other of otherPointsArray) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(run);
}

run();
