// Exported Command
module.exports.command = {
  keywords: ['chll', 'challenge'],
  description: 'Issues a challenge for the user to overcome (for fun)',
  author: 'Michael Berger',
  restricted: false,
  secret: false,
  action: challenge,
};

// Modules
const fs = require('fs');

// Constant Variables
const filesLocation = `${__dirname}/challenge-files`;

// Command Variables
const games = [];

// loadChallengeFiles()
function LoadChallengeFiles() {
  console.log('-- Loading the challenge files...');
  let counter = 0;
  fs.readdirSync(filesLocation).forEach((file) => {
    if (file.endsWith('.js')) {
      const challengeFile = require(`${filesLocation}/${file}`);
      challengeFile.challenge.load();
      games[counter] = challengeFile.challenge;
      counter++;
    }
  });
}
LoadChallengeFiles();

// challenge()
function challenge(message) {
  let found = false;
  let stringToPrint = '';

  for (var num = 0; num < games.length && !found; num++) {
    for (var n = 0; n < games[num].identities.length && !found; n++) {
      if (message.content.startsWith(games[num].identities[n])) {
        message.content = message.content.replace(games[num].identities[n], '').trim();
        console.log(`-- [${message.content}]`);

        stringToPrint = games[num].get(message);

        found = true;
      }
    }
  }

  if (message.content === 'support') {
    stringToPrint += 'Supported Games:\n```';
    for (var num = 0; num < games.length; num++) {
      stringToPrint += `${games[num].title}     [`;
      for (var n = 0; n < games[num].identities.length; n++) { stringToPrint += games[num].identities[n] + (n + 1 < games[num].identities.length ? ', ' : ']\n'); }
    }
    stringToPrint += '```';

    found = true;
  }

  if (!found) {
    stringToPrint = 'Proper Usage:\n```challenge [game] [level] [gimmick?]\n\n'
						+ "[game]       = The game to choose the chart from ('support' lists all supported "
						+ 'games)\n'
						+ "[level]      = The difficulty of the chart ('~' increases dificulty range by 1)\n"
						+ "[gimmick?]   = Enables/specifies gameplay modifiers (issue 'challenge [game] "
						+ "help' to see options)```";
  }

  message.channel.send(stringToPrint);
}
