const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

const colors = {
  background: '#141414',
  clock: '#4d4d4d',
  pink: '#d072b7',
  lime: '#d3f5a6',
};

const names = [
  'ogeronimo',
  '7infa',
  'Maaaudo',
  'soyBatu',
  'wasabimanu',
  'teknoduke',
  'slinero',
  'piisaa',
  'NicoNr',
  'Pratix',
  'Mabsurdo',
];

let currentNameIndex = 0;

setInterval(() => {
  currentNameIndex++;
  if (currentNameIndex >= names.length) {
    currentNameIndex = 0;
  }
}, 300);

const draw = () => {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = colors.pink;
  ctx.font = `32px Jost`;
  ctx.fillText('Gracias', 2, centerY);

  ctx.fillStyle = colors.lime;
  ctx.font = `800 32px Jost`;
  ctx.fillText(names[currentNameIndex], 110, centerY);

  window.requestAnimationFrame(draw);
};

const drawTextInCanvas = (text, fontSize, fontFamily, color) => {
  ctx.fillStyle = color;
  ctx.fillText(text, 0, fontSize);
};

window.requestAnimationFrame(draw);