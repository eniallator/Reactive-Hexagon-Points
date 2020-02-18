const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener(
  "resize",
  (resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  })
);

resize();

const sideLength = 50;
const paddingHexNum = 5;

const rippleMaxAge = 120;
const numOscillations = 15;
const force = 30;
const influenceRadius = 1000;

const updateTps = 10;
const drawTps = 60;

const horizontalMultiplier = Math.sin((2 * Math.PI) / 3);
const ripples = [];
const posMod = (a, b) => ((a % b) + b) % b;
const getHexGridPoint = point => ({
  x:
    (point.x + (posMod(point.y, 4) > 1) / 2) *
    sideLength *
    2 *
    horizontalMultiplier,
  y: (point.y - ~~(point.y / 2) / 2) * sideLength
});

const applyRipple = point => {
  const offset = ripples.reduce(
    (acc, curr) => {
      const hypotenuseSqr = (point.x - curr.x) ** 2 + (point.y - curr.y) ** 2;
      if (hypotenuseSqr >= influenceRadius ** 2) return acc;

      const hypotenuse = Math.sqrt(hypotenuseSqr);
      const normalDir = {
        x: (point.x - curr.x) / hypotenuse,
        y: (point.y - curr.y) / hypotenuse
      };
      const agePercent = curr.age / rippleMaxAge;
      const rippleOffsetMultiplier =
        force *
        (1 - hypotenuse / influenceRadius) *
        Math.sin(numOscillations * agePercent) *
        (1 - agePercent);

      return {
        x: acc.x + normalDir.x * rippleOffsetMultiplier,
        y: acc.y + normalDir.y * rippleOffsetMultiplier
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
ctx.lineWidth = 7;

function run() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (
    let i = -paddingHexNum;
    i < (canvas.height * 3) / (2 * sideLength) + paddingHexNum;
    i += 2
  ) {
    for (
      let j = -paddingHexNum;
      j < canvas.width / (sideLength * horizontalMultiplier) + paddingHexNum;
      j++
    ) {
      const offset = {
        x: 2 * (posMod(i, 4) <= 1) - 1,
        y: posMod(i, 2) * 2 - 1
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

  setTimeout(run, 1000 / drawTps);
}

run();

const plotRipplePoint = () => {
  const rect = canvas.getBoundingClientRect();
  ripples.push({
    x: mousePos.x - rect.left,
    y: mousePos.y - rect.top,
    age: 0
  });
};

let currInterval = null;
const mousePos = {
  x: 0,
  y: 0
};

canvas.addEventListener("mousemove", ev => {
  mousePos.x = ev.clientX;
  mousePos.y = ev.clientY;
});

canvas.onmousedown = () =>
  (currInterval = setInterval(plotRipplePoint, 1000 / updateTps));
canvas.onmouseup = () => clearInterval(currInterval);
canvas.onclick = () => plotRipplePoint();
