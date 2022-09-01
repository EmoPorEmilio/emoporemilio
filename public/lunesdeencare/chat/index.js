// web sockets
let socket = null;

const max_longevity_message_ms = 3 * 60 * 1000;
const messages = [];
let chatbox = null;

const deleteFirstMessage = () => {
  const message = messages.shift();

  requestAnimationFrame(() => {
    // second state
    message.HTML.style.animationName = 'fadeOut';
    message.HTML.style.opacity = 0;
    message.HTML.style.transform = 'scale(0)';
  });
  setTimeout(() => chatbox.removeChild(message.HTML), 1000);
};

const addMessageFromPreviousUserToList = (lastMessage, newMessage) => {
  const span = document.createElement('span');
  span.innerHTML = newMessage;
  lastMessage.msgElement.appendChild(span);

  clearTimeout(lastMessage.timeout);
  lastMessage.timeout = setTimeout(
    () => deleteFirstMessage(),
    max_longevity_message_ms
  );
};

const addMessageFromNewUserToList = (name, msgElement, messageHTML) => {
  messages.push({
    name: name,
    HTML: messageHTML,
    msgElement,
    timeout: setTimeout(() => deleteFirstMessage(), max_longevity_message_ms),
  });
};

const addMessage = (message, name) => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.name === name) {
    addMessageFromPreviousUserToList(lastMessage, message);
  } else {
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

    addMessageFromNewUserToList(name, msgElement, container);
    chatbox.prepend(container);
  }
  chatbox.scroll({ top: chatbox.scrollHeight, behavior: 'smooth' });
};

const init = () => {
  chatbox = document.getElementById('chatbox');
  socket = io();

  socket.on('chatMessage', (msg) => {
    addMessage(msg.msg, msg.username);
  });
};
