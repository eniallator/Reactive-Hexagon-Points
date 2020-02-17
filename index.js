const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sideLength = 50;
const rippleMaxAge = 120;
const numOscillations = 5;
const force = 30;
const influenceRadius = 500;

const horizontalMultiplier = Math.sin((2 * Math.PI) / 3);
const minDim = Math.min(canvas.width, canvas.height);
const ripples = [];
const getHexGridPoint = point => ({
  x: (point.x + (point.y % 4 > 1) / 2) * sideLength * 2 * horizontalMultiplier,
  y: (point.y - ~~(point.y / 2) / 2) * sideLength
});

const applyRipple = point => {
  const offset = ripples.reduce(
    (acc, curr) => {
      const hypotenuseSqr = (point.x - curr.x) ** 2 + (point.y - curr.y) ** 2;
      const hypotenuse = Math.sqrt(hypotenuseSqr);
      if (hypotenuseSqr >= influenceRadius ** 2) return acc;
      return {
        x:
          acc.x +
          force *
            (1 - hypotenuse / influenceRadius) *
            Math.sin((numOscillations * curr.age) / rippleMaxAge),
        y:
          acc.y +
          force *
            (1 - hypotenuse / influenceRadius) *
            Math.cos((numOscillations * curr.age) / rippleMaxAge)
      };
    },
    { x: 0, y: 0 }
  );
  return {
    x: point.x + offset.x,
    y: point.y + offset.y
  };
};
const getPoint = (x, y) => applyRipple(getHexGridPoint({ x, y }));

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

  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i];
    ripple.age++;
    if (ripple.age > rippleMaxAge) {
      ripples.shift(i, 1);
    }
  }

  setTimeout(run, 1000 / 60);
}

run();

canvas.onclick = ev => {
  ripples.push({
    x: ev.clientX,
    y: ev.clientY,
    age: 0
  });
};
