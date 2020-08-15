// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:headphones:\:desktop:';
const songFile = `${__dirname}/../database/groove-coaster-pc.csv`;
const identities = ['groovecoasterpc', 'gcpc'];
const gcpcSongs = [];
const searchParams = {};

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('Song artist name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.simple = database.DefineSearchParam('Song must have a Simple difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.normal = database.DefineSearchParam(searchParams.simple.description.replace('Simple', 'Normal'), 1);
searchParams.hard = database.DefineSearchParam(searchParams.simple.description.replace('Simple', 'Hard'), 1);
searchParams.extra = database.DefineSearchParam(searchParams.simple.description.replace('a Simple', 'an Extra'), 1);

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

// format()
function format(song) {
  // Formatting the song string
  let songStr = `${header}\t**${song.name}**\t${database.ReverseEmoji(header)}`;
  songStr += `\n- Composed by **${song.artist}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Charts:';
  if (!Number.isNaN(song.simple)) {
    songStr += `\n\t\t**Simple (${song.simple})**`;
  }
  if (!Number.isNaN(song.normal)) {
    songStr += `\n\t\t**Normal (${song.normal})**`;
  }
  if (!Number.isNaN(song.hard)) {
    songStr += `\n\t\t**Hard (${song.hard})**`;
  }
  if (!Number.isNaN(song.extra)) {
    songStr += `\n\t\t**Extra (${song.extra})**`;
  }
  songStr += `\n- Type: **${song.type}**`;
  songStr += `\n- Added on **${song.date}**`;

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
  songMatches = gcpcSongs.filter((song) => {
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

    // Simple
    if (searchJSON.simple) {
      range = searchJSON.simpleRange;
      test = database.SongIntCompare2(song, 'simple', searchJSON.simpleTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Normal
    if (searchJSON.normal) {
      range = searchJSON.normalRange;
      test = database.SongIntCompare2(song, 'normal', searchJSON.normalTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Hard
    if (searchJSON.hard) {
      range = searchJSON.hardRange;
      test = database.SongIntCompare2(song, 'hard', searchJSON.hardTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Extra
    if (searchJSON.extra) {
      range = searchJSON.extraRange;
      test = database.SongIntCompare2(song, 'extra', searchJSON.extraTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// chartName()
function chartName(song, searchJSON) {
  // Defining the chart name variable
  let name = '';

  // Setting the correct chart name to use (rarest -> most common)
  if (name.length === 0 && searchJSON.extra) {
    name = `Extra (${song.extra})`;
  }
  if (name.length === 0 && searchJSON.hard) {
    name = `Hard (${song.hard})`;
  }
  if (name.length === 0 && searchJSON.normal) {
    name = `Normal (${song.normal})`;
  }
  if (name.length === 0 && searchJSON.simple) {
    name = `Simple (${song.simple})`;
  }

  // Returning the chart name
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  // Defining the properties object
  const otherProps = {};

  // Defining the properties object
  if (searchJSON.bpm) {
    otherProps.BPM = song.bpm;
  }

  // Returning the properties object
  return otherProps;
}

// sortCategory()
function sortCategory() {
  return '';
}

// helpFull()
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// Setting up the exports
module.exports = {
  ModuleName: 'GrooveCoasterPC',
  FullGameName: 'Groove Coaster PC',
  CommandIdentities: identities,
  Header: header,
  Load: loadSongs,
  Songs: gcpcSongs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpFull,
  Help2: helpFull,
};
