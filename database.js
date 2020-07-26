// Modules
const fs = require('fs');

// Game Files
const grooveCoasterPcFile = './database/groove-coaster-pc.csv';
const museDashFile = './database/muse-dash.csv';
const piuPrime2File = './database/piu-prime-2.csv';

// Song Arrays
const grooveCoasterPcSongs = [];
const museDashSongs = [];
const piuPrime2Songs = [];

// Constant Variables
const newlineChar = '\r\n';

/* ==================================
 * ===== SONG LOADING FUNCTIONS =====
 * ==================================
 */

// loadGrooveCoasterPC()
function loadGrooveCoasterPC() {
  let fileString = fs.readFileSync(grooveCoasterPcFile, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      grooveCoasterPcSongs[num - 1] = {
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

  console.log('-- Groove Coaster PC songs loaded!');
}

// loadMuseDash()
function loadMuseDash() {
  let fileString = fs.readFileSync(museDashFile, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      museDashSongs[num - 1] = {
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

  console.log('-- Muse Dash songs loaded!');
}

// loadPiuPrime2()
function loadPiuPrime2() {
  let fileString = fs.readFileSync(piuPrime2File, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      piuPrime2Songs[num - 1] = {
        type: songString[0],
        bpm: +songString[1],
        artist: songString[2],
        name: songString[3],
        version: songString[4],
        charts: songString[5].split(' '),
        unlocks: songString[6].split(' '),
        series: songString[7],
        channel: songString[8],
      };
    }
  }

  console.log('-- Pump It Up Prime 2 songs loaded!');
}

/* =================================
 * ===== SEARCH HELP FUNCTIONS =====
 * =================================
 */

// songStringCompare()
function songStringCompare(song, property, exact, matchPhrase) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF we're looking for an exact match...
    if (exact) {
      // Checking if the matching phrase exists in the string
      result = (song[property].toLowerCase().indexOf(matchPhrase) > -1);
    } else {
      // ELSE just check if the property exists and is NOT undefined
      result = (song[property] !== undefined);
    }
  }

  // Returning the result
  return result;
}

// songIntCompare()
function songIntCompare(song, property, exact, matchNum, range) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF the passed matching number is defined...
    if (!Number.isNaN(matchNum)) {
      // IF we're looking for an exact match...
      if (exact) {
        // Checking if the property is the same as the matching number
        result = (song[property] === matchNum);
      } else {
        // ELSE check if the property is within the specified range
        result = (matchNum - range <= song[property] && matchNum + range >= song[property]);
      }
    } else {
      // ELSE just check if the property exists and is a number
      result = !Number.isNaN(song[property]);
    }
  }

  // Returning the result
  return result;
}

/* ===============================
 * ===== SEARCHING FUNCTIONS =====
 * ===============================
 */

// searchGrooveCoasterPC()
function searchGrooveCoasterPC(paramString) {
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
  songMatches = grooveCoasterPcSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (exactName !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'name', exactName, nameToMatch);
    }

    // Artist
    if (exactArtist !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'artist', exactArtist, artistToMatch);
    }

    // BPM
    if (exactBpm !== undefined) {
      const matchBpm = parseInt(bpmToMatch.replace(/[^\d]/g, ''), 10);
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      criteriaMet = criteriaMet && songIntCompare({ bpm: songBpm }, 'bpm', exactBpm, matchBpm, 10);
    }

    // Simple
    if (exactSimple !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'simple', exactSimple, simpleToMatch, 1);
    }

    // Normal
    if (exactNormal !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'normal', exactNormal, normalToMatch, 1);
    }

    // Hard
    if (exactHard !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'hard', exactHard, hardToMatch, 1);
    }

    // Extra
    if (exactExtra !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'extra', exactExtra, extraToMatch, 1);
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// searchMuseDash()
function searchMuseDash(paramString) {
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
  songMatches = museDashSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (exactName !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'name', exactName, nameToMatch);
    }

    // Artist
    if (exactArtist !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'artist', exactArtist, artistToMatch);
    }

    // BPM
    if (exactBpm !== undefined) {
      const matchBpm = parseInt(bpmToMatch.replace(/[^\d]/g, ''), 10);
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      criteriaMet = criteriaMet && songIntCompare({ bpm: songBpm }, 'bpm', exactBpm, matchBpm, 10);
    }

    // Easy
    if (exactEasy !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'easy', exactEasy, easyToMatch, 1);
    }

    // Hard
    if (exactHard !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'hard', exactHard, hardToMatch, 1);
    }

    // Master
    if (exactMaster !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'master', exactMaster, masterToMatch, 1);
    }

    // Hidden
    if (exactHidden !== undefined) {
      criteriaMet = criteriaMet && songIntCompare(song, 'hidden', exactHidden, hiddenToMatch, 1);
    }

    // Pack
    if (exactPack !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'pack', exactPack, packToMatch);
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

/* ==========================
 * ===== HELP FUNCTIONS =====
 * ==========================
 */

// grooveCoasterPCHelp()
function grooveCoasterPCHelp() {
  const help = 'Proper Usage:\n```challenge groovecoasterpc [name:?] [artist:?] [bpm:?] [simple] '
              + '[normal] [hard] [extra]\n\n'
              + '[name:?]    = Song name contains \'?\' (no spaces)\n'
              + '[artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '[bpm:?]     = Song\'s BPM exactly matches \'?\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '[simple]    = Song must have a Simple difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[normal]    = Song must have a Normal difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[hard]      = Song must have a Hard difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '[extra]     = Song must have an Extra difficulty chart (append \':?\' for exact difficulty, \':~?\' for range)\n'
              + '```';
  return help;
}

// museDashHelp()
function museDashHelp() {
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

/* =============================
 * ===== GENERIC FUNCTIONS =====
 * =============================
 */
// loadSongs()
function loadSongs() {
  // Loading the song CSVs
  loadGrooveCoasterPC();
  loadMuseDash();
  loadPiuPrime2();
}

// Setting up the exports
module.exports = {
  LoadSongs: loadSongs,
  // Song Arrays
  GrooveCoasterPC: grooveCoasterPcSongs,
  MuseDash: museDashSongs,
  PIUPrime2: piuPrime2Songs,
  // Search Functions
  SearchGrooveCoasterPC: searchGrooveCoasterPC,
  SearchMuseDash: searchMuseDash,
  // Help Functions
  GrooveCoasterPCHelp: grooveCoasterPCHelp,
  MuseDashHelp: museDashHelp,
};
