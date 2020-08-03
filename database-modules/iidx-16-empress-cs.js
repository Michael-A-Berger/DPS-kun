// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/iidx-16-empress-cs.csv`;
const identities = ['iidx16cs'];
const iidx16csSongs = [];
const searchParams = {};

// Defining the search parameters
database.DefineSearchParam(searchParams, 'name', 'Song name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'artist', 'Song artist name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'genre', 'Song genre name contains \'?\' (no spaces)', '', ':?');
database.DefineSearchParam(searchParams, 'bpm', 'Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
database.DefineSearchParam(searchParams, 'beginner', 'Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
database.DefineSearchParam(searchParams, 'spn', searchParams.beginner.description.replace('Beginner', 'Single Normal'), 1);
database.DefineSearchParam(searchParams, 'sph', searchParams.beginner.description.replace('Beginner', 'Single Hyper'), 1);
database.DefineSearchParam(searchParams, 'spa', searchParams.beginner.description.replace('Beginner', 'Single Another'), 1);
database.DefineSearchParam(searchParams, 'spka', searchParams.beginner.description.replace('Beginner', 'Single Black Another'), 1);
database.DefineSearchParam(searchParams, 'dpn', searchParams.beginner.description.replace('Beginner', 'Double Normal'), 1);
database.DefineSearchParam(searchParams, 'dph', searchParams.beginner.description.replace('Beginner', 'Double Hyper'), 1);
database.DefineSearchParam(searchParams, 'dpa', searchParams.beginner.description.replace('Beginner', 'Double Another'), 1);
database.DefineSearchParam(searchParams, 'dpka', searchParams.beginner.description.replace('Beginner', 'Double Black Another'), 1);
database.DefineSearchParam(searchParams, 'disc', 'Which disc the song is on (Options: empress, premium)', '', ':?');
database.DefineSearchParam(searchParams, 'style', 'The style the song is sorted under in-game (Options: 1 -> 16, substream)', '', ':?');
database.DefineSearchParam(searchParams, 'origin', 'The original IIDX game the song first apeared in (Options: 1 -> 16, substream, 3CS -> 16CS)', '', ':?');
database.DefineSearchParam(searchParams, 'allsongs', 'Includes both base songs and unlocks');
database.DefineSearchParam(searchParams, 'unlocks', 'Only returns unlockable songs');

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
  let counter = 0;
  let nextCommaPos = -1;

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      // Reading the song info string from the CSV
      songString = [];
      counter = 0;
      while (fileString[num].length > 0) {
        if (fileString[num].startsWith('"')) {
          nextCommaPos = fileString[num].indexOf('",');
          if (nextCommaPos > -1) {
            songString[counter] = fileString[num].substr(1, nextCommaPos - 1);
            fileString[num] = fileString[num].substr(nextCommaPos + 2);
          } else {
            songString[counter] = fileString[num].substr(1, fileString[num].length - 2);
            fileString[num] = 0;
          }
        } else {
          nextCommaPos = fileString[num].indexOf(',');
          if (nextCommaPos > -1) {
            songString[counter] = fileString[num].substr(0, nextCommaPos);
            fileString[num] = fileString[num].substr(nextCommaPos + 1);
          } else {
            songString[counter] = fileString[num];
            fileString[num] = 0;
          }
        }
        counter++;
      }

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
  let songStr = `\:princess:\:cd:\:musical_keyboard:\t**${song.name}**\t\:musical_keyboard:\:cd:\:princess:`;
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
  Load: loadSongs,
  Songs: iidx16csSongs,
  Format: format,
  Search: search,
  Help: helpShort,
  Help2: helpFull,
};
