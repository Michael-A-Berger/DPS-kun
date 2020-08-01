// Modules
const fs = require('fs');

const database = require(`${__dirname}/../database.js`);

// Constant variables
const songFile = `${__dirname}/../database/iidx-ultimate-mobile.csv`;
const identities = ['iidxmobile', 'iidxm'];
const iidxmSongs = [];

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

  // Splitting up the parameter string
  const params = paramString.toLowerCase().split(' ');

  // =================================
  // ===== PARSING SONG CRITERIA =====
  // =================================

  // Defining the match variables
  let genreToMatch = '';
  let exactGenre;
  let nameToMatch = '';
  let exactName;
  let artistToMatch = '';
  let exactArtist;
  let bpmToMatch = '';
  let exactBpm;
  let beginnerToMatch = NaN;
  let exactBeginner;
  let spnToMatch = NaN;
  let exactSPN;
  let sphToMatch = NaN;
  let exactSPH;
  let spaToMatch = NaN;
  let exactSPA;
  let styleToMatch = '';
  let exactStyle;
  let originToMatch = '';
  let exactOrigin;
  let priceToMatch = '';
  let exactPrice;
  let exactRemoved = false;

  // Processing the passed parameters
  let currentParam = '';
  let colonPos = -1;
  let paramFound = false;
  for (let num = 0; num < params.length; num++) {
    // Getting the current parameter
    currentParam = params[num];
    paramFound = false;

    // Genre
    if (!paramFound && currentParam.startsWith('genre')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactGenre = true;
        genreToMatch = currentParam.substr(colonPos + 1);
      } else { exactGenre = false; }
    }

    // Name
    if (!paramFound && currentParam.startsWith('name')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactName = true;
        nameToMatch = currentParam.substr(colonPos + 1);
      } else { exactName = false; }
    }

    // Artist
    if (!paramFound && currentParam.startsWith('artist')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactArtist = true;
        artistToMatch = currentParam.substr(colonPos + 1);
      } else { exactArtist = false; }
    }

    // BPM
    if (!paramFound && currentParam.startsWith('bpm')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactBpm = true; } else { exactBpm = false; }
        bpmToMatch = currentParam.substr(colonPos + (exactBpm ? 1 : 2));
      } else { exactBpm = false; }
    }

    // Beginner
    if (!paramFound && currentParam.startsWith('beginner')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactBeginner = true; } else { exactBeginner = false; }
        beginnerToMatch = parseInt(currentParam.substr(colonPos + (exactBeginner ? 1 : 2)), 10);
      } else { exactBeginner = false; }
    }

    // SPN
    if (!paramFound && currentParam.startsWith('normal')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSPN = true; } else { exactSPN = false; }
        spnToMatch = parseInt(currentParam.substr(colonPos + (exactSPN ? 1 : 2)), 10);
      } else { exactSPN = false; }
    }

    // SPH
    if (!paramFound && currentParam.startsWith('hyper')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSPH = true; } else { exactSPH = false; }
        sphToMatch = parseInt(currentParam.substr(colonPos + (exactSPH ? 1 : 2)), 10);
      } else { exactSPH = false; }
    }

    // SPA
    if (!paramFound && currentParam.startsWith('another')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        if (currentParam[colonPos + 1] !== '~') { exactSPA = true; } else { exactSPA = false; }
        spaToMatch = parseInt(currentParam.substr(colonPos + (exactSPA ? 1 : 2)), 10);
      } else { exactSPA = false; }
    }

    // Style
    if (!paramFound && currentParam.startsWith('style')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactStyle = true;
        styleToMatch = currentParam.substr(colonPos + 1);
      } else { exactStyle = false; }
    }

    // Origin
    if (!paramFound && currentParam.startsWith('origin')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactOrigin = true;
        originToMatch = currentParam.substr(colonPos + 1);
      } else { exactOrigin = false; }
    }

    // Price
    if (!paramFound && currentParam.startsWith('price')) {
      paramFound = true;
      colonPos = currentParam.indexOf(':');
      if (colonPos !== -1) {
        exactPrice = true;
        priceToMatch = currentParam.substr(colonPos + 1);
      } else { exactPrice = false; }
    }

    // Removed
    if (!paramFound && currentParam.startsWith('allsongs')) {
      paramFound = true;
      exactRemoved = undefined;
    }
    if (!paramFound && currentParam.startsWith('removed')) {
      paramFound = true;
      exactRemoved = true;
    }
  }

  // ==================================
  // ===== GETTING MATCHING SONGS =====
  // ==================================
  let criteriaMet = true;
  songMatches = iidxmSongs.filter((song) => {
    // Resetting the Criteria Met boolean
    criteriaMet = true;

    // Genre
    if (exactGenre !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'genre', exactGenre, genreToMatch);
    }

    // Name
    if (exactName !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'name', exactName, nameToMatch);
    }

    // Artist
    if (exactArtist !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'artist', exactArtist, artistToMatch);
    }

    // BPM
    if (exactBpm !== undefined) {
      const matchBpm = parseInt(bpmToMatch.replace(/[^\d]/g, ''), 10);
      const songBpm = parseInt(song.bpm.replace(/[^\d]/g, ''), 10);
      criteriaMet = criteriaMet && database.SongIntCompare({ bpm: songBpm }, 'bpm', exactBpm, matchBpm, 10);
    }

    // Beginner
    if (exactBeginner !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'beginner', exactBeginner, beginnerToMatch, 1);
    }

    // SPN
    if (exactSPN !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'spn', exactSPN, spnToMatch, 1);
    }

    // SPH
    if (exactSPH !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'sph', exactSPH, sphToMatch, 1);
    }

    // SPA
    if (exactSPA !== undefined) {
      criteriaMet = criteriaMet && database.SongIntCompare(song, 'spa', exactSPA, spaToMatch, 1);
    }

    // Style
    if (exactStyle !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'style', exactStyle, styleToMatch, true);
    }

    // Origin
    if (exactOrigin !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'origin', exactOrigin, originToMatch, true);
    }

    // Price
    if (exactPrice !== undefined) {
      criteriaMet = criteriaMet && database.SongStringCompare(song, 'price', exactPrice, priceToMatch);
    }

    // Removed
    if (exactRemoved !== undefined) {
      if (exactRemoved) {
        criteriaMet = criteriaMet && database.SongStringCompare(song, 'removed', true, 'yes', true);
      } else {
        criteriaMet = criteriaMet && (song.removed === '');
      }
    }

    return criteriaMet;
  });

  // Returning the array of matching songs
  return songMatches;
}

