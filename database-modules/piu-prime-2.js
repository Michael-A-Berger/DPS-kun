// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:dancer:';
const songFile = `${__dirname}/../database/piu-prime-2.csv`;
const identities = ['piuprime2', 'prime2'];
const prime2Songs = [];
const searchParams = {};

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('Song artist name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.type = database.DefineSearchParam('\'?\' is the song\' type (Options: normal, remix, full, short)', '', ':?');
searchParams.version = database.DefineSearchParam('\'?\' is the update number when the song was added (ex; 1.00, 1.09, 2.02, etc.)', '', ':?');
searchParams.single = database.DefineSearchParam('Song must have a Single chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.double = database.DefineSearchParam(searchParams.single.description.replace('Single', 'Double'), 1);
searchParams.sperformance = database.DefineSearchParam(searchParams.single.description.replace('Single', 'Single Performance'), 1);
searchParams.dperformance = database.DefineSearchParam(searchParams.single.description.replace('Single', 'Double Performance'), 1);
searchParams.coop = database.DefineSearchParam('Song must have a Co-op chart (append \':#\' for number of players, \':~#\' for range)', 1);
searchParams.series = database.DefineSearchParam('The in-game subseries label the song has been given (ex; nx, fiesta, prime, etc.)', '', ':?');
searchParams.channel = database.DefineSearchParam('The in-game channel the song resides in (ex; original, world, xross, etc.)', '', ':?');
searchParams.exclusive = database.DefineSearchParam('The region the song is exclusive to (Options: philippines, latin)', '', ':?');

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
      songString = database.ParseStringFromCSV(fileString[num]);
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
  let songStr = `${header}\t**${song.name} (${song.type})**\t${database.ReverseEmoji(header)}`;
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
function search(searchJSON) {
  // Defining the returning array
  let songMatches = [];

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

// chartName()
function chartName(song, searchJSON) {
  //
  let name = '';

  // IF the coop search was defined, get the coop chart name
  if (searchJSON.coop) {
    if (Number.isNaN(searchJSON.coopTerm)) {
      name = 'Co-op';
    } else if (searchJSON.coopRange) {
      for (let num = -1; name.length < 1 && num < 2; num++) {
        if (song.coop.indexOf(searchJSON.coopTerm + num) > -1) {
          name = `Co-op x${(searchJSON.coopTerm + num)}`;
        }
      }
    } else {
      name = `Co-op x${searchJSON.coopTerm}`;
    }
  } else if (searchJSON.dperformance) {
    // ELSE IF the double performance search was defined, get the double performance chart name
    if (Number.isNaN(searchJSON.dperformanceTerm)) {
      name = 'Double Performance';
    } else if (searchJSON.dperformanceRange) {
      for (let num = -1; name.length < 1 && num < 2; num++) {
        if (song.dPerformance.indexOf(searchJSON.dperformanceTerm + num) > -1) {
          name = `DP${(searchJSON.dperformanceTerm + num)}`;
        }
      }
    } else {
      name = `DP${(searchJSON.dperformanceTerm)}`;
    }
  } else if (searchJSON.sperformance) {
    // ELSE IF the single performance search was defined, get the single performance chart name
    if (Number.isNaN(searchJSON.sperformanceTerm)) {
      name = 'Single Performance';
    } else if (searchJSON.sperformanceRange) {
      for (let num = -1; name.length < 1 && num < 2; num++) {
        if (song.sPerformance.indexOf(searchJSON.sperformanceTerm + num) > -1) {
          name = `SP${(searchJSON.sperformanceTerm + num)}`;
        }
      }
    } else {
      name = `SP${searchJSON.sperformanceTerm}`;
    }
  } else if (searchJSON.double) {
    // ELSE IF the double search was defined, get the double chart name
    if (Number.isNaN(searchJSON.doubleTerm)) {
      name = 'Double';
    } else if (searchJSON.doubleRange) {
      for (let num = -1; name.length < 1 && num < 2; num++) {
        if (song.doube.indexOf(searchJSON.doubleTerm + num) > -1) {
          name = `D${(searchJSON.doubleTerm + num)}`;
        }
      }
    } else {
      name = `D${searchJSON.doubleTerm}`;
    }
  } else if (searchJSON.single) {
    // ELSE IF the single search was defined, get the single chart name
    if (Number.isNaN(searchJSON.singleTerm)) {
      name = 'Single';
    } else if (searchJSON.singleRange) {
      for (let num = -1; name.length < 1 && num < 2; num++) {
        if (song.single.indexOf(searchJSON.singleTerm + num) > -1) {
          name = `S${(searchJSON.singleTerm + num)}`;
        }
      }
    } else {
      name = `S${searchJSON.singleTerm}`;
    }
  }

  //
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  //
  const otherProps = {};

  //
  if (searchJSON.bpm) {
    otherProps.BPM = song.bpm;
  }
  if (searchJSON.type) {
    otherProps.Type = song.type;
  }
  if (searchJSON.version) {
    otherProps.Version = song.version;
  }
  if (searchJSON.channel) {
    otherProps.Channel = song.channel;
  }
  if (searchJSON.exclusive) {
    otherProps.RegionExclusivity = song.exclusivity;
  }

  //
  return otherProps;
}

// sortCategory()
function sortCategory(song) {
  return `(Series: ${song.series})`;
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
  Header: header,
  Load: loadSongs,
  Songs: prime2Songs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpShort,
  Help2: helpFull,
};
