// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:crown:\:skull:';
const songFile = `${__dirname}/../database/djmax-respect.csv`;
const identities = ['djmaxrespect', 'respect', 'djmr'];
const djmrSongs = [];
const searchParams = {};

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.composer = database.DefineSearchParam('Song composer name contains \'?\' (no spaces)', '', ':?');
searchParams.vocalist = database.DefineSearchParam('Song vocalist name contains \'?\' (no spaces)', '', ':?');
searchParams.genre = database.DefineSearchParam('Song genre name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams['4bnm'] = database.DefineSearchParam('Song must have a 4B Normal chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams['4bhd'] = database.DefineSearchParam('Song must have a 4B Hard chart', 1);
searchParams['4bmx'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '4B Maximum'), 1);
searchParams['4bsc'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '4B SC'), 1);
searchParams['5bnm'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '5B Normal'), 1);
searchParams['5bhd'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '5B Hard'), 1);
searchParams['5bmx'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '5B Maximum'), 1);
searchParams['5bsc'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '5B SC'), 1);
searchParams['6bnm'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '6B Normal'), 1);
searchParams['6bhd'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '6B Hard'), 1);
searchParams['6bmx'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '6B Maximum'), 1);
searchParams['6bsc'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('4B Hard', '6B SC'), 1);
searchParams['8bnm'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('a 4B Hard', 'an 8B Normal'), 1);
searchParams['8bhd'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('a 4B Hard', 'an 8B Hard'), 1);
searchParams['8bmx'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('a 4B Hard', 'an 8B Maximum'), 1);
searchParams['8bsc'] = database.DefineSearchParam(searchParams['4bhd'].description.replace('a 4B Hard', 'an 8B SC'), 1);
searchParams.pack = database.DefineSearchParam('The DLC pack the song released in (ex; base, trilogy, clazziquai, technika, etc.)', '', ':?');
searchParams.channel = database.DefineSearchParam('The Freestyle channel the song is sorted under (ex; respect, portable, collaboration, etc.)', '', ':?');
searchParams.ps4 = database.DefineSearchParam('Returns songs playable on the PS4 version');
searchParams.steam = database.DefineSearchParam('Returns songs playable on the Steam version');
searchParams.free = database.DefineSearchParam('Returns songs that are free (via unlocks or game updates)');

