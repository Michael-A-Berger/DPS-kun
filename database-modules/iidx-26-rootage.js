// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:books:\:dvd:\:musical_keyboard:';
const songFile = `${__dirname}/../database/iidx-26-rootage.csv`;
const identities = ['iidx26rootage', 'rootage', 'iidx26'];
const iidx26Songs = [];
const searchParams = {};

// Defining the IIDX Styles array constant
const iidxStyles = [
  /* 00 */ 'beatmania IIDX substream',
  /* 01 */ 'beatmania IIDX',
  /* 02 */ 'beatmania IIDX 2nd style',
  /* 03 */ 'beatmania IIDX 3rd style',
  /* 04 */ 'beatmania IIDX 4th style',
  /* 05 */ 'beatmania IIDX 5th style',
  /* 06 */ 'beatmania IIDX 6th style',
  /* 07 */ 'beatmania IIDX 7th style',
  /* 08 */ 'beatmania IIDX 8th style',
  /* 09 */ 'beatmania IIDX 9th style',
  /* 10 */ 'beatmania IIDX 10th style',
  /* 11 */ 'beatmania IIDX 11 IIDX RED',
  /* 12 */ 'beatmania IIDX 12 HAPPY SKY',
  /* 13 */ 'beatmania IIDX 13 DistorteD',
  /* 14 */ 'beatmania IIDX 14 GOLD',
  /* 15 */ 'beatmania IIDX 15 DJ TROOPERS',
  /* 16 */ 'beatmania IIDX 16 EMPRESS',
  /* 17 */ 'beatmania IIDX 17 SIRIUS',
  /* 18 */ 'beatmania IIDX 18 Resort Anthem',
  /* 19 */ 'beatmania IIDX 19 Lincle',
  /* 20 */ 'beatmania IIDX 20 tricoro',
  /* 21 */ 'beatmania IIDX 21 SPADA',
  /* 22 */ 'beatmania IIDX 22 PENDUAL',
  /* 23 */ 'beatmania IIDX 23 copula',
  /* 24 */ 'beatmania IIDX 24 SINOBUZ',
  /* 25 */ 'beatmania IIDX 25 CANNON BALLERS',
  /* 26 */ 'beatmania IIDX 26 Rootage',
];

// Defining the search parameters
searchParams.name = database.DefineSearchParam('Song name contains \'?\' (no spaces)', '', ':?');
searchParams.artist = database.DefineSearchParam('In-game artist name contains \'?\' (no spaces)', '', ':?');
searchParams.composition = database.DefineSearchParam('Song composer name contains \'?\' (no spaces)', '', ':?');
searchParams.arrangement = database.DefineSearchParam('Song arranger name contains \'?\' (no spaces)', '', ':?');
searchParams.genre = database.DefineSearchParam('Song genre name contains \'?\' (no spaces)', '', ':?');
searchParams.bpm = database.DefineSearchParam('Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)', 1, ':#');
searchParams.beginner = database.DefineSearchParam('Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)', 1);
searchParams.spn = database.DefineSearchParam('Song must have a Single Normal difficulty chart', 1);
searchParams.sph = database.DefineSearchParam(searchParams.spn.description.replace('Normal', 'Hyper'), 1);
searchParams.spa = database.DefineSearchParam(searchParams.spn.description.replace('Normal', 'Another'), 1);
searchParams.spl = database.DefineSearchParam(searchParams.spn.description.replace('Normal', 'Leggendaria'), 1);
searchParams.dpn = database.DefineSearchParam(searchParams.spn.description.replace('Single', 'Double'), 1);
searchParams.dph = database.DefineSearchParam(searchParams.dpn.description.replace('Normal', 'Hyper'), 1);
searchParams.dpa = database.DefineSearchParam(searchParams.dpn.description.replace('Normal', 'Another'), 1);
searchParams.dpl = database.DefineSearchParam(searchParams.dpn.description.replace('Normal', 'Leggendaria'), 1);
searchParams.notecount = database.DefineSearchParam('Note count on one of the song\'s charts must match \'#\' (prepend \'~\' for range of -/+ 25)', 1, ':#');
searchParams.cn = database.DefineSearchParam('Only returns songs with charts that have Charge Notes', '');
searchParams.bs = database.DefineSearchParam('Only returns songs with charts that have Backspin Scratches', '');
searchParams.hellcn = database.DefineSearchParam('Only returns songs with charts that have Hell Charge Notes', '');
searchParams.hellbs = database.DefineSearchParam('Only returns songs with charts that have Hell Backspin Scratches', '');
searchParams.firststyle = database.DefineSearchParam('The IIDX style the song first appeared in (Options: 1 -> 26, substream)', '', ':?');
searchParams.vj = database.DefineSearchParam('Song VJ artist info contains \'?\' (no spaces)', '', ':?');

