// Export Challenge
module.exports.challenge = {
  identities: ['msds', 'musedash'],
  title: 'Muse Dash',
  author: 'Michael Berger',
  load: loadSongsFile,
  get: getChallenge,
};

// Modules
const fs = require('fs');

// Constant Variables
const songsFile = './database/muse-dash.csv';

// Game Variables
const allSongs = [];

// Getting the appropriate newline character
const newlineChar = '\r\n'; // i still dont know

// printSong()
function printSong(song) {
  console.log(`=== ${song.name} ===`
              + `\nArtist:\t\t${song.artist}`
              + `\nLength:\t\t${song.length}`
              + `\nBPM:\t\t${song.bpm}`
              + `\nUnlockLevel:\t${song.unlockLevel}`
              + `\nEasy:\t\t${song.easy}`
              + `\nHard:\t\t${song.hard}`
              + `\nMaster:\t\t${song.master}`
              + `\nHidden:\t\t${song.hidden}`
              + `\nPack:\t\t${song.pack}`
              + `\nCover:\t\t${song.cover}\n`);
}

// loadSongsFile()
function loadSongsFile() {
  let fileString = fs.readFileSync(songsFile, 'utf8');

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      const songString = fileString[num].split(',');
      allSongs[num - 1] = {
        name: songString[0],
        artist: songString[1],
        length: songString[2],
        bpm: songString[3],
        unlockLevel: parseInt(songString[4], 10),
        easy: parseInt(songString[5], 10),
        hard: parseInt(songString[6], 10),
        master: parseInt(songString[7], 10),
        hidden: parseInt(songString[8], 10),
        pack: songString[9],
        cover: songString[10],
      };
    }
  }

  console.log('-- Muse Dash challenge file loaded!');
}

// helpMessage()
function helpMessage() {
  const help = 'Proper Usage:\n```challenge musedash [name:?] [artist:?] [bpm:?] [easy] [hard] '
              + '[master] [hidden] [pack:?]\n\n'
              + '[name:?]    = Song name contains \'?\' (no spaces)\n'
              + '[artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '[bpm:?]     = Song\'s BPM exactly matches \'?\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '[easy]      = Song must have an Easy difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[hard]      = Song must have a Hard difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[master]    = Song must have a Master difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[hidden]    = Song must have a Hidden difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[pack:?]    = Song must come from a pack whose name contains \'?\' (no spaces)\n'
              + '```';
  return help;
}