// Defining the song properties
const songProps = [
  /* 00 */ 'pack',
  /* 01 */ 'channel',
  /* 02 */ 'name',
  /* 03 */ 'bpm',
  /* 04 */ 'artist',
  /* 05 */ 'vocalist',
  /* 06 */ 'genre',
  /* 07 */ 'normal4b',
  /* 08 */ 'hard4b',
  /* 09 */ 'maximum4b',
  /* 10 */ 'sc4b',
  /* 11 */ 'normal5b',
  /* 12 */ 'hard5b',
  /* 13 */ 'maximum5b',
  /* 14 */ 'sc5b',
  /* 15 */ 'normal6b',
  /* 16 */ 'hard6b',
  /* 17 */ 'maximum6b',
  /* 18 */ 'sc6b',
  /* 19 */ 'normal8b',
  /* 20 */ 'hard8b',
  /* 21 */ 'maximum8b',
  /* 22 */ 'sc8b',
  /* 23 */ 'exclusivity',
];

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

  // Defining the int parsing indexes
  const intParseStart = songProps.indexOf('normal4b');
  const intParseEnd = songProps.indexOf('sc8b');

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      // Reading the song info string from the CSV
      songString = database.ParseStringFromCSV(fileString[num]);

      // Creating the song object
      const tempSong = {};
      for (let propNum = 0; propNum < songProps.length; propNum++) {
        if (intParseStart <= propNum && propNum <= intParseEnd) {
          tempSong[songProps[propNum]] = parseInt(songString[propNum], 10);
        } else {
          let newProp = songString[propNum].split(database.NoCommaInParenthesesRegex);
          if (newProp.length === 1) [newProp] = newProp;
          tempSong[songProps[propNum]] = newProp;
        }
      }
      djmrSongs[num - 1] = tempSong;
    }
  }

  console.log(`-- DJMax Respect songs loaded! (Total: ${djmrSongs.length})`);
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `${header}\t**${song.name}**\t${database.ReverseEmoji(header)}`;
  songStr += `\n- Composed by ${database.FormatArrayForString(song.artist)}`;
  if (song.vocalist.length > 0) {
    songStr += `\n- Vocalist: ${database.FormatArrayForString(song.vocalist)}`;
  }
  if (song.genre.length > 0) {
    songStr += `\n- Genre: **${song.genre}**`;
  }
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Charts:';

  // Four Button
  if (!Number.isNaN(song.normal4b)) {
    songStr += `\n\t\t**4B Normal (${song.normal4b})**`;
  }
  if (!Number.isNaN(song.hard4b)) {
    songStr += `\n\t\t**4B Hard (${song.hard4b})**`;
  }
  if (!Number.isNaN(song.maximum4b)) {
    songStr += `\n\t\t**4B Maximum (${song.maximum4b})**`;
  }
  if (!Number.isNaN(song.sc4b)) {
    songStr += `\n\t\t**4B SC (${song.sc4b})**`;
  }

  // Five Button
  if (!Number.isNaN(song.normal5b)) {
    songStr += `\n\t\t**5B Normal (${song.normal5b})**`;
  }
  if (!Number.isNaN(song.hard5b)) {
    songStr += `\n\t\t**5B Hard (${song.hard5b})**`;
  }
  if (!Number.isNaN(song.maximum5b)) {
    songStr += `\n\t\t**5B Maximum (${song.maximum5b})**`;
  }
  if (!Number.isNaN(song.sc5b)) {
    songStr += `\n\t\t**5B SC (${song.sc5b})**`;
  }

  // Six Button
  if (!Number.isNaN(song.normal6b)) {
    songStr += `\n\t\t**6B Normal (${song.normal6b})**`;
  }
  if (!Number.isNaN(song.hard6b)) {
    songStr += `\n\t\t**6B Hard (${song.hard6b})**`;
  }
  if (!Number.isNaN(song.maximum6b)) {
    songStr += `\n\t\t**6B Maximum (${song.maximum6b})**`;
  }
  if (!Number.isNaN(song.sc6b)) {
    songStr += `\n\t\t**6B SC (${song.sc6b})**`;
  }

  // Eight Button
  if (!Number.isNaN(song.normal8b)) {
    songStr += `\n\t\t**8B Normal (${song.normal8b})**`;
  }
  if (!Number.isNaN(song.hard8b)) {
    songStr += `\n\t\t**8B Hard (${song.hard8b})**`;
  }
  if (!Number.isNaN(song.maximum8b)) {
    songStr += `\n\t\t**8B Maximum (${song.maximum8b})**`;
  }
  if (!Number.isNaN(song.sc8b)) {
    songStr += `\n\t\t**8B SC (${song.sc8b})**`;
  }

  //
  songStr += `\n- Song Pack: **${song.pack}**`;
  songStr += `\n- Freestyle Channel: **${song.channel}**`;
  if (song.exclusivity.length > 0) {
    songStr += `\n(Currently exclusive to the **${song.exclusivity}** release.)`;
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
  songMatches = djmrSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (searchJSON.name) {
      test = database.SongStringCompare2(song, 'name', searchJSON.nameTerm);
      criteriaMet = criteriaMet && test;
    }

    // Artist
    if (searchJSON.composer) {
      test = database.SongStringCompare2(song, 'artist', searchJSON.composerTerm);
      criteriaMet = criteriaMet && test;
    }

    // Vocalist
    if (searchJSON.vocalist) {
      test = database.SongStringCompare2(song, 'vocaist', searchJSON.vocalistTerm);
      criteriaMet = criteriaMet && test;
    }

    // Genre
    if (searchJSON.genre) {
      test = database.SongStringCompare2(song, 'genre', searchJSON.genreTerm);
      criteriaMet = criteriaMet && test;
    }

    // BPM
    if (searchJSON.bpm) {
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      range = searchJSON.bpmRange;
      test = database.SongIntCompare2({ bpm: songBpm }, 'bpm', searchJSON.bpmTerm, (range ? 10 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Four Buttons
    if (searchJSON['4bnm']) {
      range = searchJSON['4bnmRange'];
      test = database.SongIntCompare2(song, 'normal4b', searchJSON['4bnmTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['4bhd']) {
      range = searchJSON['4bhdRange'];
      test = database.SongIntCompare2(song, 'hard4b', searchJSON['4bhdTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['4bmx']) {
      range = searchJSON['4bmxRange'];
      test = database.SongIntCompare2(song, 'maximum4b', searchJSON['4bmxTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['4bsc']) {
      range = searchJSON['4bscRange'];
      test = database.SongIntCompare2(song, 'sc4b', searchJSON['4bscTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Five Buttons
    if (searchJSON['5bnm']) {
      range = searchJSON['5bnmRange'];
      test = database.SongIntCompare2(song, 'normal5b', searchJSON['5bnmTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['5bhd']) {
      range = searchJSON['5bhdRange'];
      test = database.SongIntCompare2(song, 'hard5b', searchJSON['5bhdTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['5bmx']) {
      range = searchJSON['5bmxRange'];
      test = database.SongIntCompare2(song, 'maximum5b', searchJSON['5bmxTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['5bsc']) {
      range = searchJSON['5bscRange'];
      test = database.SongIntCompare2(song, 'sc5b', searchJSON['5bscTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Six Buttons
    if (searchJSON['6bnm']) {
      range = searchJSON['6bnmRange'];
      test = database.SongIntCompare2(song, 'normal6b', searchJSON['6bnmTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['6bhd']) {
      range = searchJSON['6bhdRange'];
      test = database.SongIntCompare2(song, 'hard6b', searchJSON['6bhdTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['6bmx']) {
      range = searchJSON['6bmxRange'];
      test = database.SongIntCompare2(song, 'maximum6b', searchJSON['6bmxTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['6bsc']) {
      range = searchJSON['6bscRange'];
      test = database.SongIntCompare2(song, 'sc6b', searchJSON['6bscTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Eight Button
    if (searchJSON['8bnm']) {
      range = searchJSON['8bnmRange'];
      test = database.SongIntCompare2(song, 'normal8b', searchJSON['8bnmTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['8bhd']) {
      range = searchJSON['8bhdRange'];
      test = database.SongIntCompare2(song, 'hard8b', searchJSON['8bhdTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['8bmx']) {
      range = searchJSON['8bmxRange'];
      test = database.SongIntCompare2(song, 'maximum8b', searchJSON['8bmxTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }
    if (searchJSON['8bsc']) {
      range = searchJSON['8bscRange'];
      test = database.SongIntCompare2(song, 'sc8b', searchJSON['8bscTerm'], (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Pack
    if (searchJSON.pack) {
      test = database.SongStringCompare2(song, 'pack', searchJSON.packTerm);
      criteriaMet = criteriaMet && test;
    }

    // Channel
    if (searchJSON.channel) {
      test = database.SongStringCompare2(song, 'channel', searchJSON.channelTerm);
    }

    // IF the PS4 qualifier was defined...
    if (searchJSON.ps4) {
      test = (song.exclusivity === undefined || song.exclusivity.length === 0);
      if (!test) test = (song.exclusivity.toLowerCase().indexOf('playstation 4') > -1);
      criteriaMet = criteriaMet && test;
    }

    // IF the Steam qualifier was defined...
    if (searchJSON.steam) {
      test = (song.exclusivity === undefined || song.exclusivity.length === 0);
      if (!test) test = (song.exclusivity.toLowerCase().indexOf('steam') > -1);
      criteriaMet = criteriaMet && test;
    }

    // IF the Free qualifier was defined...
    if (searchJSON.free) {
      test = (song.pack.toLowerCase().indexOf('base') > -1);
      test = test || (song.pack.toLowerCase().indexOf('respect v') > -1);
      test = test || (song.pack.toLowerCase().indexOf('tap sonic') > -1);
      test = test || (song.pack.toLowerCase().indexOf('guilty gear') > -1);
      criteriaMet = criteriaMet && test;
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// chartName()
function chartName(song, searchJSON) {
  //
  let name = '';

  // SC
  if (searchJSON['8bsc']) {
    name = `8B SC (${song.sc8b})`;
  } else if (searchJSON['6bsc']) {
    name = `6B SC (${song.sc6b})`;
  } else if (searchJSON['5bsc']) {
    name = `5B SC (${song.sc5b})`;
  } else if (searchJSON['4bsc']) {
    name = `4B SC (${song.sc4b})`;
  } else if (searchJSON['8bmx']) {
    // Maximum
    name = `8B Maximum (${song.maximum8b})`;
  } else if (searchJSON['6bmx']) {
    name = `6B Maximum (${song.maximum6b})`;
  } else if (searchJSON['5bmx']) {
    name = `5B Maximum (${song.maximum5b})`;
  } else if (searchJSON['4bmx']) {
    name = `4B Maximum (${song.maximum4b})`;
  } else if (searchJSON['8bhd']) {
    // Hard
    name = `8B Hard (${song.hard8b})`;
  } else if (searchJSON['6bhd']) {
    name = `6B Hard (${song.hard6b})`;
  } else if (searchJSON['5bhd']) {
    name = `5B Hard (${song.hard5b})`;
  } else if (searchJSON['4bhd']) {
    name = `4B Hard (${song.hard4b})`;
  } else if (searchJSON['8bnm']) {
    // Normal
    name = `8B Normal (${song.normal8b})`;
  } else if (searchJSON['6bnm']) {
    name = `6B Normal (${song.normal6b})`;
  } else if (searchJSON['5bnm']) {
    name = `5B Normal (${song.normal5b})`;
  } else if (searchJSON['4bnm']) {
    name = `4B Normal (${song.normal4b})`;
  }

  //
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  //
  const otherProps = {};

  //
  if (searchJSON.vocalist) {
    otherProps.Vocalist = database.FormatArrayForString(song.vocalist, 999, false);
  }
  if (searchJSON.genre) {
    otherProps.Genre = song.genre;
  }
  if (searchJSON.bpm) {
    otherProps.BPM = song.bpm;
  }
  if (searchJSON.pack) {
    otherProps.Pack = song.pack;
  }

  //
  return otherProps;
}

// sortCategory()
function sortCategory(song) {
  return `(Channel: **${song.channel}**)`;
}

// helpShort()
function helpShort() {
  const exceptions = [
    'vocalist',
    'genre',
    '4bsc',
    '5bsc',
    '6bsc',
    '8bsc',
    'channel',
    'ps4',
    'steam',
    'free',
  ];
  return database.HelpFromSearchParams(searchParams, identities[0], exceptions);
}

// helpFull()
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// Setting up the exports
module.exports = {
  ModuleName: 'DJMaxRespect',
  FullGameName: 'DJMax Respect',
  CommandIdentities: identities,
  Header: header,
  Load: loadSongs,
  Songs: djmrSongs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpShort,
  Help2: helpFull,
};
