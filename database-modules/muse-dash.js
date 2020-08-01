// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/muse-dash.csv`;
const msdsSongs = [];

// Newline Variable
const newlineChar = process.env.NEWLINE_CHAR;

/* ============================
 * ===== MODULE FUNCTIONS =====
 * ============================
 */

// loadSongs()
function loadSongs() {
  let fileString = fs.readFileSync(songFile, 'utf8');
  let songString = [];
  let counter = 0;
  let nextCommaPos = -1;

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      // Reading the song info string from the CSV
      songString = [];
      counter = 0;
      while (fileString[num].length > 0) {
        if (fileString[num].startsWith('"')) {
          nextCommaPos = fileString[num].indexOf('",');
          songString[counter] = fileString[num].substr(1, nextCommaPos - 1);
          fileString[num] = fileString[num].substr(nextCommaPos + 2);
        } else {
          nextCommaPos = fileString[num].indexOf(',');
          if (nextCommaPos > -1) {
            songString[counter] = fileString[num].substr(0, nextCommaPos);
            fileString[num] = fileString[num].substr(nextCommaPos + 1);
          } else {
            songString[counter] = fileString[num];
            fileString[num] = 0;
          }
        }
        counter++;
      }
      
      // Creating the song object
      msdsSongs[num - 1] = {
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

  console.log(`-- Muse Dash songs loaded! (Total: ${msdsSongs.length})`);
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `\:guitar:\:bear:\:violin:\t**${song.name}**\t\:violin:\:bear:\:guitar:`;
  songStr += `\n- Composed by **${song.artist}**`;
  songStr += `\n- Length: **${song.length}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Chart:';
  if (!Number.isNaN(song.easy)) {
    songStr += `\n\t\t**Easy (${song.easy})**`;
  }
  if (!Number.isNaN(song.hard)) {
    songStr += `\n\t\t**Hard (${song.hard})**`;
  }
  if (!Number.isNaN(song.master)) {
    songStr += `\n\t\t**Master (${song.master})**`;
  }
  if (!Number.isNaN(song.hidden)) {
    songStr += `\n\t\t**Hidden (${song.hidden})**`;
  }
  songStr += `\n- Song Pack: **${song.pack}**`;
  if (!Number.isNaN(song.unlockLevel)) {
    songStr += `\n- Unlock Level: **${song.unlockLevel}**`;
  }
  if (song.cover.length > 0) {
    songStr += `\n- Song Jacket: ${song.cover}`;
  }

  // Returning the formatted song string
  return songStr;
}

// search()
function search(paramString) {
  // Defining the returning array
  let songMatches = [];

  // Splitting up the parameter string
  const params = paramString.toLowerCase().split(' ');

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
  let currentParam = '';
  let colonPos = -1;
  let paramFound = false;
  for (let num = 0; num < params.length; num++) {
    // Getting the current parameter
    currentParam = params[num];
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

  // ==================================
  // ===== GETTING MATCHING SONGS =====
  // ==================================
  let criteriaMet = true;
  songMatches = msdsSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (exactName !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'name', exactName, nameToMatch);
    }

    // Artist
    if (exactArtist !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'artist', exactArtist, artistToMatch);
    }

    // BPM
    if (exactBpm !== undefined) {
      const matchBpm = parseInt(bpmToMatch.replace(/[^\d]/g, ''), 10);
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      criteriaMet = criteriaMet && database.SongIntCompare({ bpm: songBpm }, 'bpm', exactBpm, matchBpm, 10);
    }

    // Easy
    if (exactEasy !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'easy', exactEasy, easyToMatch, 1);
    }

    // Hard
    if (exactHard !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'hard', exactHard, hardToMatch, 1);
    }

    // Master
    if (exactMaster !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'master', exactMaster, masterToMatch, 1);
    }

    // Hidden
    if (exactHidden !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'hidden', exactHidden, hiddenToMatch, 1);
    }

    // Pack
    if (exactPack !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'pack', exactPack, packToMatch);
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// help()
function help() {
  const str = 'Proper Usage:\n```<dps_cmd> musedash [name:?] [artist:?] [bpm:?] [easy] [hard] '
              + '[master] [hidden] [pack:?]\n\n'
              + '- [name:?]    = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '- [bpm:#]     = Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '- [easy]      = Song must have an Easy difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hard]      = Song must have a Hard difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [master]    = Song must have a Master difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hidden]    = Song must have a Hidden difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [pack:?]    = Song must come from a pack whose name contains \'?\' (no spaces)\n'
              + '```';
  return str;
}

// Setting up the exports
module.exports = {
  ModuleName: 'MuseDash',
  FullGameName: 'Muse Dash',
  CommandIdentities: ['musedash', 'msds'],
  Load: loadSongs,
  Songs: msdsSongs,
  Format: format,
  Search: search,
  Help: help,
};
