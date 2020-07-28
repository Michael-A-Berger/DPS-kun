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
  let currentSong;

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      currentSong = {
        type: songString[0],
        bpm: songString[1],
        artist: songString[2],
        name: songString[3],
        version: parseFloat(songString[4]),
        single: songString[5].split(' '),
        double: songString[6].split(' '),
        sPerformance: songString[7].split(' '),
        dPerformance: songString[8].split(' '),
        coop: songString[9].split(' '),
        series: songString[10],
        channel: songString[11],
        exclusivity: songString[12],
      };
      for (let s = 0; s < currentSong.single.length; s++) {
        currentSong.single[s] = parseInt(currentSong.single[s], 10);
      }
      for (let d = 0; d < currentSong.double.length; d++) {
        currentSong.double[d] = parseInt(currentSong.double[d], 10);
      }
      for (let sp = 0; sp < currentSong.sPerformance.length; sp++) {
        currentSong.sPerformance[sp] = parseInt(currentSong.sPerformance[sp], 10);
      }
      for (let dp = 0; dp < currentSong.sPerformance.length; dp++) {
        currentSong.dPerformance[dp] = parseInt(currentSong.dPerformance[dp], 10);
      }
      for (let c = 0; c < currentSong.coop.length; c++) {
        currentSong.coop[c] = parseInt(currentSong.coop[c], 10);
      }

      // Assigning the current song to the array
      piuPrime2Songs[num - 1] = currentSong;
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

