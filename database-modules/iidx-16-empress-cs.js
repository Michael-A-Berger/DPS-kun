// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:princess:\:cd:\:musical_keyboard:';
const songFile = `${__dirname}/../database/iidx-16-empress-cs.csv`;
const identities = ['iidx16cs'];
const iidx16csSongs = [];
const searchParams = {};

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('Song artist name contains \'?\' (no spaces)', '', ':?');
searchParams.genre = database.DefineSearchParam('Song genre name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.beginner = database.DefineSearchParam('Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.spn = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Single Normal'), 1);
searchParams.sph = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Single Hyper'), 1);
searchParams.spa = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Single Another'), 1);
searchParams.spka = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Single Black Another'), 1);
searchParams.dpn = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Double Normal'), 1);
searchParams.dph = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Double Hyper'), 1);
searchParams.dpa = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Double Another'), 1);
searchParams.dpka = database.DefineSearchParam(searchParams.beginner.description.replace('Beginner', 'Double Black Another'), 1);
searchParams.disc = database.DefineSearchParam('Which disc the song is on (Options: empress, premium)', '', ':?');
searchParams.style = database.DefineSearchParam('The style the song is sorted under in-game (Options: 1 -> 16, substream)', '', ':?');
searchParams.origin = database.DefineSearchParam('The original IIDX game the song first apeared in (Options: 1 -> 16, substream, 3CS -> 16CS)', '', ':?');
searchParams.allsongs = database.DefineSearchParam('Includes both base songs and unlocks');
searchParams.unlocks = database.DefineSearchParam('Only returns unlockable songs');

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
      // Reading the song info string from the CSV
      songString = database.ParseStringFromCSV(fileString[num]);

      // Creating the song object
      iidx16csSongs[num - 1] = {
        genre: songString[0],
        name: songString[1],
        artist: songString[2],
        bpm: songString[3],
        beginner: parseInt(songString[4], 10),
        spn: parseInt(songString[5], 10),
        sph: parseInt(songString[6], 10),
        spa: parseInt(songString[7], 10),
        spka: parseInt(songString[8], 10),
        dpn: parseInt(songString[9], 10),
        dph: parseInt(songString[10], 10),
        dpa: parseInt(songString[11], 10),
        dpka: parseInt(songString[12], 10),
        disc: songString[13],
        style: songString[14],
        origin: songString[15],
        unlockable: songString[16],
        remywiki: songString[17],
      };
    }
  }

  console.log(`-- IIDX 16 EMPRESS + PREMIUM BEST songs loaded! (Total: ${iidx16csSongs.length})`);
}

