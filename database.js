// Modules
const fs = require('fs');

// TEST TEST TEST
const gcpcModule = require('./database-modules/groove-coaster-pc.js');
const msdsModule = require('./database-modules/muse-dash.js');
const prime2Module = require('./database-modules/piu-prime-2.js');
// TEST TEST TEST

// Constant Variables
const newlineChar = process.env.NEWLINE_CHAR;

/* =================================
 * ===== SEARCH HELP FUNCTIONS =====
 * =================================
 */

// songStringCompare()
function songStringCompare(song, property, exact, matchPhrase) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF we're looking for an exact match...
    if (exact) {
      // Checking if the matching phrase exists in the string
      result = (song[property].toLowerCase().indexOf(matchPhrase) > -1);
    } else {
      // ELSE just check if the property exists and is NOT undefined
      result = (song[property] !== undefined);
    }
  }

  // Returning the result
  return result;
}

// songIntCompare()
function songIntCompare(song, property, exact, matchNum, range) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF the passed matching number is defined...
    if (!Number.isNaN(matchNum)) {
      // IF we're looking for an exact match...
      if (exact) {
        // Checking if the property is the same as the matching number
        result = (song[property] === matchNum);
      } else {
        // ELSE check if the property is within the specified range
        result = (matchNum - range <= song[property] && matchNum + range >= song[property]);
      }
    } else {
      // ELSE just check if the property exists and is a number
      result = !Number.isNaN(song[property]);
    }
  }

  // Returning the result
  return result;
}

/* =============================
 * ===== GENERIC FUNCTIONS =====
 * =============================
 */
// loadSongs()
function loadModules() {
  // Loading the song CSVs
  gcpcModule.Load();
  msdsModule.Load();
  prime2Module.Load();
}

// Setting up the exports
module.exports = {
  LoadModules: loadModules,
  SongStringCompare: songStringCompare,
  SongIntCompare: songIntCompare,
};

// TEST TEST TEST
module.exports[gcpcModule.ModuleName] = gcpcModule;
module.exports[msdsModule.ModuleName] = msdsModule;
module.exports[prime2Module.ModuleName] = prime2Module;
// TEST TEST TEST