// searchPiuPrime2()
function searchPiuPrime2(paramString) {
  // Defining the returning array
  let songMatches = [];

  // Splitting up the parameters
  const params = paramString.toLowerCase().split(' ');

  /* =================================
   * ===== PARSING SONG CRITERIA =====
   * =================================
   */

  // Defining the match variables
  let nameToMatch = '';
  let exactName;
  let artistToMatch = '';
  let exactArtist;
  let bpmToMatch = '';
  let exactBpm;
  let typeToMatch = '';
  let exactType;
  let singleToMatch = NaN;
  let exactSingle;
  let doubleToMatch = NaN;
  let exactDouble;
  let sPerformanceToMatch = NaN;
  let exactSingleP;
  let dPerformanceToMatch = NaN;
  let exactDoubleP;
  let coopToMatch = NaN;
  let exactCoop;
  let seriesToMatch = '';
  let exactSeries;
  let channelToMatch = '';
  let exactChannel;
  let exclusivityToMatch = '';
  let exactExclusivity;

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

    // Type
    if (!paramFound && currentParam.startsWith('type')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactType = true;
        typeToMatch = currentParam.substr(colonPos + 1);
      } else { exactType = false; }
    }

    // Single
    if (!paramFound && currentParam.startsWith('single')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSingle = true; } else { exactSingle = false; }
        singleToMatch = parseInt(currentParam.substr(colonPos + (exactSingle ? 1 : 2)), 10);
      } else { exactSingle = false; }
    }

    // Double
    if (!paramFound && currentParam.startsWith('double')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactDouble = true; } else { exactDouble = false; }
        doubleToMatch = parseInt(currentParam.substr(colonPos + (exactDouble ? 1 : 2)), 10);
      } else { exactDouble = false; }
    }

    // Single Performance
    if (!paramFound && currentParam.startsWith('sperformance')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSingleP = true; } else { exactSingleP = false; }
        sPerformanceToMatch = parseInt(currentParam.substr(colonPos + (exactSingleP ? 1 : 2)), 10);
      } else { exactSingleP = false; }
    }

    // Double Performance
    if (!paramFound && currentParam.startsWith('dperformance')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactDoubleP = true; } else { exactDoubleP = false; }
        dPerformanceToMatch = parseInt(currentParam.substr(colonPos + (exactDoubleP ? 1 : 2)), 10);
      } else { exactDoubleP = false; }
    }

    // Co-op
    if (!paramFound && currentParam.startsWith('coop')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactCoop = true; } else { exactCoop = false; }
        coopToMatch = parseInt(currentParam.substr(colonPos + (exactCoop ? 1 : 2)), 10);
      } else { exactCoop = false; }
    }

    // Series
    if (!paramFound && currentParam.startsWith('series')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactSeries = true;
        seriesToMatch = currentParam.substr(colonPos + 1);
      } else { exactSeries = false; }
    }

    // Channel
    if (!paramFound && currentParam.startsWith('channel')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactChannel = true;
        channelToMatch = currentParam.substr(colonPos + 1);
      } else { exactChannel = false; }
    }

    // Region
    if (!paramFound && currentParam.startsWith('exclusive')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactExclusivity = true;
        exclusivityToMatch = currentParam.substr(colonPos + 1);
      } else { exactExclusivity = false; }
    }
  }

  // ==================================
  // ===== GETTING MATCHING SONGS =====
  // ==================================
  let criteriaMet = true;
  songMatches = piuPrime2Songs.filter((song) => {
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

    // Type
    if (exactType !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'type', exactType, typeToMatch);
    }

    // Single
    if (exactSingle !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.single.length; num++) {
        cumulative = cumulative || songIntCompare(song.single, num, exactSingle, singleToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double
    if (exactDouble !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.double.length; num++) {
        cumulative = cumulative || songIntCompare(song.double, num, exactDouble, doubleToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Single Performance
    if (exactSingleP !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.sPerformance.length; num++) {
        cumulative = cumulative || songIntCompare(song.sPerformance, num, exactSingleP, sPerformanceToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double Performance
    if (exactDoubleP !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.dPerformance.length; num++) {
        cumulative = cumulative || songIntCompare(song.dPerformance, num, exactDoubleP, dPerformanceToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Co-op
    if (exactCoop !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.coop.length; num++) {
        cumulative = cumulative || songIntCompare(song.coop, num, exactCoop, coopToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Series
    if (exactSeries !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'series', exactSeries, seriesToMatch);
    }

    // Channel
    if (exactChannel !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'channel', exactChannel, channelToMatch);
    }

    // Exclusive
    if (exactExclusivity !== undefined) {
      criteriaMet = criteriaMet && songStringCompare(song, 'exclusivity', exactExclusivity, exclusivityToMatch);
    }

    return criteriaMet;
  });

  // Returning the song matches
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
              + '- [name:?]    = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '- [bpm:#]     = Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '- [simple]    = Song must have a Simple difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [normal]    = Song must have a Normal difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hard]      = Song must have a Hard difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [extra]     = Song must have an Extra difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '```';
  return help;
}

// museDashHelp()
function museDashHelp() {
  const help = 'Proper Usage:\n```challenge musedash [name:?] [artist:?] [bpm:?] [easy] [hard] '
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
  return help;
}

// piuPrime2Help()
function piuPrime2Help() {
  const help = 'Proper Usage:\n```challenge piuprime2 [name:?] [artist:?] [bpm:?] [type:?] '
              + '- [version:?] [single] [double] [sperformance] [dperformance] [coop] [series:?] '
              + '- [channel:?] [exclusive:?]\n\n'
              + '- [name:?]        = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]      = Song artist name contains \'?\' (no spaces)\n'
              + '- [bpm:#]         = Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '- [type:?]        = \'?\' is the song\' type (Options: normal, remix, full, short)\n'
              + '- [version:?]     = \'?\' is the update number when the song was added (ex; 1.00, 1.09, 2.02, etc.)\n'
              + '- [single]        = Song must have a Single chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [double]        = Song must have a Double chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [sperformance]  = Song must have a Single Performance chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [dperformance]  = Song must have a Double Performance chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [coop]          = Song must have a Co-op chart (append \':#\' for number of players, \':~#\' for range)\n'
              + '- [series:?]      = \'?\' is the in-game subseries label the song has been given (ex; nx, fiesta, prime, etc.)\n'
              + '- [channel:?]     = \'?\' is the in-game channel the song resides in (ex; original, world, xross, etc.)\n'
              + '- [exclusive:?]   = \'?\' is the region the song is exclusive to (Options: philippines, latin)\n'
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
  SearchPIUPrime2: searchPiuPrime2,
  // Help Functions
  GrooveCoasterPCHelp: grooveCoasterPCHelp,
  MuseDashHelp: museDashHelp,
  PIUPrime2Help: piuPrime2Help,
};
