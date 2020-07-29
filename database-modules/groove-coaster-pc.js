// Modules
const fs = require('fs');
const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/groove-coaster-pc.csv`;
const gcpcSongs = [];

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

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      gcpcSongs[num - 1] = {
        name: songString[0],
        artist: songString[1],
        bpm: songString[2],
        simple: parseInt(songString[3], 10),
        normal: parseInt(songString[4], 10),
        hard: parseInt(songString[5], 10),
        extra: parseInt(songString[6], 10),
        type: songString[7],
        date: songString[8],
      };
    }
  }

  console.log(`-- Groove Coaster PC songs loaded! (Total: ${gcpcSongs.length})`);
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
  let simpleToMatch = NaN;
  let exactSimple;
  let normalToMatch = NaN;
  let exactNormal;
  let hardToMatch = NaN;
  let exactHard;
  let extraToMatch = NaN;
  let exactExtra;

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

    // Simple
    if (!paramFound && currentParam.startsWith('simple')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSimple = true; } else { exactSimple = false; }
        simpleToMatch = parseInt(currentParam.substr(colonPos + (exactSimple ? 1 : 2)), 10);
      } else { exactSimple = false; }
    }

    // Normal
    if (!paramFound && currentParam.startsWith('normal')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactNormal = true; } else { exactNormal = false; }
        normalToMatch = parseInt(currentParam.substr(colonPos + (exactNormal ? 1 : 2)), 10);
      } else { exactNormal = false; }
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

    // Extra
    if (!paramFound && currentParam.startsWith('extra')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactExtra = true; } else { exactExtra = false; }
        extraToMatch = parseInt(currentParam.substr(colonPos + (exactExtra ? 1 : 2)), 10);
      } else { exactExtra = false; }
    }
  }

  // ==================================
  // ===== GETTING MATCHING SONGS =====
  // ==================================
  let criteriaMet = true;
  songMatches = gcpcSongs.filter((song) => {
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

    // Simple
    if (exactSimple !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'simple', exactSimple, simpleToMatch, 1);
    }

    // Normal
    if (exactNormal !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'normal', exactNormal, normalToMatch, 1);
    }

    // Hard
    if (exactHard !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'hard', exactHard, hardToMatch, 1);
    }

    // Extra
    if (exactExtra !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'extra', exactExtra, extraToMatch, 1);
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// help()
function help() {
  const str = 'Proper Usage:\n```<dps_cmd> groovecoasterpc [name:?] [artist:?] [bpm:?] [simple] '
              + '[normal] [hard] [extra]\n\n'
              + '- [name:?]    = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '- [bpm:#]     = Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '- [simple]    = Song must have a Simple difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [normal]    = Song must have a Normal difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hard]      = Song must have a Hard difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [extra]     = Song must have an Extra difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '```';
  return str;
}

// Setting up the exports
module.exports = {
  ModuleName: 'GrooveCoasterPC',
  Load: loadSongs,
  Songs: gcpcSongs,
  Search: search,
  Help: help,
};
