// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/piu-prime-2.csv`;
const identities = ['piuprime2', 'prime2'];
const prime2Songs = [];

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
      prime2Songs[num - 1] = currentSong;
    }
  }

  console.log(`-- Pump It Up Prime 2 songs loaded! (Total: ${prime2Songs.length})`);
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `\:dancer:\t**${song.name} (${song.type})**\t\:dancer:`;
  songStr += `\n- Composed by **${song.artist}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Charts:';
  let mapped = [];
  if (!Number.isNaN(song.single[0])) {
    mapped = song.single.map((diff) => `**S${diff}**`);
    songStr += `\n\t\t${mapped.toString().replace(/,/g, ', ')}`;
  }
  if (!Number.isNaN(song.double[0])) {
    mapped = song.double.map((diff) => `**D${diff}**`);
    songStr += `\n\t\t${mapped.toString().replace(/,/g, ', ')}`;
  }
  if (!Number.isNaN(song.sPerformance[0])) {
    mapped = song.sPerformance.map((diff) => `**SP${diff}**`);
    songStr += `\n\t\t${mapped.toString().replace(/,/g, ', ')}`;
  }
  if (!Number.isNaN(song.dPerformance[0])) {
    mapped = song.dPerformance.map((diff) => `**DP${diff}**`);
    songStr += `\n\t\t${mapped.toString().replace(/,/g, ', ')}`;
  }
  if (!Number.isNaN(song.coop[0])) {
    songStr += `\n\t\t**Co-op x${song.coop[0]}**`;
  }
  songStr += `\n- Channel: **${song.channel}**`;
  songStr += `\n- Series: **${song.series}**`;
  songStr += `\n- Available since **v${song.version}**`;
  if (song.exclusivity.length > 0) {
    songStr += `\n(Only playable in **${song.exclusivity}** regions.)`;
  }

  // Returning the formatted song string
  return songStr;
}

// search()
function search(paramString) {
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
  songMatches = prime2Songs.filter((song) => {
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

    // Type
    if (exactType !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'type', exactType, typeToMatch);
    }

    // Single
    if (exactSingle !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.single.length; num++) {
        cumulative = cumulative || database.SongIntCompare(song.single, num, exactSingle, singleToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double
    if (exactDouble !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.double.length; num++) {
        cumulative = cumulative || database.SongIntCompare(song.double, num, exactDouble, doubleToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Single Performance
    if (exactSingleP !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.sPerformance.length; num++) {
        cumulative = cumulative || database.SongIntCompare(song.sPerformance, num, exactSingleP, sPerformanceToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double Performance
    if (exactDoubleP !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.dPerformance.length; num++) {
        cumulative = cumulative || database.SongIntCompare(song.dPerformance, num, exactDoubleP, dPerformanceToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Co-op
    if (exactCoop !== undefined) {
      let cumulative = false;
      for (let num = 0; !cumulative && num < song.coop.length; num++) {
        cumulative = cumulative || database.SongIntCompare(song.coop, num, exactCoop, coopToMatch, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Series
    if (exactSeries !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'series', exactSeries, seriesToMatch);
    }

    // Channel
    if (exactChannel !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'channel', exactChannel, channelToMatch);
    }

    // Exclusive
    if (exactExclusivity !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'exclusivity', exactExclusivity, exclusivityToMatch);
    }

    return criteriaMet;
  });

  // Returning the song matches
  return songMatches;
}

// help()
function help() {
  const str = `Proper Usage:\n\`\`\`<dps_cmd> ${identities[0]} [name:?] [artist:?] [type:?] `
              + '[single] [double] [series:?] [channel:?]\n\n'
              + '- [name:?]        = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]      = Song artist name contains \'?\' (no spaces)\n'
              + '- [type:?]        = \'?\' is the song\' type (Options: normal, remix, full, short)\n'
              + '- [single]        = Song must have a Single chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [double]        = Song must have a Double chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [series:?]      = \'?\' is the in-game subseries label the song has been given (ex; nx, fiesta, prime, etc.)\n'
              + '- [channel:?]     = \'?\' is the in-game channel the song resides in (ex; original, world, xross, etc.)\n'
              + `\`\`\`(Issue \` <dps_cmd> ${identities[0]} help2 \` for all options)`;
  return str;
}

// help2()
function help2() {
  const str = `Proper Usage:\n\`\`\`<dps_cmd> ${identities[0]} [name:?] [artist:?] [bpm:?] [type:?] `
              + '[version:?] [single] [double] [sperformance] [dperformance] [coop] [series:?] '
              + '[channel:?] [exclusive:?]\n\n'
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
  return str;
}

// Setting up the exports
module.exports = {
  ModuleName: 'PIUPrime2',
  FullGameName: 'Pump It Up Prime 2',
  CommandIdentities: identities,
  Load: loadSongs,
  Songs: prime2Songs,
  Format: format,
  Search: search,
  Help: help,
  Help2: help2,
};