// help()
function help() {
  const str = `Proper Usage:\n\`\`\`<dps_cmd> ${identities[0]} [name:?] [artist:?] [beginner] [normal] `
              + '[hyper] [another] [style:?] [price:?]\n\n'
              + '- [name:?]    = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '- [beginner]  = Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [normal]    = Song must have a Normal difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hyper]     = Song must have a Hyper difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [another]   = Song must have an Another difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [style:?]   = \'?\' is the style the song is sorted under in-game (Options: 1 -> 27, mobile)\n'
              + '- [price:?]   = Whether the song costs money to play (Options: free, subscription)\n'
              + `\`\`\`(Issue \` <dps_cmd> ${identities[0]} help2 \` for all options)`;
  return str;
}

function help2() {
  const str = `Proper Usage:\n\`\`\`<dps_cmd> ${identities[0]} [name:?] [artist:?] [genre:?] [bpm:?] `
              + '[beginner] [normal] [hyper] [another] [style:?] [origin:?] [price:?] [allsongs/removed]\n\n'
              + '- [name:?]    = Song name contains \'?\' (no spaces)\n'
              + '- [artist:?]  = Song artist name contains \'?\' (no spaces)\n'
              + '- [genre:?]   = Song genre name contains \'?\' (no spaces)\n'
              + '- [bpm:#]     = Song\'s BPM exactly matches \'#\' (prepend \'~\' for range of -/+ 10 BPM)\n'
              + '- [beginner]  = Song must have a Beginner difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [normal]    = Song must have a Normal difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [hyper]     = Song must have a Hyper difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [another]   = Song must have an Another difficulty chart (append \':#\' for exact difficulty, \':~#\' for range)\n'
              + '- [style:?]   = \'?\' is the style the song is sorted under in-game (Options: 1 -> 27, mobile)\n'
              + '- [origin:?]  = \'?\' is the original IIDX game the song first apeared in (Options: 1 -> 27, substream, 3CS -> 16CS, mobile)\n'
              + '- [price:?]   = Whether the song costs money to play (Options: free, subscription)\n'
              + '- [allsongs]  = Includes both playable and removed songs\n'
              + '- [removed]   = Only returns removed songs\n'
              + '```';
  return str;
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
  Help: help,
  Help2: help2,
};
