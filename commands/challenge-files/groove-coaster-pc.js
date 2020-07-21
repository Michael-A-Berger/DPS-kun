// Modules
const database = require(`${__dirname}/../../database.js`);

// Constant Variables
const songTypes = ['base',
  'unlock',
  'timed',
  'paid',
  'dlc-only',
  'free',
  'all'];
const diffNames = ['simple',
  'normal',
  'hard',
  'extra'];

// Game Variables
let allSongs = [];

// printSong()
function printSong(song) {
  let diffs = '';
  for (let num = 0; num < song.difficulties.length; num++) { diffs += song.difficulties[num] + (num + 1 < song.difficulties.length ? ', ' : ''); }

  console.log(`==${song.name}==\nArtist:\t\t${song.artist
  }\nBPM:\t\t${song.bpm}\nDiffs:\t\t${diffs
  }\nType:\t\t${song.type}\nDate:\t\t${song.date
  }\n`);
}

// loadSongsFile()
function loadSongsFile() {
  allSongs = database.GrooveCoasterPC;
}

// getChallenge()
function getChallenge(message) {
  let stringToReturn = '';

  const validSongs = [];
  let diffRange = false;
  let diffName = false;
  const diffLevels = [];
  let validTypes = [];
  validTypes.push(songTypes[0]);
  let gimmick = false;

  const options = message.content.toLowerCase().split(' ');

  // Getting the options
  for (let num = 0; num < options.length && stringToReturn === ''; num++) {
    // Getting the difficulty
    if (num === 0) {
      switch (diffNames.indexOf(options[0])) {
        case 0: // Simple
          diffName = true;
          diffLevels.push(0);
          break;
        case 1: // Normal
          diffName = true;
          diffLevels.push(1);
          break;
        case 2: // Hard
          diffName = true;
          diffLevels.push(2);
          break;
        case 3: // Extra
          diffName = true;
          diffLevels.push(3);
          break;
        default: // (Not a name, should be a number)
          if (options[0].startsWith('~')) {
            diffRange = true;
            options[0] = options[0].substring(1);
          }

          const baseDiff = parseInt(options[0], 10);

          if (!Number.isNaN(baseDiff)) {
            if (diffRange) {
              for (let n = baseDiff - 1; n < baseDiff + 2; n++) { diffLevels.push(n.toString()); }
            } else { diffLevels.push(baseDiff.toString()); }
          } else {
            stringToReturn = '\:warning: You entered an invalid difficulty rating! Type `chll '
                        + 'gcpc help` to see the range of valid difficulties.';
          }
          break;
      }
    } else {
      // Getting the song types
      if (songTypes.includes(options[num])) {
        switch (songTypes.indexOf(options[num])) {
          case 1: // Unlockable songs
            validTypes = ['unlock'];
            break;
          case 2: // Timed Free DLC
            validTypes = ['timed'];
            break;
          case 3: // Paid DLC
            validTypes = ['paid'];
            break;
          case 4: // DLC Only songs
            validTypes = ['timed', 'paid'];
            break;
          case 5: // Free (base, unlocked, + timed) songs
            validTypes = ['base', 'unlock', 'timed'];
            break;
          case 6: // All songs
            console.log('all songs');
            validTypes = ['base', 'unlock', 'timed', 'paid'];
            break;
          default:
          // Do nothing, it's the "base" type
            break;
        }
      }

      // Getting whether there's a gimmick
      if (options[num].includes('gimmick')) { gimmick = true; }
    }
  }

  // Getitng the valid songs
  for (let songNum = 0; songNum < allSongs.length; songNum++) {
    let canAdd = true;

    // Validating the song difficulty
    if (diffName && allSongs[songNum].difficulties.length <= diffLevels[0]) { canAdd = false; } else if (!diffName) {
      for (let num = 0; num < diffLevels.length; num++) {
        if (!allSongs[songNum].difficulties.includes(diffLevels[num])) { canAdd = false; } else {
          canAdd = true;
          break;
        }
      }
    }

    // Validating the song type
    if (!validTypes.includes(allSongs[songNum].type)) { canAdd = false; }

    // Adding the song (if it meets the options)
    if (canAdd) { validSongs[validSongs.length] = allSongs[songNum]; }
  }

  // Choosing a valid song
  if (validSongs.length > 0) {
    stringToReturn = `\:headphones: <@${message.author.id}> 's CHALLENGE \:headphones:\n`;

    const chosenSong = validSongs[Math.floor(Math.random() * validSongs.length)];
    let chosenDiff = -1;
    let chosenDiffRank = '';

    if (diffName) { chosenDiff = chosenSong.difficulties[diffLevels[0]]; } else if (diffRange) {
      while (!diffLevels.includes(chosenDiff)) { chosenDiff = chosenSong.difficulties[Math.floor(Math.random() * chosenSong.difficulties.length)]; }
    } else { chosenDiff = diffLevels[0]; }

    switch (chosenSong.difficulties.indexOf(chosenDiff)) {
      case 0:
        chosenDiffRank = 'Simple';
        break;
      case 1:
        chosenDiffRank = 'Normal';
        break;
      case 2:
        chosenDiffRank = 'Hard';
        break;
      case 3:
        chosenDiffRank = 'Extra';
        break;
      default:
        chosenDiffRank = "yo wtf this shouldn't happen";
        console.log(chosenDiff);
        break;
    }

    stringToReturn += `Play **${chosenSong.name}** (by ${chosenSong.artist}) on ${
      chosenDiffRank}`;

    if (gimmick) { stringToReturn += ` using a ${Math.random() * 2 > 1 ? 'NO INFO' : 'JUST'} item`; }

    stringToReturn += `!\n(Rating: ${chosenDiff}${gimmick ? '+)' : ')'}`;
  } else if (stringToReturn === '') {
    stringToReturn = '\:open_file_folder: No songs could be found with those restrictions! '
        + 'Enter `chll gcpc help` to see the list of valid challenge options for this game.';
  }

  if (message.content === 'help' || stringToReturn === '') {
    stringToReturn = 'Proper Usage:\n```challenge groovecoasterpc [difficulty] [type?] [gimmick?]\n\n'
                            + '[diffficulty]   = The chart level to retrieve (Format: ## | ~## | simple | normal | hard | extra)\n'
                            + '[type?]         = Includes/Excludes songs by type (Format: base | unlock | timed | paid | dlc-only | free | all)\n'
                            + '[gimmick?]      = Adds a gimmick to the challenge (Format: gimmick)```';
  }

  return stringToReturn;
}

// Exports
module.exports.challenge = {
  identities: ['gcpc', 'groovecoasterpc'],
  title: 'Groove Coaster PC',
  author: 'Michael Berger',
  load: loadSongsFile,
  get: getChallenge,
};
