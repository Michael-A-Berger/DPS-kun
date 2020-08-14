// Modules
const database = require(`${__dirname}/../database.js`);

// Constant Variables
const databaseMods = database.Modules;
const resultsEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
const startTime = 6000 * (resultsEmoji.length + 2);
const continueTime = 10000;

// help()
function help() {
  const str = 'Proper Usage:\n```search [game] [params?]\n\n'
            + '- [game]     = The game database to search (\'support\' lists all supported games)\n'
            + '- [params?]  = The search parameters that the song must match (issue \'search [game] '
            + 'help\' to see options)```';
  return str;
}

// formatSearchPreview()
function formatSearchPreview(searchParams, results, start) {
  let str = `**Search Results** for \` ${searchParams} \``;
  for (let num = 0; num < resultsEmoji.length && start + num < results.length; num++) {
    str += `\n${resultsEmoji[num]} - **${results[start + num].name}**`
            + ` by ${results[start + num].artist}`;
  }
  str += `\n(**Page ${Math.floor(start / resultsEmoji.length) + 1}** of `
        + `${Math.ceil(results.length / resultsEmoji.length)})`;
  return str;
}

// addPreviewReacts()
function addPreviewReacts(sent, resultsLength, start) {
  for (let num = 0; num < resultsEmoji.length && num + start < resultsLength; num++) {
    sent.react(resultsEmoji[num]);
  }
  if (start >= resultsEmoji.length) {
    sent.react('🔼');
  }
  if (start < resultsLength - resultsEmoji.length) {
    sent.react('🔽');
  }
}

// searchDatabase()
function searchDatabase(message, chosenMod) {
  // Searching the database
  const searchResults = databaseMods[chosenMod].Search(message.content);

  // Defining the message variables
  let sentMsg;
  const reactOptions = { max: 1, time: startTime, errors: ['time'] };
  let arrayStart = 0;

  // Defining the initial starting message
  let str = `<@${message.author.id}> 's `;
  str += formatSearchPreview(message.content, searchResults, arrayStart);

  // Defining the dynamic Reaction Filter method
  const filter = (reaction, user) => (user.id === message.author.id);

  // Defining the dynamic Remove Reactions method
  const remove = () => {
    sentMsg.react('🚫');
  };

  // Defining the dynamic Reaction Processor method
  const processor = (collected) => {
    const react = collected.first();
    const index = resultsEmoji.indexOf(react.emoji.name);
    const pageDown = (react.emoji.name === '🔽');
    const pageUp = (react.emoji.name === '🔼');

    // IF the emoji is invalid, reset the reaction listener
    if (index === -1 && !pageDown && !pageUp) {
      reactOptions.time = continueTime;
      sentMsg.awaitReactions(filter, reactOptions).then(processor).catch(remove);
    } else if (pageDown) {
      // ELSE IF page down, delete the old message and show the next X search results
      arrayStart += resultsEmoji.length;
      reactOptions.time = startTime;
      sentMsg.delete().then(() => {
        str = `<@${message.author.id}> 's `;
        str += formatSearchPreview(message.content, searchResults, arrayStart);
        message.channel.send(str)
          .then((sent) => {
            sentMsg = sent;
            addPreviewReacts(sentMsg, searchResults.length, arrayStart);
            sentMsg.awaitReactions(filter, reactOptions)
              .then(processor)
              .catch(remove);
          });
      });
    } else if (pageUp) {
      // ELSE IF page up, delete the old message and show the previous X search results
      arrayStart -= resultsEmoji.length;
      reactOptions.time = startTime;
      sentMsg.delete().then(() => {
        str = `<@${message.author.id}> 's `;
        str += formatSearchPreview(message.content, searchResults, arrayStart);
        message.channel.send(str)
          .then((sent) => {
            sentMsg = sent;
            addPreviewReacts(sentMsg, searchResults.length, arrayStart);
            sentMsg.awaitReactions(filter, reactOptions)
              .then(processor)
              .catch(remove);
          });
      });
    } else {
      // ELSE... (a valid song was chosen, send the string-ified song to the channel)
      str = databaseMods[chosenMod].Format(searchResults[arrayStart + index]);
      message.channel.send(str);
    }
  };

  // IF the search results were larger than zero, show them
  if (searchResults.length > 0) {
    // Sending the initial message
    message.channel.send(str)
      // Adding the initial reactions
      .then((sent) => {
        sentMsg = sent;
        addPreviewReacts(sentMsg, searchResults.length, arrayStart);
        // Waiting for reactions
        sentMsg.awaitReactions(filter, reactOptions)
          .then(processor)
          .catch(remove); // Do nothing, just stop reacting
      });
  } else {
    // ELSE just send a message back saying that there were no results
    str = '\:open_file_folder: No songs could be found with those parameters! '
              + `Enter \` search ${databaseMods[chosenMod].CommandIdentities[0]} help \` `
              + 'to see the list of valid search options for this game.';
    message.channel.send(str);
  }
}

// search()
function search(message) {
  // Getting the first token of the command + its related module
  const firstToken = message.content.split(' ')[0];
  const chosenMod = database.IdentityToModuleName(firstToken);

  // IF support was requested, show the user the supported games
  if (firstToken === 'support') {
    message.channel.send(database.SupportedGames());
  } else if (chosenMod === undefined) {
    // ELSE IF the module was not found, show the help message
    message.channel.send(help());
  } else if (message.content.endsWith(' help')) {
    // ELSE IF the user just wants database search help (basic)
    let gameHelp = databaseMods[chosenMod].Help();
    gameHelp = gameHelp.replace(/<dps_cmd>/g, 'search');
    message.channel.send(gameHelp);
  } else if (message.content.endsWith(' help2')) {
    // ELSE IF the user just wants database search help (advanced)
    let gameHelp = databaseMods[chosenMod].Help2();
    gameHelp = gameHelp.replace(/<dps_cmd>/g, 'search');
    message.channel.send(gameHelp);
  } else {
    // ELSE just search the database
    searchDatabase(message, chosenMod);
  }
}

// Exported Command
module.exports.command = {
  keywords: ['srch', 'search'],
  description: 'Searches the database and returns info about the desired song.',
  author: 'Michael Berger',
  restricted: false,
  secret: false,
  action: search,
};
