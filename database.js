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
        bpm: parseInt(songString[2], 10),
        difficulties: songString[3].split(' '),
        type: songString[4].toLowerCase(),
        date: songString[5],
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

/* ===============================
 * ===== SEARCHING FUNCTIONS =====
 * ===============================
 */

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

  // Returning the array of matching songs
  return songMatches;
}

/* ==========================
 * ===== HELP FUNCTIONS =====
 * ==========================
 */

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
  MuseDash: museDashSongs,
  PIUPrime2: piuPrime2Songs,
  GrooveCoasterPC: grooveCoasterPcSongs,
  // Search Functions
  SearchMuseDash: searchMuseDash,
  // Help Functions
  MuseDashHelp: museDashHelp,
};
