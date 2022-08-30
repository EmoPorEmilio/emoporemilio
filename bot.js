import tmi from 'tmi.js';
import environment from './environment.js';
import { TEXT_COMMANDS, REDES_COMMAND } from './text-commands.js';
import { creadores } from './creator-shoutouts.js';
import { htmlToText } from 'html-to-text';

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

  const parseEmotes = (message, emotes, emoteOnly) => {
    if (!emotes) return message;

    const emoteEntries = Object.entries(emotes);
    const onlyOneEmote =
      emoteEntries.length === 1 && emoteEntries[0][1].length === 1;
    const emoteSize = onlyOneEmote && emoteOnly ? '3.0' : '1.0';

    // store all emote keywords
    // ! you have to first scan through
    // the message string and replace later
    const stringReplacements = [];

    // iterate of emotes to access ids and positions
    emoteEntries.forEach(([id, positions]) => {
      // use only the first position to find out the emote key word
      const position = positions[0];
      const [start, end] = position.split('-');
      const stringToReplace = message.substring(
        parseInt(start, 10),
        parseInt(end, 10) + 1
      );

      stringReplacements.push({
        stringToReplace: stringToReplace,
        replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/${emoteSize}">`,
      });
    });

    // generate HTML and replace all emote keywords with image elements
    const messageHTML = stringReplacements.reduce(
      (acc, { stringToReplace, replacement }) => {
        // obs browser doesn't seam to know about replaceAll
        return acc.split(stringToReplace).join(replacement);
      },
      message
    );

    return messageHTML;
  };

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
    let command = commandInput.split(' ')[0];
    if (!checkListCommandAndReact(commandInput, target)) {
      let foundCommand = TEXT_COMMANDS.find((textCommand) =>
        sameCommand(textCommand.names, command)
      );
      foundCommand =
        foundCommand ||
        creadores.find((creador) => sameCommand(creador.name, command));
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
            io.emit('setTimer', { hours: firstNumber, minutes: secondNumber });
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
    //
    const emotesParsedMsg = parseEmotes(
      htmlToText(msg),
      context.emotes ?? {},
      context['emote-only']
    );
    io.emit('chatMessage', {
      msg: emotesParsedMsg,
      username: context['display-name'],
    });
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
