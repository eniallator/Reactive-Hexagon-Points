const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sideLength = 50;

const horizontalMultiplier = Math.sin((2 * Math.PI) / 3);

ctx.strokeStyle = "white";

function run() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  for (let i = 0; i < (canvas.height * 3) / (2 * sideLength); i++) {
    for (
      let j = 0;
      j < canvas.width / (sideLength * horizontalMultiplier);
      j++
    ) {
      const point = {
        x: (j + (i % 4 > 1) / 2) * sideLength * 2 * horizontalMultiplier,
        y: (i - ~~(i / 2) / 2) * sideLength
      };
      ctx.fillRect(point.x, point.y, 5, 5);
    }
  }

  requestAnimationFrame(run);
}

run();
