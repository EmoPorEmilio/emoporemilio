import tmi from 'tmi.js';
import environment from './environment.js';
import { TEXT_COMMANDS, REDES_COMMAND } from './text-commands.js';

// Setup client

export const setupBot = (io) => {
  const opts = {
    identity: {
      username: environment.BOT_USERNAME,
      password: environment.OAUTH_TOKEN,
    },
    channels: [environment.CHANNEL_NAME],
  };

  let spamRedesInterval = null;

  const client = new tmi.client(opts);
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);
  client.connect();

  const sameCommand = (inputNames, command) => {
    let same = false;
    inputNames.forEach((input) => {
      same = same || input.toUpperCase().startsWith(command.toUpperCase());
    });
    return same;
  };

  const commandsList = () => {
    const reducer = (valorAnterior, valorActual, indice) => {
      if (indice === 0) {
        return `${valorAnterior} !${valorActual.name}`;
      } else {
        return `${valorAnterior}, !${valorActual.name}`;
      }
    };
    return TEXT_COMMANDS.reduce(reducer, 'Los comandos disponibles son:');
  };

  const checkListCommandAndReact = (commandInput, target) => {
    if (commandInput === 'comandos') {
      client.say(target, commandsList());
      console.log(`* Executed !commandos command`);
      return true;
    } else {
      return false;
    }
  };

  const checkCommandsAndReact = (commandInput, target, chatter) => {
    if (!checkListCommandAndReact(commandInput, target)) {
      const foundCommand = TEXT_COMMANDS.find((command) =>
        sameCommand(command.names, commandInput)
      );
      if (foundCommand) {
        if (
          foundCommand.name === 'reset' &&
          chatter.toUpperCase() === 'EMOPOREMILIO'
        ) {
          io.emit('reset', {});
        }
        if (
          foundCommand.name === 'setTimer' &&
          chatter.toUpperCase() === 'EMOPOREMILIO'
        ) {
          const numbersToSet = commandInput.split(' ')[1];
          const numbersSeparated = numbersToSet.split(':');
          const firstNumber = parseInt(numbersSeparated[0]);
          const secondNumber = parseInt(numbersSeparated[1]);
          if (numbersToSet) {
            io.emit('setTime', { hours: firstNumber, minutes: secondNumber });
          }
        }
        client.say(target, foundCommand.message);
        console.log(`* Executed !${foundCommand.name} command`);
      } else {
        console.log(`* Unknown command ${commandInput}`);
      }
    }
  };

  const saveUsernameHit = (username) => {
    //irAMongo
    //sumarle1alusuario
  };
  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
    if (self) {
      return;
    } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandInput = msg.trim();

    saveUsernameHit(context.username);

    // If message is a command and the command is known, let's execute it
    if (commandInput[0] === '!') {
      //console.log(commandInput.substring(1));
      checkCommandsAndReact(
        commandInput.substring(1),
        target,
        context.username
      );
    }
  }

  const spamRedes = () => {
    client.say(environment.CHANNEL_NAME, REDES_COMMAND.message);
  };

  const initSpamRedesInterval = () => {
    spamRedesInterval = setInterval(() => {
      spamRedes();
      //saveUsersToMongo();
    }, 60 * 60 * 1000);
  };

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    initSpamRedesInterval();
  }
};
