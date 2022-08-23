// web sockets
let socket = null;

const max_longevity_message_ms = 2 * 60 * 1000;
const messages = [];
let chatbox = null;

const addMessage = (message, name) => {
  // crear contenedor en base a esta data
  // appendear a chatbox
  const container = document.createElement('div');
  container.classList.add('container');
  const header = document.createElement('div');
  header.classList.add('header');
  const msgElement = document.createElement('div');
  msgElement.classList.add('message');
  const imgLogo = document.createElement('img');
  imgLogo.src = './logo.png';
  const imgIcons = document.createElement('img');
  imgIcons.src = './icons.png';
  const nameElement = document.createElement('div');
  nameElement.classList.add('name');
  nameElement.innerHTML = name;

  header.appendChild(imgLogo);
  header.appendChild(nameElement);
  header.appendChild(imgIcons);

  const span = document.createElement('span');
  msgElement.appendChild(span);
  container.appendChild(header);
  container.appendChild(msgElement);
  span.innerHTML = message;

  chatbox.prepend(container);
  chatbox.scroll({ top: chatbox.scrollHeight, behavior: 'smooth' });
};

const init = () => {
  chatbox = document.getElementById('chatbox');
  socket = io();

  socket.on('chatMessage', (msg) => {
    addMessage(msg.msg, msg.username);
  });
};