// format()
function format(song) {
  console.dir(song);
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
    songStr += `\n\t\t**Single Normal (${song.spn})**`;
  }
  if (!Number.isNaN(song.sph)) {
    songStr += `\n\t\t**Single Hyper (${song.sph})**`;
  }
  if (!Number.isNaN(song.spa)) {
    songStr += `\n\t\t**Single Another (${song.spa})**`;
  }
  if (!Number.isNaN(song.spka)) {
    songStr += `\n\t\t**Single Black Another (${song.spka})**`;
  }
  if (!Number.isNaN(song.dpn)) {
    songStr += `\n\t\t**Double Normal (${song.dpn})**`;
  }
  if (!Number.isNaN(song.dph)) {
    songStr += `\n\t\t**Double Hyper (${song.dph})**`;
  }
  if (!Number.isNaN(song.dpa)) {
    songStr += `\n\t\t**Double Another (${song.dpa})**`;
  }
  if (!Number.isNaN(song.dpka)) {
    songStr += `\n\t\t**Double Black Another (${song.dpka})**`;
  }
  songStr += `\n- IIDX Style: **${song.style}**`;
  songStr += `\n- First IIDX Appearance: **${song.origin}**`;
  songStr += `\n- Game Disc: **${song.disc}**`;
  songStr += `\n- RemyWiki page: ${song.remywiki}`;
  if (song.unlockable.length > 0) {
    songStr += '\n(Song is locked by default, see RemyWiki page for unlock conditions.)';
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
  songMatches = iidx16csSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (searchJSON.name) {
      test = database.SongStringCompare2(song, 'name', searchJSON.nameTerm);
      test = test || (song.remywiki.toLowerCase().indexOf(searchJSON.nameTerm) > 21);
      criteriaMet = criteriaMet && test;
    }

    // Artist
    if (searchJSON.artist) {
      test = database.SongStringCompare2(song, 'artist', searchJSON.artistTerm);
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

    // Beginner
    if (searchJSON.beginner) {
      range = searchJSON.beginnerRange;
      test = database.SongIntCompare2(song, 'beginner', searchJSON.beginnerTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Normal
    if (searchJSON.spn) {
      range = searchJSON.spnRange;
      test = database.SongIntCompare2(song, 'spn', searchJSON.spnTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Hyper
    if (searchJSON.sph) {
      range = searchJSON.sphRange;
      test = database.SongIntCompare2(song, 'sph', searchJSON.sphTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Another
    if (searchJSON.spa) {
      range = searchJSON.spaRange;
      test = database.SongIntCompare2(song, 'spa', searchJSON.spaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Black Another
    if (searchJSON.spka) {
      range = searchJSON.spkaRange;
      test = database.SongIntCompare2(song, 'spka', searchJSON.spkaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Normal
    if (searchJSON.dpn) {
      range = searchJSON.dpnRange;
      test = database.SongIntCompare2(song, 'dpn', searchJSON.dpnTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Hyper
    if (searchJSON.dph) {
      range = searchJSON.dphRange;
      test = database.SongIntCompare2(song, 'dph', searchJSON.dphTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Another
    if (searchJSON.dpa) {
      range = searchJSON.dpaRange;
      test = database.SongIntCompare2(song, 'dpa', searchJSON.dpaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Black Another
    if (searchJSON.dpka) {
      range = searchJSON.dpkaRange;
      test = database.SongIntCompare2(song, 'dpka', searchJSON.dpkaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Disc
    if (searchJSON.disc) {
      test = database.SongStringCompare2(song, 'disc', searchJSON.discTerm);
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

    // All Songs / Unlocks
    if (!searchJSON.allsongs && !searchJSON.unlocks) {
      criteriaMet = criteriaMet && (song.unlockable === '');
    } else if (!searchJSON.allsongs && searchJSON.unlocks) {
      criteriaMet = criteriaMet && (song.unlockable.toLowerCase() === 'yes');
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

  // Defining the chart name based on search parameters (rarest -> most common)
  if (name.length === 0 && searchJSON.dpka) {
    name = `Double Black Another (${song.dpka})`;
  }
  if (name.length === 0 && searchJSON.dpa) {
    name = `Double Another (${song.dpa})`;
  }
  if (name.length === 0 && searchJSON.dph) {
    name = `Double Hyper (${song.dph})`;
  }
  if (name.length === 0 && searchJSON.dpn) {
    name = `Double Normal (${song.dpn})`;
  }
  if (name.length === 0 && searchJSON.spka) {
    name = `Single Black Another (${song.spka})`;
  }
  if (name.length === 0 && searchJSON.spa) {
    name = `Single Another (${song.spa})`;
  }
  if (name.length === 0 && searchJSON.sph) {
    name = `Single Hyper (${song.sph})`;
  }
  if (name.length === 0 && searchJSON.spn) {
    name = `Single Normal (${song.spn})`;
  }
  if (name.length === 0 && searchJSON.beginner) {
    name = `Beginner (${song.beginner})`;
  }

  // Returning the chart name
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  // Defining the properties object
  const otherProps = {};

  // Setting the property parameters based on the search field
  if (searchJSON.genre) {
    otherProps.Genre = song.genre;
  }
  if (searchJSON.bpm) {
    otherProps.BPM = song.bpm;
  }
  if (searchJSON.origin) {
    otherProps.Origin = song.origin;
  }

  // Returning the properties object
  return otherProps;
}

// sortCategory()
function sortCategory(song) {
  return `(Disc: **${song.disc}** / Style: **${song.style}**)`;
}

// helpShort()
function helpShort() {
  const exceptions = [
    'bpm',
    'genre',
    'beginner',
    'spka',
    'dpka',
    'origin',
    'allsongs',
    'unlocks',
  ];
  return database.HelpFromSearchParams(searchParams, identities[0], exceptions);
}

// helpFull()
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// Setting up the exports
module.exports = {
  ModuleName: 'IIDX16CS',
  FullGameName: 'IIDX 16 EMPRESS + PREMIUM BEST',
  CommandIdentities: identities,
  Header: header,
  Load: loadSongs,
  Songs: iidx16csSongs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpShort,
  Help2: helpFull,
};
