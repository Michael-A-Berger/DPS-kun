// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/piu-prime-2.csv`;
const identities = ['piuprime2', 'prime2'];
const prime2Songs = [];
const searchParams = {};

// Defining the search parameters
database.DefineSearchParam(searchParams, 'name', 'Song name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'artist', 'Song artist name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'bpm', 'Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
database.DefineSearchParam(searchParams, 'type', '\'?\' is the song\' type (Options: normal, remix, full, short)', '', ':?');
database.DefineSearchParam(searchParams, 'version', '\'?\' is the update number when the song was added (ex; 1.00, 1.09, 2.02, etc.)', '', ':?');
database.DefineSearchParam(searchParams, 'single', 'Song must have a Single chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
database.DefineSearchParam(searchParams, 'double', searchParams.single.description.replace('Single', 'Double'), 1);
database.DefineSearchParam(searchParams, 'sperformance', searchParams.single.description.replace('Single', 'Single Performance'), 1);
database.DefineSearchParam(searchParams, 'dperformance', searchParams.single.description.replace('Single', 'Double Performance'), 1);
database.DefineSearchParam(searchParams, 'coop', 'Song must have a Co-op chart (append \':#\' for number of players, \':~#\' for range)', 1);
database.DefineSearchParam(searchParams, 'series', 'The in-game subseries label the song has been given (ex; nx, fiesta, prime, etc.)', '', ':?');
database.DefineSearchParam(searchParams, 'channel', 'The in-game channel the song resides in (ex; original, world, xross, etc.)', '', ':?');
database.DefineSearchParam(searchParams, 'exclusive', 'The region the song is exclusive to (Options: philippines, latin)', '', ':?');

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

  // Parsing the parameter string to a JSON object
  const searchJSON = database.SearchTextToJSON(searchParams, paramString);

  // ==================================
  // ===== GETTING MATCHING SONGS =====
  // ==================================
  let criteriaMet = true;
  let test = false;
  let range = false;
  songMatches = prime2Songs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (searchJSON.name) {
      test = database.SongStringCompare2(song, 'name', searchJSON.nameTerm);
      criteriaMet = criteriaMet && test;
    }

    // Artist
    if (searchJSON.artist) {
      test = database.SongStringCompare2(song, 'artist', searchJSON.artistTerm);
      criteriaMet = criteriaMet && test;
    }

    // BPM
    if (searchJSON.bpm) {
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      range = searchJSON.bpmRange;
      test = database.SongIntCompare2({ bpm: songBpm }, 'bpm', searchJSON.bpmTerm, (range ? 10 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Type
    if (searchJSON.type) {
      test = database.SongStringCompare2(song, 'type', searchJSON.typeTerm);
      criteriaMet = criteriaMet && test;
    }

    // Single
    if (searchJSON.single) {
      let cumulative = false;
      range = searchJSON.singleRange;
      for (let num = 0; !cumulative && num < song.single.length; num++) {
        cumulative = cumulative || database.SongIntCompare2(song.single, num, searchJSON.singleTerm, (range ? 1 : 0));
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double
    if (searchJSON.double) {
      let cumulative = false;
      range = searchJSON.doubleRange;
      for (let num = 0; !cumulative && num < song.double.length; num++) {
        cumulative = cumulative || database.SongIntCompare2(song.double, num, searchJSON.doubleTerm, (range ? 1 : 0));
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Single Performance
    if (searchJSON.sperformance) {
      let cumulative = false;
      range = searchJSON.sperformanceRange;
      for (let num = 0; !cumulative && num < song.sPerformance.length; num++) {
        cumulative = cumulative || database.SongIntCompare2(song.sPerformance, num, searchJSON.sperformanceTerm, (range ? 1 : 0));
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Double Performance
    if (searchJSON.dperformance) {
      let cumulative = false;
      range = searchJSON.dperformanceRange;
      for (let num = 0; !cumulative && num < song.dPerformance.length; num++) {
        cumulative = cumulative || database.SongIntCompare2(song.dPerformance, num, searchJSON.dperformanceTerm, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Co-op
    if (searchJSON.coop) {
      let cumulative = false;
      range = searchJSON.coopRange;
      for (let num = 0; !cumulative && num < song.coop.length; num++) {
        cumulative = cumulative || database.SongIntCompare2(song.coop, num, searchJSON.coopTerm, 1);
      }
      criteriaMet = criteriaMet && cumulative;
    }

    // Series
    if (searchJSON.series) {
      test = database.SongStringCompare2(song, 'series', searchJSON.seriesTerm);
      criteriaMet = criteriaMet && test;
    }

    // Channel
    if (searchJSON.channel) {
      test = database.SongStringCompare2(song, 'channel', searchJSON.channelTerm);
      criteriaMet = criteriaMet && test;
    }

    // Exclusive
    if (searchJSON.exclusive) {
      test = database.SongStringCompare2(song, 'exclusivity', searchJSON.exclusiveTerm);
      criteriaMet = criteriaMet && test;
    }

    return criteriaMet;
  });

  // Returning the song matches
  return songMatches;
}

// help()
function helpShort() {
  const exclusions = [
    'bpm',
    'version',
    'sperformance',
    'dperformance',
    'coop',
    'exclusive',
  ];
  return database.HelpFromSearchParams(searchParams, identities[0], exclusions);
}

// help2()
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
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
  Help: helpShort,
  Help2: helpFull,
};
