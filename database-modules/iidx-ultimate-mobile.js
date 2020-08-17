// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:cd:\:point_left:';
const songFile = `${__dirname}/../database/iidx-ultimate-mobile.csv`;
const identities = ['iidxmobile', 'iidxm'];
const iidxmSongs = [];
const searchParams = {};

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('Song artist name contains \'?\' (no spaces)', '', ':?');
searchParams.genre = database.DefineSearchParam('Song genre name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.beginner = database.DefineSearchParam('Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.normal = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Normal'), 1);
searchParams.hyper = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Hyper'), 1);
searchParams.another = database.DefineSearchParam(searchParams.beginner.description.replace('a Beginner', 'an Another'), 1);
searchParams.style = database.DefineSearchParam('The style the song is sorted under in-game (Options: 1 -> 27, mobile)', '', ':?');
searchParams.origin = database.DefineSearchParam('The original IIDX game the song first apeared in (Options: 1 -> 27, substream, 3CS -> 16CS, mobile)', '', ':?');
searchParams.price = database.DefineSearchParam('Whether the song costs money to play (Options: free, subscription)', '', ':?');
searchParams.allsongs = database.DefineSearchParam('Includes both playable and removed songs');
searchParams.removed = database.DefineSearchParam('Only returns removed songs');

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
      songString = database.ParseStringFromCSV(fileString[num]);
      iidxmSongs[num - 1] = {
        genre: songString[0],
        name: songString[1],
        artist: songString[2],
        bpm: songString[3],
        beginner: parseInt(songString[4], 10),
        spn: parseInt(songString[5], 10),
        sph: parseInt(songString[6], 10),
        spa: parseInt(songString[7], 10),
        style: songString[8],
        origin: songString[9],
        price: songString[10],
        removed: songString[11],
        dateAdded: songString[12],
      };
    }
  }

  console.log(`-- IIDX Ultimate Mobile songs loaded! (Total: ${iidxmSongs.length})`);
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `${header}\t**${song.name}**\t${database.ReverseEmoji(header)}`;
  songStr += `\n- Artist: **${song.artist}**`;
  songStr += `\n- Genre: **${song.genre}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Charts:';
  if (!Number.isNaN(song.beginner)) {
    songStr += `\n\t\t**Beginner (${song.beginner})**`;
  }
  if (!Number.isNaN(song.spn)) {
    songStr += `\n\t\t**Normal (${song.spn})**`;
  }
  if (!Number.isNaN(song.sph)) {
    songStr += `\n\t\t**Hyper (${song.sph})**`;
  }
  if (!Number.isNaN(song.spa)) {
    songStr += `\n\t\t**Another (${song.spa})**`;
  }
  songStr += `\n- IIDX Style: **${song.style}**`;
  songStr += `\n- First IIDX Appearance: **${song.origin}**`;
  songStr += `\n- Requires Subscription?: **${(song.price.toLowerCase() === 'free' ? 'No' : 'Yes')}**`;
  songStr += `\n- Added on **${song.dateAdded}${song.removed.length > 0 ? ' (Now Removed)' : ''}**`;

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
  songMatches = iidxmSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Genre
    if (searchJSON.genre) {
      test = database.SongStringCompare2(song, 'genre', searchJSON.genreTerm);
      criteriaMet = criteriaMet && test;
    }

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

    // Beginner
    if (searchJSON.beginner) {
      range = searchJSON.beginnerRange;
      test = database.SongIntCompare2(song, 'beginner', searchJSON.beginnerTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // SPN
    if (searchJSON.normal) {
      range = searchJSON.normalRange;
      test = database.SongIntCompare2(song, 'spn', searchJSON.normalTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // SPH
    if (searchJSON.hyper) {
      range = searchJSON.hyperRange;
      test = database.SongIntCompare2(song, 'sph', searchJSON.hyperTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // SPA
    if (searchJSON.another) {
      range = searchJSON.anotherRange;
      test = database.SongIntCompare2(song, 'spa', searchJSON.anotherTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Style
    if (searchJSON.style) {
      test = database.SongStringCompare2(song, 'style', searchJSON.styleTerm, true);
      criteriaMet = criteriaMet && test;
    }

    // Origin
    if (searchJSON.origin) {
      test = database.SongStringCompare2(song, 'origin', searchJSON.originTerm, true);
      criteriaMet = criteriaMet && test;
    }

    // Price
    if (searchJSON.price) {
      test = database.SongStringCompare2(song, 'price', searchJSON.priceTerm);
      criteriaMet = criteriaMet && test;
    }

    // All Songs / Removed
    if (!searchJSON.allsongs && !searchJSON.removed) {
      criteriaMet = criteriaMet && (song.removed === '');
    } else if (!searchJSON.allsongs && searchJSON.removed) {
      criteriaMet = criteriaMet && (song.removed.toLowerCase() === 'yes');
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// helpShort()
function helpShort() {
  const exclusions = [
    'genre',
    'bpm',
    'origin',
    'allsongs',
    'removed',
  ];
  return database.HelpFromSearchParams(searchParams, identities[0], exclusions);
}

// helpFull
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// chartName()
function chartName(song, searchJSON) {
  // Creating the chart name variable
  let name = '';

  // Defining the chart name
  if (searchJSON.another) {
    name = `Another (${song.spa})`;
  } else if (searchJSON.hyper) {
    name = `Hyper (${song.sph})`;
  } else if (searchJSON.normal) {
    name = `Normal (${song.spn})`;
  } else if (searchJSON.beginner) {
    name = `Beginner (${song.beginner})`;
  }

  // Returning the chart name
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  // Defining the miscellaneous properties object
  const otherProps = {};

  // Setting the other properties to record
  if (searchJSON.genre) {
    otherProps.Genre = song.genre;
  }
  if (searchJSON.bpm) {
    otherProps.BPM = song.bpm;
  }
  if (searchJSON.origin) {
    otherProps.Origin = song.origin;
  }
  if (searchJSON.price) {
    otherProps.Price = song.price;
  }

  // Returning the miscellaneous properties object
  return otherProps;
}

// sortCategory()
function sortCategory(song) {
  return `(Style: **${song.style}**)`;
}

// Setting up the exports
module.exports = {
  ModuleName: 'IIDXMobile',
  FullGameName: 'IIDX Ultimate Mobile',
  CommandIdentities: identities,
  Header: header,
  Load: loadSongs,
  Songs: iidxmSongs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpShort,
  Help2: helpFull,
};
