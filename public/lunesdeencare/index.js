// web sockets
let socket = io();

socket.on('reset', (msg) => {
  resetTimer(0);
});

const colors = {
  background: '#141414',
  clock: '#4d4d4d',
  pink: '#d072b7',
  darkpink: '#985686',
  lime: '#d3f5a6',
  work: '#a35757',
  rest: '#619e65',
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const centerXClock = centerX;
const centerYClock = 270;
const radius = 250;

const maxTimeMs = 2 * 60 * 60 * 1000;
let startTimeMs = new Date().getTime();
let elapsedTimeMs = 0;

const stages = [
  { endPoint: 1 / 12, type: 'rest' },
  { endPoint: 5 / 12, type: 'work' },
  { endPoint: 7 / 12, type: 'rest' },
  { endPoint: 11 / 12, type: 'work' },
  { endPoint: 12 / 12, type: 'rest' },
];
let currentStage = 0;

let intervalTime = setInterval(() => {
  if (elapsedTimeMs < maxTimeMs) {
    elapsedTimeMs = new Date().getTime() - startTimeMs;
  } else {
    resetTimer();
  }
}, 50);

const resetTimer = () => {
  startTimeMs = new Date().getTime();
  elapsedTimeMs = 0;
};

const stageColor = (stage) => {
  return colors[stage.type];
};

const previousStartPoint = (index) => {
  if (index === 0) {
    return 0;
  } else {
    return stages[index - 1].endPoint;
  }
};

const getCurrentStage = () =>
  stages.find(
    (stage, index) =>
      !(elapsedTimeMs / maxTimeMs >= stage.endPoint) &&
      elapsedTimeMs / maxTimeMs >= previousStartPoint(index)
  );

const drawStageFillColor = (stage, index) => {
  ctx.fillStyle = stageColor(stage);
  const firstPoint = { x: centerXClock, y: centerYClock };
  ctx.beginPath();
  ctx.moveTo(firstPoint.x, firstPoint.y);

  if (elapsedTimeMs / maxTimeMs >= stage.endPoint) {
    ctx.globalAlpha = 0.33;
    ctx.arc(
      centerXClock,
      centerYClock,
      radius,
      -Math.PI / 2 + previousStartPoint(index) * 2 * Math.PI,
      -Math.PI / 2 + stage.endPoint * 2 * Math.PI
    );
  } else if (elapsedTimeMs / maxTimeMs >= previousStartPoint(index)) {
    ctx.arc(
      centerXClock,
      centerYClock,
      radius,
      -Math.PI / 2 + previousStartPoint(index) * 2 * Math.PI,
      -Math.PI / 2 + (elapsedTimeMs / maxTimeMs) * 2 * Math.PI
    );
  }

  ctx.fill();

  //reset changes in opacity after using it
  ctx.globalAlpha = 1;
};

const drawStaticElements = () => {
  ctx.fillStyle = colors.clock;

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
  ctx.fill();

  /*
  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(
    width / 2 - radius * Math.sin(0 - Math.PI + (1 / 12) * 2 * Math.PI),
    height / 2 + radius * Math.cos(0 - Math.PI + (1 / 12) * 2 * Math.PI)
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(
    width / 2 - radius * Math.sin(0 - Math.PI + (5 / 12) * 2 * Math.PI),
    height / 2 + radius * Math.cos(0 - Math.PI + (5 / 12) * 2 * Math.PI)
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(
    width / 2 - radius * Math.sin(0 - Math.PI + (7 / 12) * 2 * Math.PI),
    height / 2 + radius * Math.cos(0 - Math.PI + (7 / 12) * 2 * Math.PI)
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(
    width / 2 - radius * Math.sin(0 - Math.PI + (11 / 12) * 2 * Math.PI),
    height / 2 + radius * Math.cos(0 - Math.PI + (11 / 12) * 2 * Math.PI)
  );
  ctx.stroke();*/
};

const drawDynamicElements = () => {
  stages.forEach(drawStageFillColor);
  ctx.globalAlpha = 1;
  const currentAngle = (2 * Math.PI) / (maxTimeMs / elapsedTimeMs);

  ctx.fillStyle = colors.pink;
  ctx.strokeStyle = colors.pink;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(
    width / 2,
    height / 2,
    radius,
    -Math.PI / 2,
    currentAngle - Math.PI / 2
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    width / 2 - radius * Math.sin(currentAngle - Math.PI),
    height / 2 + radius * Math.cos(currentAngle - Math.PI),
    20,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, width, height);
};

const drawLegendText = () => {
  const stage = getCurrentStage();
  ctx.fillStyle = colors.darkpink;
  ctx.font = ` 400 45px Jost`;
  ctx.textAlign = 'center';
  if (stage) {
    ctx.fillStyle = stageColor(stage);
    ctx.font = `800 45px Jost`;
    ctx.fillText(stage.type === 'work' ? 'Trabajo' : 'Descanso', centerX, 730);
  }
  const hours = Math.floor(elapsedTimeMs / 1000 / 60 / 60)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((elapsedTimeMs / 1000 / 60) % 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor((elapsedTimeMs / 1000) % 60)
    .toString()
    .padStart(2, '0');
  ctx.fillText(`${hours}:${mins}:${secs}`, centerX, 680);
};

const drawElements = () => {
  drawStaticElements();
  drawDynamicElements();
  drawLegendText();
};

const draw = () => {
  clearCanvas();
  drawElements();
  window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