// getSong()
function getSong(message) {
  // Defining the return string + the song
  let returnString;
  let chosenSong;

  // =================================
  // ===== PARSING SONG CRITERIA =====
  // =================================

  // Defining the match variables
  let nameToMatch = '';
  let exactName;
  let artistToMatch = '';
  let exactArtist;
  let bpmToMatch = '';
  let exactBpm;
  let easyToMatch = NaN;
  let exactEasy;
  let hardToMatch = NaN;
  let exactHard;
  let masterToMatch = NaN;
  let exactMaster;
  let hiddenToMatch = NaN;
  let exactHidden;
  let packToMatch = '';
  let exactPack;

  // Processing the passed parameters
  const passedParams = message.content.toLowerCase().split(' ');
  let currentParam = '';
  let colonPos = -1;
  let paramFound = false;
  for (let num = 0; num < passedParams.length; num++) {
    // Getting the current parameter
    currentParam = passedParams[num];
    paramFound = false;

    // Name
    if (!paramFound && currentParam.startsWith('name')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactName = true;
        nameToMatch = currentParam.substr(colonPos + 1);
      } else { exactName = false; }
    }

    // Artist
    if (!paramFound && currentParam.startsWith('artist')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactArtist = true;
        artistToMatch = currentParam.substr(colonPos + 1);
      } else { exactArtist = false; }
    }

    // BPM
    if (!paramFound && currentParam.startsWith('bpm')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactBpm = true; } else { exactBpm = false; }
        bpmToMatch = currentParam.substr(colonPos + (exactBpm ? 1 : 2));
      } else { exactBpm = false; }
    }

    // Easy
    if (!paramFound && currentParam.startsWith('easy')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactEasy = true; } else { exactEasy = false; }
        easyToMatch = parseInt(currentParam.substr(colonPos + (exactEasy ? 1 : 2)), 10);
      } else { exactEasy = false; }
    }

    // Hard
    if (!paramFound && currentParam.startsWith('hard')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactHard = true; } else { exactHard = false; }
        hardToMatch = parseInt(currentParam.substr(colonPos + (exactHard ? 1 : 2)), 10);
      } else { exactHard = false; }
    }

    // Master
    if (!paramFound && currentParam.startsWith('master')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactMaster = true; } else { exactMaster = false; }
        masterToMatch = parseInt(currentParam.substr(colonPos + (exactMaster ? 1 : 2)), 10);
      } else { exactMaster = false; }
    }

    // Hidden
    if (!paramFound && currentParam.startsWith('hidden')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactHidden = true; } else { exactHidden = false; }
        hiddenToMatch = parseInt(currentParam.substr(colonPos + (exactHidden ? 1 : 2)), 10);
      } else { exactHidden = false; }
    }

    // Pack
    if (!paramFound && currentParam.startsWith('pack')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactPack = true;
        packToMatch = currentParam.substr(colonPos + 1);
      } else { exactPack = false; }
    }
  }

  // =================================
  // ===== GETTING MATCHING SONG =====
  // =================================
  let criteriaMet = true;
  const validSongs = allSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (exactName !== undefined) {
      if (exactName === true) {
        criteriaMet = criteriaMet && (song.name.toLowerCase().indexOf(nameToMatch) > -1);
      } else {
        criteriaMet = criteriaMet && (song.name.length > 0);
      }
    }

    // Artist
    if (exactArtist !== undefined) {
      if (exactArtist === true) {
        criteriaMet = criteriaMet && (song.artist.toLowerCase().indexOf(artistToMatch) > -1);
      } else {
        criteriaMet = criteriaMet && (song.artist.length > 0);
      }
    }

    // BPM
    if (exactBpm !== undefined) {
      const matchBpm = parseInt(bpmToMatch.replace(/[^\d]/g, ''), 10);
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      if (exactBpm === true) {
        criteriaMet = criteriaMet && (matchBpm === songBpm);
      } else {
        criteriaMet = criteriaMet && (matchBpm - 10 <= songBpm && matchBpm + 10 >= songBpm);
      }
    }

    // Easy
    if (exactEasy !== undefined) {
      if (!Number.isNaN(easyToMatch)) {
        if (exactEasy === true) {
          // Exact Match
          const test = (song.easy === easyToMatch);
          criteriaMet = criteriaMet && test;
        } else {
          // Range Match
          const test = (easyToMatch - 1 <= song.easy && easyToMatch + 1 >= song.easy);
          criteriaMet = criteriaMet && test;
        }
      } else {
        // Property Exists
        const test = !Number.isNaN(song.easy);
        criteriaMet = criteriaMet && test;
      }
    }

    // Hard
    if (exactHard !== undefined) {
      if (!Number.isNaN(hardToMatch)) {
        if (exactHard === true) {
          // Exact Match
          const test = (song.hard === hardToMatch);
          criteriaMet = criteriaMet && test;
        } else {
          // Range Match
          const test = (hardToMatch - 1 <= song.hard && hardToMatch + 1 >= song.hard);
          criteriaMet = criteriaMet && test;
        }
      } else {
        // Property Exists
        const test = !Number.isNaN(song.hard);
        criteriaMet = criteriaMet && test;
      }
    }

    // Master
    if (exactMaster !== undefined) {
      if (!Number.isNaN(masterToMatch)) {
        if (exactMaster === true) {
          // Exact Match
          const test = (song.master === masterToMatch);
          criteriaMet = criteriaMet && test;
        } else {
          // Range Match
          const test = (masterToMatch - 1 <= song.master && masterToMatch + 1 >= song.master);
          criteriaMet = criteriaMet && test;
        }
      } else {
        // Property Exists
        const test = !Number.isNaN(song.master);
        criteriaMet = criteriaMet && test;
      }
    }

    // Hidden
    if (exactHidden !== undefined) {
      if (!Number.isNaN(hiddenToMatch)) {
        if (exactHidden === true) {
          // Exact Match
          const test = (song.hidden === hiddenToMatch);
          criteriaMet = criteriaMet && test;
        } else {
          // Range Match
          const test = (hiddenToMatch - 1 <= song.hidden && hiddenToMatch + 1 >= song.hidden);
          criteriaMet = criteriaMet && test;
        }
      } else {
        // Property Exists
        const test = !Number.isNaN(song.hidden);
        criteriaMet = criteriaMet && test;
      }
    }

    // Pack
    if (exactPack !== undefined) {
      if (exactPack === true) {
        criteriaMet = criteriaMet && (song.pack.toLowerCase().indexOf(packToMatch) > -1);
      } else {
        criteriaMet = criteriaMet && (song.pack.length > 0);
      }
    }

    return criteriaMet;
  });

  // IF the valid songs array is longer than one song...
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:womans_hat: <@${message.author.id}> 's CHALLENGE \:womans_hat:\nPlay`;
    if (exactHidden !== undefined) {
      returnString += ` the **Hidden (${chosenSong.hidden})** chart of`;
    } else if (exactMaster !== undefined) {
      returnString += ` the **Master (${chosenSong.master})** chart of`;
    } else if (exactHard !== undefined) {
      returnString += ` the **Hard (${chosenSong.hard})** chart of`;
    } else if (exactEasy !== undefined) {
      returnString += ` the **Easy (${chosenSong.easy})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;
    if (exactBpm !== undefined) { returnString += ` (BPM: ${chosenSong.bpm})`; }
    returnString += `\n(Pack: ${chosenSong.pack})`;
  }

  // Returning the return string
  return returnString;
}

// getChallenge()
function getChallenge(message) {
  // Defining the return string + chosen song
  let stringToReturn;

  // Getting the help message if requested, otherwise pick a song
  if (message.content.toLowerCase() === 'help') {
    stringToReturn = helpMessage();
  } else {
    stringToReturn = getSong(message);
  }

  // IF the return string is not defined (search fail), send back the error message
  if (stringToReturn === undefined) {
    stringToReturn = '\:open_file_folder: No songs could be found with those restrictions! '
                    + 'Enter `challenge musedash help` to see the list of valid challenge '
                    + 'options for this game.';
  }

  // Returning the challenge string
  return stringToReturn;
}