// Newline Variable
const newlineChar = process.env.NEWLINE_CHAR;

/* ============================
 * ===== MODULE FUNCTIONS =====
 * ============================
 */

// loadSongs()
function loadSongs() {
  // Reading the CSV file into memory
  let fileString = fs.readFileSync(songFile, 'utf8');

  // Defining some preliminary variables
  let songString = [];

  // Defining the song properties array (+ num parsing start & stop indices)
  const songProps = [
    /* 00 */ 'name',
    /* 01 */ 'transname',
    /* 02 */ 'artist',
    /* 03 */ 'composition',
    /* 04 */ 'arrangement',
    /* 05 */ 'genre',
    /* 06 */ 'bpm',
    /* 07 */ 'length',
    /* 08 */ 'beginnerrating',
    /* 09 */ 'beginnernotecount',
    /* 10 */ 'beginnercn',
    /* 11 */ 'spnrating',
    /* 12 */ 'spnnotecount',
    /* 13 */ 'spncn',
    /* 14 */ 'spnbs',
    /* 15 */ 'spnhellcn',
    /* 16 */ 'spnhellbs',
    /* 17 */ 'sphrating',
    /* 18 */ 'sphnotecount',
    /* 19 */ 'sphcn',
    /* 20 */ 'sphbs',
    /* 21 */ 'sphhellcn',
    /* 22 */ 'sphhellbs',
    /* 23 */ 'sparating',
    /* 24 */ 'spanotecount',
    /* 25 */ 'spacn',
    /* 26 */ 'spabs',
    /* 27 */ 'spahellcn',
    /* 28 */ 'spahellbs',
    /* 29 */ 'splrating',
    /* 30 */ 'splnotecount',
    /* 31 */ 'splcn',
    /* 32 */ 'splbs',
    /* 33 */ 'splhellcn',
    /* 34 */ 'splhellbs',
    /* 35 */ 'dpnrating',
    /* 36 */ 'dpnnotecount',
    /* 37 */ 'dpncn',
    /* 38 */ 'dpnbs',
    /* 39 */ 'dpnhellcn',
    /* 40 */ 'dpnhellbs',
    /* 41 */ 'dphrating',
    /* 42 */ 'dphnotecount',
    /* 43 */ 'dphcn',
    /* 44 */ 'dphbs',
    /* 45 */ 'dphhellcn',
    /* 46 */ 'dphhellbs',
    /* 47 */ 'dparating',
    /* 48 */ 'dpanotecount',
    /* 49 */ 'dpacn',
    /* 50 */ 'dpabs',
    /* 51 */ 'dpahellcn',
    /* 52 */ 'dpahellbs',
    /* 53 */ 'dplrating',
    /* 54 */ 'dplnotecount',
    /* 55 */ 'dplcn',
    /* 56 */ 'dplbs',
    /* 57 */ 'dplhellcn',
    /* 58 */ 'dplhellbs',
    /* 59 */ 'firstgame',
    /* 60 */ 'othergames',
    /* 61 */ 'vj',
    /* 62 */ 'remywiki',
  ];
  const intParseStart = songProps.indexOf('beginnerrating');
  const intParseStop = songProps.indexOf('dplhellbs');
  const firstGameIndex = songProps.indexOf('firstgame');

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      // Reading the song info string from the CSV
      songString = database.ParseStringFromCSV(fileString[num]);

      // Creating the song object
      const tempSong = {};
      for (let propNum = 0; propNum < songProps.length; propNum++) {
        if (intParseStart <= propNum && propNum <= intParseStop) {
          tempSong[songProps[propNum]] = parseInt(songString[propNum], 10);
        } else {
          let newProp = songString[propNum].split(database.NoCommaInParenthesesRegex);
          if (newProp.length === 1) [newProp] = newProp;
          if (propNum === firstGameIndex) {
            newProp = newProp.split(/\s*\/\s*/g);
          }
          tempSong[songProps[propNum]] = newProp;
        }
      }

      // Setting the song object to the songs array
      iidx26Songs[num - 1] = tempSong;
    }
  }

  console.log(`-- IIDX 26 Rootage songs loaded! (Total: ${iidx26Songs.length})`);
}

