var canvas = null;
var context = null;
var canvasRadius = 0;
class Circle {
  constructor(currentX, currentY, endX, endY, radius, style) {
    this.currentX = currentX;
    this.currentY = currentY;
    this.endX = endX;
    this.endY = endY;
    this.acceleration = 0;
    this.style = {
      strokeWidth: style?.strokeWidth ?? 0,
      innerShadowDistance: style?.innerShadowDistance ?? 0,
      gradientTop: style?.gradientTop ?? '#ffffff',
      gradientBot: style?.gradientBot ?? '#aaaaaa',
    };
    this.radius = radius;
  }
}

var pinkCircle = null;
var blueCircle = null;
var logoIMG = null;

const setup = () => {
  canvas = document.getElementById('mainCanvas');
  context = canvas.getContext('2d');
  //loadLogo();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasRadius = Math.min(canvas.width, canvas.height);
  let blueToPinkRelation = 292 / 348;
  let pinkRadius = canvasRadius / 6;
  let blueRadius = blueToPinkRelation * pinkRadius;
  let pinkToRightFromblueCenterOffsetRelation = 175 / 292;
  let pinkCenterOffsetInPX =
    blueRadius * pinkToRightFromblueCenterOffsetRelation;

  let logoWidth = pinkRadius + blueRadius - pinkCenterOffsetInPX;
  let logoLeftMargin = (canvas.width - logoWidth) / 2;
  let blueCenter = logoLeftMargin + blueRadius;
  let pinkCenter = blueCenter + blueRadius + pinkRadius - pinkCenterOffsetInPX;

  pinkCircle = new Circle(
    pinkCenter,
    0,
    canvas.width / 2 + pinkCenterOffsetInPX,
    canvas.height / 2,
    pinkRadius,
    {
      strokeWidth: 10,
      innerShadowDistance: 7,
      gradientTop: '#DF5C9A',
      gradientBot: '#ad3a72',
    }
  );
  blueCircle = new Circle(
    canvas.width / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    blueRadius,
    {
      strokeWidth: 10,
      innerShadowDistance: 7,
      gradientTop: '#87c8ea',
      gradientBot: '#5c91ac',
    }
  );
  requestAnimationFrame(drawLoop);
};

const loadLogo = () => {
  logoIMG = new Image();
  logoIMG.onload = () => {
    console.log(logoIMG.height);
  };
  logoIMG.src = './resources/logoLetras.png';
};

const drawLoop = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  //context.drawImage(logoIMG, 0, 0);
  drawCircle(blueCircle);
  drawCircle(pinkCircle);
  drawArrayCircles();
  requestAnimationFrame(drawLoop);
};

const drawArrayCircles = () => {};

const drawCircle = (circle) => {
  circle.acceleration = circle.acceleration + 2;
  if (Math.abs(circle.currentY - circle.endY) < 10) {
    circle.currentY = circle.endY;
  } else {
    circle.currentY += circle.acceleration;
  }

  const {
    currentX,
    currentY,
    radius,
    acceleration,
    style: { innerShadowDistance, strokeWidth, gradientBot, gradientTop },
  } = circle;

  context.fillStyle = '#141414';
  context.beginPath();
  context.arc(currentX, currentY, radius + strokeWidth, 0, 2 * Math.PI);
  context.fill();

  context.fillStyle = '#ffffff';
  context.beginPath();
  context.arc(currentX, currentY, radius, 0, 2 * Math.PI);
  context.fill();

  var grd = context.createLinearGradient(
    currentX,
    currentY - radius,
    currentX,
    currentY + radius
  );
  grd.addColorStop(0, gradientTop);
  grd.addColorStop(1, gradientBot);

  context.fillStyle = grd;
  context.beginPath();
  context.ellipse(
    currentX,
    currentY,
    radius,
    radius - innerShadowDistance,
    Math.PI,
    0,
    Math.PI
  );
  context.arc(currentX, currentY, radius, 0 * Math.PI, 1 * Math.PI);
  context.fill();
};
