// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const header = '\:books:\:dvd:\:musical_keyboard:';
const songFile = `${__dirname}/../database/iidx-26-rootage.csv`;
const identities = ['iidx26rootage', 'rootage', 'iidx26'];
const iidx26Songs = [];
const searchParams = {};
const noCommaInParenthesesRegex = /,\s*(?![^\[\(]*[\]\)])/g;

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
searchParams.firststyle = database.DefineSearchParam('The IIDX style the song first appeared in (Options: 1 -> 26, substream)', '', ':?');
searchParams.notecount = database.DefineSearchParam('Note count on one of the song\'s charts must match \'#\' (prepend \'~\' for range of -/+ 20)', 1, ':#');
searchParams.cn = database.DefineSearchParam('Only returns songs with charts that have Charge Notes', '');
searchParams.bs = database.DefineSearchParam('Only returns songs with charts that have Backspin Scratches', '');
searchParams.hellcn = database.DefineSearchParam('Only returns songs with charts that have Hell Charge Notes', '');
searchParams.hellbs = database.DefineSearchParam('Only returns songs with charts that have Hell Backspin Scratches', '');
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
  const counter = 0;
  const nextCommaPos = -1;

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
          let newProp = songString[propNum].split(noCommaInParenthesesRegex);
          if (newProp.length === 1) newProp = newProp[0];
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

// formatArrayForString()
function formatArrayForString(propArray, limit = 999) {
  // Defining the print string
  let printStr = '';
  
  // Formatting the print string
  for (let num = 0; num < propArray.length && num < limit; num++) {
    if (num === propArray.length - 1) printStr += '& ';
    printStr += `**${propArray[num]}**`;
    if (num < propArray.length - 1) printStr += ', ';
  }
  if (limit < propArray.length) {
    printStr += `& ${propArray.length - limit} others`;
  }
  
  // Returning the print string
  return printStr;
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
  songStr += `\n- Genre: **${song.genre}**`;
  songStr += `\n- BPM: **${song.bpm}**`;
  songStr += '\n- Charts:';
  
  // Difficulty - Beginner
  if (!Number.isNaN(song.beginnerrating)) {
    songStr += `\n\t\t**Beginner (${song.beginnerrating})** [`;
    songStr += `${song.beginnernotecount} Total Notes`;
    if (!Number.isNaN(song.beginnercn)) {
      songStr += ` - ${song.beginnercn} Charge Notes`;
    }
    songStr += ']';
  }
  // Difficulty - Single Normal
  if (!Number.isNaN(song.spnrating)) {
    songStr += `\n\t\t**Single Normal (${song.spnrating})** [`;
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
    songStr += `\n\t\t**Single Hyper (${song.sphrating})** [`;
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
    songStr += `\n\t\t**Single Another (${song.sparating})** [`;
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
    songStr += ']'
  }
  // Difficulty - Single Leggendaria
  if (!Number.isNaN(song.splrating)) {
    songStr += `\n\t\t**Single Leggendaria (${song.splrating})** [`;
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
    songStr += `\n\t\t**Double Normal (${song.dpnrating})** [`;
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
    songStr += `\n\t\t**Double Hyper (${song.dphrating})** [`;
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
    songStr += `\n\t\t**Double Another (${song.dparating})** [`;
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
    songStr += `\n\t\t**Double Leggendaria (${song.dplrating})** [`;
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
  songStr += `\n- First BEMANI Game: ${formatArrayForString(song.firstgame, 3)}`;
  if (song.othergames.length > 0) {
    songStr += `\n- Other BEMANI Game Appearances: ${formatArrayForString(song.othergames, 3)}`;
  }
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
  let range = false;
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
      range = searchJSON.bpmRange;
      test = database.SongIntCompare2({ bpm: songBpm }, 'bpm', searchJSON.bpmTerm, (range ? 10 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Beginner
    if (searchJSON.beginner) {
      range = searchJSON.beginnerRange;
      test = database.SongIntCompare2(song, 'beginnerrating', searchJSON.beginnerTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Normal
    if (searchJSON.spn) {
      range = searchJSON.spnRange;
      test = database.SongIntCompare2(song, 'spnrating', searchJSON.spnTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Hyper
    if (searchJSON.sph) {
      range = searchJSON.sphRange;
      test = database.SongIntCompare2(song, 'sphrating', searchJSON.sphTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Another
    if (searchJSON.spa) {
      range = searchJSON.spaRange;
      test = database.SongIntCompare2(song, 'sparating', searchJSON.spaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Single Leggendaria
    if (searchJSON.spl) {
      range = searchJSON.splRange;
      test = database.SongIntCompare2(song, 'splrating', searchJSON.splTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Normal
    if (searchJSON.dpn) {
      range = searchJSON.dpnRange;
      test = database.SongIntCompare2(song, 'dpnrating', searchJSON.dpnTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Hyper
    if (searchJSON.dph) {
      range = searchJSON.dphRange;
      test = database.SongIntCompare2(song, 'dphrating', searchJSON.dphTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Another
    if (searchJSON.dpa) {
      range = searchJSON.dpaRange;
      test = database.SongIntCompare2(song, 'dparating', searchJSON.dpaTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // Double Leggendaria
    if (searchJSON.dpl) {
      range = searchJSON.dpkaRange;
      test = database.SongIntCompare2(song, 'dplrating', searchJSON.dplTerm, (range ? 1 : 0));
      criteriaMet = criteriaMet && test;
    }

    // First Style
    if (searchJSON.firststyle) {
      // Attempting to parse the term to an integer
      let styleNum = parseInt(searchJSON.firststyleTerm, 10);
      if (Number.isNaN(styleNum)) styleNum = 0;
      styleNum = Math.min(Math.max(styleNum, iidxStyles.length - 1), 0);
      test = database.SongStringCompare2(song, 'firstgame', iidxStyles[styleNum].toLowerCase(), true);
      test = test || database.SongStringCompare2(song, 'othergames', iidxStyles[styleNum].toLowerCase(), true);
      criteriaMet = criteriaMet && test;
    }
    
    // Note Count
    if (searchJSON.notecount) {
      console.log(`ERROR: 'notecount' search property not defined!`);
    }
    
    // Charge Notes
    if (searchJSON.cn) {
      console.log(`ERROR: 'cn' search property not defined!`);
    }
    
    // Backspin Scratches
    if (searchJSON.notecount) {
      console.log(`ERROR: 'bs' search property not defined!`);
    }
    
    // Hell Charge Notes
    if (searchJSON.hellcn) {
      console.log(`ERROR: 'hellcn' search property not defined!`);
    }
    
    // Hell Backspin Scratches
    if (searchJSON.notecount) {
      console.log(`ERROR: 'hellbs' search property not defined!`);
    }
    
    // VJ
    if (searchJSON.vj) {
      test = database.SongStringCompare2(song, 'vj', searhJSON.vjTerm);
      criteriaMet = criteriaMet && test;
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// helpShort()
function helpShort() {
  const exceptions = [
    'composition',
    'arrangement',
    'bpm',
    'genre',
    'beginner',
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
  Load: loadSongs,
  Songs: iidx26Songs,
  Format: format,
  Search: search,
  Help: helpShort,
  Help2: helpFull,
};
