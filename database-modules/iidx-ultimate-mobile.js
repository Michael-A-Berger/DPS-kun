// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/iidx-ultimate-mobile.csv`;
const identities = ['iidxmobile', 'iidxm'];
const iidxmSongs = [];
const searchParams = {};

// Defining the search parameters
database.DefineSearchParam(searchParams, 'name', 'Song name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'artist', 'Song artist name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'genre', 'Song genre name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'bpm', 'Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
database.DefineSearchParam(searchParams, 'beginner', 'Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
database.DefineSearchParam(searchParams, 'normal', searchParams.beginner.description.replace('Beginner', 'Normal'), 1);
database.DefineSearchParam(searchParams, 'hyper', searchParams.beginner.description.replace('Beginner', 'Hyper'), 1);
database.DefineSearchParam(searchParams, 'another', searchParams.beginner.description.replace('a Beginner', 'an Another'), 1);
database.DefineSearchParam(searchParams, 'style', 'The style the song is sorted under in-game (Options: 1 -> 27, mobile)', '', ':?');
database.DefineSearchParam(searchParams, 'origin', 'The original IIDX game the song first apeared in (Options: 1 -> 27, substream, 3CS -> 16CS, mobile)', '', ':?');
database.DefineSearchParam(searchParams, 'price', 'Whether the song costs money to play (Options: free, subscription)', '', ':?');
database.DefineSearchParam(searchParams, 'allsongs', 'Includes both playable and removed songs');
database.DefineSearchParam(searchParams, 'removed', 'Only returns removed songs');

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
  let songStr = `\:cd:\:point_left:\t**${song.name}**\t\:point_right:\:cd:`;
  songStr += `\n- Composed by **${song.artist}**`;
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

// Setting up the exports
module.exports = {
  ModuleName: 'IIDXMobile',
  FullGameName: 'IIDX Ultimate Mobile',
  CommandIdentities: identities,
  Load: loadSongs,
  Songs: iidxmSongs,
  Format: format,
  Search: search,
  Help: helpShort,
  Help2: helpFull,
};
