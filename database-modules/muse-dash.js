// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:guitar:\:bear:\:violin:';
const songFile = `${__dirname}/../database/muse-dash.csv`;
const identities = ['musedash', 'msds'];
const msdsSongs = [];
const searchParams = {};

// Desining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('Song artist name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.easy = database.DefineSearchParam('Song must have an Easy difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.hard = database.DefineSearchParam(searchParams.easy.description.replace('an Easy', 'a Hard'), 1);
searchParams.master = database.DefineSearchParam(searchParams.easy.description.replace('an Easy', 'a Master'), 1);
searchParams.hidden = database.DefineSearchParam(searchParams.easy.description.replace('an Easy', 'a Hidden'), 1);
searchParams.pack = database.DefineSearchParam('Song must come from a pack whose name contains \'?\' (no spaces)', '', ':?');

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
          songString[counter] = fileString[num].substr(1, nextCommaPos - 1);
          fileString[num] = fileString[num].substr(nextCommaPos + 2);
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
      msdsSongs[num - 1] = {
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

  console.log(`-- Muse Dash songs loaded! (Total: ${msdsSongs.length})`);
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `${header}\t**${song.name}**\t${database.ReverseEmoji(header)}`;
  songStr += `\n- Composed by **${song.artist}**`;
  songStr += `\n- Length: **${song.length}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Chart:';
  if (!Number.isNaN(song.easy)) {
    songStr += `\n\t\t**Easy (${song.easy})**`;
  }
  if (!Number.isNaN(song.hard)) {
    songStr += `\n\t\t**Hard (${song.hard})**`;
  }
  if (!Number.isNaN(song.master)) {
    songStr += `\n\t\t**Master (${song.master})**`;
  }
  if (!Number.isNaN(song.hidden)) {
    songStr += `\n\t\t**Hidden (${song.hidden})**`;
  }
  songStr += `\n- Song Pack: **${song.pack}**`;
  if (!Number.isNaN(song.unlockLevel)) {
    songStr += `\n- Unlock Level: **${song.unlockLevel}**`;
  }
  if (song.cover.length > 0) {
    songStr += `\n- Song Jacket: ${song.cover}`;
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
  songMatches = msdsSongs.filter((song) => {
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

    // Easy
    if (searchJSON.easy) {
      range = searchJSON.easyRange;
      test = database.SongIntCompare2(song, 'easy', searchJSON.easyTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Hard
    if (searchJSON.hard) {
      range = searchJSON.hardRange;
      test = database.SongIntCompare2(song, 'hard', searchJSON.hardTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Master
    if (searchJSON.master) {
      range = searchJSON.master;
      test = database.SongIntCompare2(song, 'master', searchJSON.masterTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Hidden
    if (searchJSON.hidden) {
      range = searchJSON.hiddenRange;
      test = database.SongIntCompare2(song, 'hidden', searchJSON.hiddenTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Pack
    if (searchJSON.pack) {
      test = database.SongStringCompare2(song, 'pack', searchJSON.packTerm);
      criteriaMet = criteriaMet && test;
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// help()
function help() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// Setting up the exports
module.exports = {
  ModuleName: 'MuseDash',
  FullGameName: 'Muse Dash',
  CommandIdentities: identities,
  Load: loadSongs,
  Songs: msdsSongs,
  Format: format,
  Search: search,
  Help: help,
  Help2: help,
};
