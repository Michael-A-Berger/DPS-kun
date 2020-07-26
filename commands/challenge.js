// Modules
const database = require(`${__dirname}/../database.js`);
let piuPrime2 = require(`${__dirname}/challenge-files/piu-prime-2.js`);
piuPrime2 = piuPrime2.challenge;

// Constant Variables
const gcpcIdentities = ['groovecoasterpc', 'gcpc'];
const museDashIdentities = ['musedash', 'msds'];
const piuPrime2Identities = ['piuprime2', 'prime2'];

// supportedGames()
function supportedGames() {
  const gcpcString = gcpcIdentities.toString().replace(',', ', ');
  const msdsString = museDashIdentities.toString().replace(',', ', ');
  const prime2String = piuPrime2Identities.toString().replace(',', ', ');
  const support = `${'Supported Games:\n```'
                  + 'Groove Coaster PC:    ['}${gcpcString}]\n`
                  + `Muse Dash:            [${msdsString}]\n`
                  + `Pump It Up Prime 2:   [${prime2String}]\n`
                  + '```';
  return support;
}

// grooveCoasterPCChallenge()
function grooveCoasterPcChallenge(message) {
  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    let helpWithGimmick = database.GrooveCoasterPCHelp();
    helpWithGimmick = helpWithGimmick.substring(0, helpWithGimmick.length - 3);
    helpWithGimmick = helpWithGimmick.replace('[extra]\n\n', '[extra] [gimmick]\n\n');
    helpWithGimmick += '[gimmick]   = Adds a gameplay modifier to the challenge\n```';
    returnString = helpWithGimmick;
  } else {
    validSongs = database.SearchGrooveCoasterPC(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:headphones: <@${message.author.id}> 's CHALLENGE \:headphones:\nPlay`;
    if (message.content.toLowerCase().indexOf(' extra') > -1) {
      returnString += ` the **Extra (${chosenSong.extra})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' hard') > -1) {
      returnString += ` the **Hard (${chosenSong.hard})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' normal') > -1) {
      returnString += ` the **Normal (${chosenSong.normal})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' simple') > -1) {
      returnString += ` the **Simple (${chosenSong.simple})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;
    if (message.content.toLowerCase().indexOf(' bpm') > -1) { returnString += ` (BPM: ${chosenSong.bpm})`; }
    if (message.content.toLowerCase().indexOf(' gimmick') > -1) {
      returnString += `\n(Gimmick: Use the **${(Math.random() * 2 > 1 ? 'NO INFO' : 'JUST')}** item.)`;
    }
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + 'Enter `challenge groovecoasterpc help` to see the list of valid challenge '
                  + 'options for this game.';
  }

  // Returning the return string
  return returnString;
}

// museDashChallenge()
function museDashChallenge(message) {
  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    returnString = database.MuseDashHelp();
  } else {
    validSongs = database.SearchMuseDash(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:womans_hat: <@${message.author.id}> 's CHALLENGE \:womans_hat:\nPlay`;
    if (message.content.toLowerCase().indexOf(' hidden') > -1) {
      returnString += ` the **Hidden (${chosenSong.hidden})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' master') > -1) {
      returnString += ` the **Master (${chosenSong.master})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' hard') > -1) {
      returnString += ` the **Hard (${chosenSong.hard})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' easy') > -1) {
      returnString += ` the **Easy (${chosenSong.easy})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;
    if (message.content.toLowerCase().indexOf(' bpm') > -1) { returnString += ` (BPM: ${chosenSong.bpm})`; }
    returnString += `\n(Pack: ${chosenSong.pack})`;
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + 'Enter `challenge musedash help` to see the list of valid challenge '
                  + 'options for this game.';
  }

  // Returning the return string
  return returnString;
}

// piuPrime2Challenge()
function piuPrime2Challenge(message) {
  piuPrime2.load();
  return piuPrime2.get(message);
}

// challenge()
function challenge(message) {
  let found = false;
  let stringToPrint = '';

  // Groove Coaster PC
  for (let num = 0; !found && num < gcpcIdentities.length; num++) {
    if (message.content.startsWith(gcpcIdentities[num])) {
      stringToPrint = grooveCoasterPcChallenge(message);
      found = true;
    }
  }

  // Muse Dash
  for (let num = 0; !found && num < museDashIdentities.length; num++) {
    if (message.content.startsWith(museDashIdentities[num])) {
      stringToPrint = museDashChallenge(message);
      found = true;
    }
  }

  // PIU Prime 2
  for (let num = 0; !found && num < piuPrime2Identities.length; num++) {
    if (message.content.startsWith(piuPrime2Identities[num])) {
      stringToPrint = piuPrime2Challenge(message);
      found = true;
    }
  }

  // List of Supported Games
  if (message.content === 'support') {
    stringToPrint = supportedGames();
    found = true;
  }

  if (!found) {
    stringToPrint = 'Proper Usage:\n```challenge [game] [criteria?]\n\n'
                    + "[game]       = The game to choose the chart from ('support' lists all supported games)\n"
                    + "[criteria?]  = Restricts chosen song to certain criteria (issue 'challenge [game] "
                    + "help' to see options)```";
  }

  message.channel.send(stringToPrint);
}

// Exported Command
module.exports.command = {
  keywords: ['chll', 'challenge'],
  description: 'Issues a challenge for the user to overcome (for fun)',
  author: 'Michael Berger',
  restricted: false,
  secret: false,
  action: challenge,
};