// checkEveryChart()
function checkEveryChart(searchJSON) {
  // Defining the boolean that determines whether every chart should be checked
  let checkEvery = true;

  // Boolean-gating the check every variable
  checkEvery = checkEvery && !searchJSON.beginner;
  checkEvery = checkEvery && !searchJSON.spn;
  checkEvery = checkEvery && !searchJSON.sph;
  checkEvery = checkEvery && !searchJSON.spa;
  checkEvery = checkEvery && !searchJSON.spl;
  checkEvery = checkEvery && !searchJSON.dpn;
  checkEvery = checkEvery && !searchJSON.dph;
  checkEvery = checkEvery && !searchJSON.dpa;
  checkEvery = checkEvery && !searchJSON.dpl;

  // Returning the check every chart variable
  return checkEvery;
}

// format()
function format(song) {
  // Formatting the song
  let songStr = `${header}\t**${song.name}**\t${database.ReverseEmoji(header)}`;

  // Deciding whether to add the transliteral name to the song string
  const formattedName = song.name.toLowerCase();
  const formattedTrans = song.transname.toLowerCase();
  if (formattedName.indexOf(formattedTrans) === -1 && formattedName.length !== formattedTrans.length) {
    songStr += `\n(lit. **${song.transname}**)`;
  }

  // Generic song details, #1
  songStr += `\n- Artist: **${song.artist}**`;
  songStr += `\n- Composition: ${database.FormatArrayForString(song.composition)}`;
  songStr += `\n- Arrangement: ${database.FormatArrayForString(song.arrangement)}`;
  songStr += `\n- Genre: **${song.genre}**`;
  songStr += `\n- BPM: ${database.FormatArrayForString(song.bpm)}`;
  songStr += `\n- Length: ${database.FormatArrayForString(song.length)}`;
  songStr += '\n- Charts:';

  // Difficulty - Beginner
  if (!Number.isNaN(song.beginnerrating)) {
    songStr += `\n\t\t**Beginner (${song.beginnerrating})** - [`;
    songStr += `${song.beginnernotecount} Total Notes`;
    if (!Number.isNaN(song.beginnercn)) {
      songStr += ` - ${song.beginnercn} Charge Notes`;
    }
    songStr += ']';
  }
  // Difficulty - Single Normal
  if (!Number.isNaN(song.spnrating)) {
    songStr += `\n\t\t**Single Normal (${song.spnrating})** - [`;
    songStr += `${song.spnnotecount} Total Notes`;
    if (!Number.isNaN(song.spncn)) {
      songStr += ` - ${song.spncn} Charge Notes`;
    }
    if (!Number.isNaN(song.spnbs)) {
      songStr += ` - ${song.spnbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.spnhellcn)) {
      songStr += ` - ${song.spnhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.spnhellbs)) {
      songStr += ` - ${song.spnhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Sinle Hyper
  if (!Number.isNaN(song.sphrating)) {
    songStr += `\n\t\t**Single Hyper (${song.sphrating})** - [`;
    songStr += `${song.sphnotecount} Total Notes`;
    if (!Number.isNaN(song.sphcn)) {
      songStr += ` - ${song.sphcn} Charge Notes`;
    }
    if (!Number.isNaN(song.sphbs)) {
      songStr += ` - ${song.sphbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.sphhellcn)) {
      songStr += ` - ${song.sphhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.sphhellbs)) {
      songStr += ` - ${song.sphhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Single Another
  if (!Number.isNaN(song.sparating)) {
    songStr += `\n\t\t**Single Another (${song.sparating})** - [`;
    songStr += `${song.spanotecount} Total Notes`;
    if (!Number.isNaN(song.spacn)) {
      songStr += ` - ${song.spacn} Charge Notes`;
    }
    if (!Number.isNaN(song.spabs)) {
      songStr += ` - ${song.spabs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.spahellcn)) {
      songStr += ` - ${song.spahellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.spahellbs)) {
      songStr += ` - ${song.spahellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Single Leggendaria
  if (!Number.isNaN(song.splrating)) {
    songStr += `\n\t\t**Single Leggendaria (${song.splrating})** - [`;
    songStr += `${song.splnotecount} Total Notes`;
    if (!Number.isNaN(song.splcn)) {
      songStr += ` - ${song.splcn} Charge Notes`;
    }
    if (!Number.isNaN(song.splbs)) {
      songStr += ` - ${song.splbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.splhellcn)) {
      songStr += ` - ${song.splhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.splhellbs)) {
      songStr += ` - ${song.splhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Double Normal
  if (!Number.isNaN(song.dpnrating)) {
    songStr += `\n\t\t**Double Normal (${song.dpnrating})** - [`;
    songStr += `${song.dpnnotecount} Total Notes`;
    if (!Number.isNaN(song.dpncn)) {
      songStr += ` - ${song.dpncn} Charge Notes`;
    }
    if (!Number.isNaN(song.dpnbs)) {
      songStr += ` - ${song.dpnbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.dpnhellcn)) {
      songStr += ` - ${song.dpnhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.dpnhellbs)) {
      songStr += ` - ${song.dpnhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Double Hyper
  if (!Number.isNaN(song.dphrating)) {
    songStr += `\n\t\t**Double Hyper (${song.dphrating})** - [`;
    songStr += `${song.dphnotecount} Total Notes`;
    if (!Number.isNaN(song.dphcn)) {
      songStr += ` - ${song.dphcn} Charge Notes`;
    }
    if (!Number.isNaN(song.dphbs)) {
      songStr += ` - ${song.dpnbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.dphhellcn)) {
      songStr += ` - ${song.dphhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.dphhellbs)) {
      songStr += ` - ${song.dphhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Double Another
  if (!Number.isNaN(song.dparating)) {
    songStr += `\n\t\t**Double Another (${song.dparating})** - [`;
    songStr += `${song.dpanotecount} Total Notes`;
    if (!Number.isNaN(song.dpacn)) {
      songStr += ` - ${song.dpacn} Charge Notes`;
    }
    if (!Number.isNaN(song.dpabs)) {
      songStr += ` - ${song.dpabs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.dpahellcn)) {
      songStr += ` - ${song.dpahellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.dpahellbs)) {
      songStr += ` - ${song.dpahellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }
  // Difficulty - Double Leggendaria
  if (!Number.isNaN(song.dplrating)) {
    songStr += `\n\t\t**Double Leggendaria (${song.dplrating})** - [`;
    songStr += `${song.dplnotecount} Total Notes`;
    if (!Number.isNaN(song.dplcn)) {
      songStr += ` - ${song.dplcn} Charge Notes`;
    }
    if (!Number.isNaN(song.dplbs)) {
      songStr += ` - ${song.dplbs} Backspin Scratches`;
    }
    if (!Number.isNaN(song.dplhellcn)) {
      songStr += ` - ${song.dplhellcn} Hell Charge Notes`;
    }
    if (!Number.isNaN(song.dplhellbs)) {
      songStr += ` - ${song.dplhellbs} Hell Backspin Scratches`;
    }
    songStr += ']';
  }

  // Generic Song Details, #2
  songStr += `\n- First BEMANI Game: ${database.FormatArrayForString(song.firstgame, 3)}`;
  if (song.othergames.length > 0) {
    songStr += `\n- Other BEMANI Game Appearances: ${database.FormatArrayForString(song.othergames, 3)}`;
  }
  songStr += `\n- Video Jockey: ${database.FormatArrayForString(song.vj)}`;
  songStr += `\n- RemyWiki page: ${song.remywiki}`;

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
  let range = -1;
  songMatches = iidx26Songs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Name
    if (searchJSON.name) {
      test = database.SongStringCompare2(song, 'name', searchJSON.nameTerm);
      // test = test || (song.transname.toLowerCase().indexOf(searchJSON.nameTerm) > -1);
      test = test || database.SongStringCompare2(song, 'transname', searchJSON.nameTerm);
      criteriaMet = criteriaMet && test;
    }

    // Artist
    if (searchJSON.artist) {
      test = database.SongStringCompare2(song, 'artist', searchJSON.artistTerm);
      criteriaMet = criteriaMet && test;
    }

    // Composition
    if (searchJSON.composition) {
      test = database.SongStringCompare2(song, 'composition', searchJSON.compositionTerm);
      criteriaMet = criteriaMet && test;
    }

    // Arrangement
    if (searchJSON.arrangement) {
      test = database.SongStringCompare2(song, 'arrangement', searchJSON.arrangementTerm);
      criteriaMet = criteriaMet && test;
    }

    // Genre
    if (searchJSON.genre) {
      test = database.SongStringCompare2(song, 'genre', searchJSON.genreTerm);
      criteriaMet = criteriaMet && test;
    }

    // BPM
    if (searchJSON.bpm) {
      // const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      let songBPM;
      if (Array.isArray(song.bpm)) {
        songBPM = [];
        for (let num = 0; num < song.bpm.length; num++) {
          songBPM.push(parseInt(song.bpm[num].replace(/[^\d]/g, ''), 10));
        }
      } else {
        songBPM = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      }
      range = (searchJSON.bpmRange ? 10 : 0);
      test = database.SongIntCompare2({ bpm: songBPM }, 'bpm', searchJSON.bpmTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Beginner
    if (searchJSON.beginner) {
      range = (searchJSON.beginnerRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'beginnerrating', searchJSON.beginnerTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Single Normal
    if (searchJSON.spn) {
      range = (searchJSON.spnRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'spnrating', searchJSON.spnTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Single Hyper
    if (searchJSON.sph) {
      range = (searchJSON.sphRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'sphrating', searchJSON.sphTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Single Another
    if (searchJSON.spa) {
      range = (searchJSON.spaRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'sparating', searchJSON.spaTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Single Leggendaria
    if (searchJSON.spl) {
      range = (searchJSON.splRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'splrating', searchJSON.splTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Double Normal
    if (searchJSON.dpn) {
      range = (searchJSON.dpnRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'dpnrating', searchJSON.dpnTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Double Hyper
    if (searchJSON.dph) {
      range = (searchJSON.dphRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'dphrating', searchJSON.dphTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Double Another
    if (searchJSON.dpa) {
      range = (searchJSON.dpaRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'dparating', searchJSON.dpaTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // Double Leggendaria
    if (searchJSON.dpl) {
      range = (searchJSON.dpkaRange ? 1 : 0);
      test = database.SongIntCompare2(song, 'dplrating', searchJSON.dplTerm, range);
      criteriaMet = criteriaMet && test;
    }

    // DETERMINING IF EVERY CHART SHOULD BE CHECKED (for Note Count + Note Type checks)
    const checkEvery = checkEveryChart(searchJSON);

    // Note Count
    if (searchJSON.notecount) {
      // Getting the notecount term as a number + Defining whether there is a range
      const noteCount = parseInt(searchJSON.notecountTerm, 10);
      range = (searchJSON.notecountRange ? 25 : 0);
      // Doing the checks for the note counts
      test = false;
      if (checkEvery || searchJSON.beginner) {
        test = test || database.SongIntCompare2(song, 'beginnernotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.spn) {
        test = test || database.SongIntCompare2(song, 'spnnotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.sph) {
        test = test || database.SongIntCompare2(song, 'sphnotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.spa) {
        test = test || database.SongIntCompare2(song, 'spanotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.spl) {
        test = test || database.SongIntCompare2(song, 'splnotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.dpn) {
        test = test || database.SongIntCompare2(song, 'dpnnotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.dph) {
        test = test || database.SongIntCompare2(song, 'dphnotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.dpa) {
        test = test || database.SongIntCompare2(song, 'dpanotecount', noteCount, range);
      }
      if (checkEvery || searchJSON.dpl) {
        test = test || database.SongIntCompare2(song, 'dplnotecount', noteCount, range);
      }
      // Adding the cumulated tests to the criteria met boolean
      criteriaMet = criteriaMet && test;
    }

    // Charge Notes
    if (searchJSON.cn) {
      test = false;
      if (checkEvery || searchJSON.beginner) {
        test = test || (!Number.isNaN(song.beginnercn) && song.beginnercn > 0);
      }
      if (checkEvery || searchJSON.spn) {
        test = test || (!Number.isNaN(song.spncn) && song.spncn > 0);
      }
      if (checkEvery || searchJSON.sph) {
        test = test || (!Number.isNaN(song.sphcn) && song.sphcn > 0);
      }
      if (checkEvery || searchJSON.spa) {
        test = test || (!Number.isNaN(song.spacn) && song.spacn > 0);
      }
      if (checkEvery || searchJSON.spl) {
        test = test || (!Number.isNaN(song.splcn) && song.splcn > 0);
      }
      if (checkEvery || searchJSON.dpn) {
        test = test || (!Number.isNaN(song.dpncn) && song.dpncn > 0);
      }
      if (checkEvery || searchJSON.dph) {
        test = test || (!Number.isNaN(song.dphcn) && song.dphcn > 0);
      }
      if (checkEvery || searchJSON.dpa) {
        test = test || (!Number.isNaN(song.dpacn) && song.dpacn > 0);
      }
      if (checkEvery || searchJSON.dpl) {
        test = test || (!Number.isNaN(song.dplcn) && song.dplcn > 0);
      }
      criteriaMet = criteriaMet && test;
    }

    // Backspin Scratches
    if (searchJSON.bs) {
      test = false;
      if (checkEvery || searchJSON.spn) {
        test = test || (!Number.isNaN(song.spnbs) && song.spnbs > 0);
      }
      if (checkEvery || searchJSON.sph) {
        test = test || (!Number.isNaN(song.sphbs) && song.sphbs > 0);
      }
      if (checkEvery || searchJSON.spa) {
        test = test || (!Number.isNaN(song.spabs) && song.spabs > 0);
      }
      if (checkEvery || searchJSON.spl) {
        test = test || (!Number.isNaN(song.splbs) && song.splbs > 0);
      }
      if (checkEvery || searchJSON.dpn) {
        test = test || (!Number.isNaN(song.dpnbs) && song.dpnbs > 0);
      }
      if (checkEvery || searchJSON.dph) {
        test = test || (!Number.isNaN(song.dphbs) && song.dphbs > 0);
      }
      if (checkEvery || searchJSON.dpa) {
        test = test || (!Number.isNaN(song.dpabs) && song.dpabs > 0);
      }
      if (checkEvery || searchJSON.dpl) {
        test = test || (!Number.isNaN(song.dplbs) && song.dplbs > 0);
      }
      criteriaMet = criteriaMet && test;
    }

    // Hell Charge Notes
    if (searchJSON.hellcn) {
      test = false;
      if (checkEvery || searchJSON.spn) {
        test = test || (!Number.isNaN(song.spnhellcn) && song.spnhellcn > 0);
      }
      if (checkEvery || searchJSON.sph) {
        test = test || (!Number.isNaN(song.sphhellcn) && song.sphhellcn > 0);
      }
      if (checkEvery || searchJSON.spa) {
        test = test || (!Number.isNaN(song.spahellcn) && song.spahellcn > 0);
      }
      if (checkEvery || searchJSON.spl) {
        test = test || (!Number.isNaN(song.splhellcn) && song.splhellcn > 0);
      }
      if (checkEvery || searchJSON.dpn) {
        test = test || (!Number.isNaN(song.dpnhellcn) && song.dpnhellcn > 0);
      }
      if (checkEvery || searchJSON.dph) {
        test = test || (!Number.isNaN(song.dphhellcn) && song.dphhellcn > 0);
      }
      if (checkEvery || searchJSON.dpa) {
        test = test || (!Number.isNaN(song.dpahellcn) && song.dpahellcn > 0);
      }
      if (checkEvery || searchJSON.dpl) {
        test = test || (!Number.isNaN(song.dplhellcn) && song.dplhellcn > 0);
      }
      criteriaMet = criteriaMet && test;
    }

    // Hell Backspin Scratches
    if (searchJSON.hellbs) {
      test = false;
      if (checkEvery || searchJSON.spn) {
        test = test || (!Number.isNaN(song.spnhellbs) && song.spnhellbs > 0);
      }
      if (checkEvery || searchJSON.sph) {
        test = test || (!Number.isNaN(song.sphhellbs) && song.sphhellbs > 0);
      }
      if (checkEvery || searchJSON.spa) {
        test = test || (!Number.isNaN(song.spahellbs) && song.spahellbs > 0);
      }
      if (checkEvery || searchJSON.spl) {
        test = test || (!Number.isNaN(song.splhellbs) && song.splhellbs > 0);
      }
      if (checkEvery || searchJSON.dpn) {
        test = test || (!Number.isNaN(song.dpnhellbs) && song.dpnhellbs > 0);
      }
      if (checkEvery || searchJSON.dph) {
        test = test || (!Number.isNaN(song.dphhellbs) && song.dphhellbs > 0);
      }
      if (checkEvery || searchJSON.dpa) {
        test = test || (!Number.isNaN(song.dpahellbs) && song.dpahellbs > 0);
      }
      if (checkEvery || searchJSON.dpl) {
        test = test || (!Number.isNaN(song.dplhellbs) && song.dplhellbs > 0);
      }
      criteriaMet = criteriaMet && test;
    }

    // First Style
    if (searchJSON.firststyle) {
      // Attempting to parse the term to an integer
      let styleNum = parseInt(searchJSON.firststyleTerm, 10);
      if (Number.isNaN(styleNum)) styleNum = 0;
      styleNum = Math.max(Math.min(styleNum, iidxStyles.length - 1), 0);
      test = database.SongStringCompare2(song, 'firstgame', iidxStyles[styleNum].toLowerCase(), true);
      test = test || database.SongStringCompare2(song, 'othergames', iidxStyles[styleNum].toLowerCase(), true);
      criteriaMet = criteriaMet && test;
    }

    // VJ
    if (searchJSON.vj) {
      test = database.SongStringCompare2(song, 'vj', searchJSON.vjTerm);
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

  // Defining the chart name by simple difficulty search parameters
  if (searchJSON.dpl) {
    name = `Double Leggendaria (${song.dplrating})`;
  } else if (searchJSON.dpa) {
    name = `Double Another (${song.dparating})`;
  } else if (searchJSON.dph) {
    name = `Double Hyper (${song.dphrating})`;
  } else if (searchJSON.dpn) {
    name = `Double Normal (${song.dpnrating})`;
  } else if (searchJSON.spl) {
    name = `Single Leggendaria (${song.splrating})`;
  } else if (searchJSON.spa) {
    name = `Single Another (${song.sparating})`;
  } else if (searchJSON.sph) {
    name = `Single Hyper (${song.sphrating})`;
  } else if (searchJSON.spn) {
    name = `Single Normal (${song.spnrating})`;
  } else if (searchJSON.beginner) {
    name = `Beginner (${song.beginnerrating})`;
  }

  // IF the chart difficulty has not been defined + There was a requested note count...
  if (name.length === 0 && searchJSON.notecount && !Number.isNaN(searchJSON.notecountTerm)) {
    // Defining the range variable
    const range = (searchJSON.notecountRange ? 25 : 0);

    // Checking the note count of each chart (rarest -> most common)
    if (database.SongIntCompare2(song, 'dplnotecount', searchJSON.notecountTerm, range)) {
      name = `Double Leggendaria (${song.dplrating})`;
    } else if (database.SongIntCompare2(song, 'dpanotecount', searchJSON.notecountTerm, range)) {
      name = `Double Another (${song.dparating})`;
    } else if (database.SongIntCompare2(song, 'dphnotecount', searchJSON.notecountTerm, range)) {
      name = `Double Hyper (${song.dphrating})`;
    } else if (database.SongIntCompare2(song, 'dpnnotecount', searchJSON.notecountTerm, range)) {
      name = `Double Normal (${song.dpnrating})`;
    } else if (database.SongIntCompare2(song, 'splnotecount', searchJSON.notecountTerm, range)) {
      name = `Single Leggendaria (${song.splrating})`;
    } else if (database.SongIntCompare2(song, 'spanotecount', searchJSON.notecountTerm, range)) {
      name = `Single Another (${song.sparating})`;
    } else if (database.SongIntCompare2(song, 'sphnotecount', searchJSON.notecountTerm, range)) {
      name = `Single Hyper (${song.sphrating})`;
    } else if (database.SongIntCompare2(song, 'spnnotecount', searchJSON.notecountTerm, range)) {
      name = `Single Normal (${song.spnrating})`;
    } else if (database.SongIntCompare2(song, 'beginnernotecount', searchJSON.notecountTerm, range)) {
      name = `Beginner (${song.beginnerrating})`;
    }
  }

  // Returning the chart name
  return name;
}

// miscProperties()
function miscProperties(song, searchJSON) {
  // Defining the miscellaneous properties object
  const otherProps = {};

  // Setting the other properties to record
  if (searchJSON.composition) {
    otherProps.Composition = database.FormatArrayForString(song.composition, 999, false);
  }
  if (searchJSON.arrangement) {
    otherProps.Arrangement = database.FormatArrayForString(song.arrangement, 999, false);
  }
  if (searchJSON.genre) {
    otherProps.Genre = song.genre;
  }
  if (searchJSON.bpm) {
    otherProps.BPM = database.FormatArrayForString(song.bpm, 999, false);
  }

  // Returning the miscellaneous properties object
  return otherProps;
}

// sortCategory()
function sortCategory(song) {
  // Defining the IIDX game to use
  let gameToUse = -1;

  // Cycling through the first game property
  if (Array.isArray(song.firstgame)) {
    for (let num = 0; gameToUse === -1 && num < song.firstgame.length; num++) {
      gameToUse = iidxStyles.indexOf(song.firstgame[num]);
    }
  } else if (typeof song.firstgame === 'string') {
    gameToUse = iidxStyles.indexOf(song.firstgame);
  }

  // Cycling through the other games
  if (gameToUse === -1 && Array.isArray(song.othergames)) {
    for (let num = 0; gameToUse === -1 && num < song.othergames.length; num++) {
      gameToUse = iidxStyles.indexOf(song.othergames[num]);
    }
  } else if (gameToUse === -1 && typeof song.othergames === 'string') {
    gameToUse = iidxStyles.indexOf(song.othergames);
  }

  // Defining the return string
  let categoryStr = '';
  if (gameToUse > -1) {
    categoryStr = `(Style: **${iidxStyles[gameToUse]}**)`;
  }

  // Returning the sort category
  return categoryStr;
}

// helpShort()
function helpShort() {
  const exceptions = [
    'composition',
    'arrangement',
    'bpm',
    'genre',
    'spl',
    'dpl',
    'notecount',
    'cn',
    'bs',
    'hellcn',
    'hellbs',
    'vj',
  ];
  return database.HelpFromSearchParams(searchParams, identities[0], exceptions);
}

// helpFull()
function helpFull() {
  return database.HelpFromSearchParams(searchParams, identities[0]);
}

// Setting up the exports
module.exports = {
  ModuleName: 'IIDX26',
  FullGameName: 'IIDX 26 Rootage',
  CommandIdentities: identities,
  Header: header,
  Load: loadSongs,
  Songs: iidx26Songs,
  Format: format,
  SearchParams: searchParams,
  Search: search,
  ChartName: chartName,
  MiscProperties: miscProperties,
  SortCategory: sortCategory,
  Help: helpShort,
  Help2: helpFull,
};
