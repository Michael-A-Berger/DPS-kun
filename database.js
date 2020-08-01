// Modules
const fs = require('fs');

// Constant Variables
const modulesLocation = './database-modules';
const moduleExports = [
  'ModuleName',
  'FullGameName',
  'CommandIdentities',
  'Load',
  'Songs',
  'Format',
  'Search',
  'Help',
  'Help2',
];
let loadedModules = [];
let identityDictionary = [];

/* =================================
 * ===== SEARCH HELP FUNCTIONS =====
 * =================================
 */

// songStringCompare()
function songStringCompare(song, property, exact, matchPhrase, equal = false) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF we're looking for an exact match...
    if (exact) {
      // IF an equal match is requested, check if the strings are equal (barring letter case)
      if (equal) {
        result = song[property].toLowerCase() === matchPhrase;
      } else {
        // ELSE check if the matching phrase exists in the string
        result = (song[property].toLowerCase().indexOf(matchPhrase) > -1);
      }
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

// loadModules()
function loadModules() {
  fs.readdirSync(modulesLocation).forEach((file) => {
    if (file.endsWith('.js')) {
      const databaseMod = require(`${modulesLocation}/${file}`);
      let passedCheck = true;
      for (let num = 0; num < moduleExports.length; num++) {
        if (databaseMod[moduleExports[num]] === undefined) {
          console.log(`\nERROR: The '${moduleExports[num]}' export of [${file}] is undefined!`);
          passedCheck = false;
        }
      }
      if (passedCheck) {
        module.exports[databaseMod.ModuleName] = databaseMod;
        loadedModules[databaseMod.ModuleName] = databaseMod;
        databaseMod.CommandIdentities.forEach((identity) => {
          identityDictionary[identity] = databaseMod.ModuleName;
        });
        databaseMod.Load();
      }
    }
  });
}

// unloadModules()
function unloadModules() {
  fs.readdirSync(modulesLocation).forEach((file) => {
    if (file.endsWith('.js')) {
      const databaseMod = require.resolve(`${modulesLocation}/${file}`);
      loadedModules = loadedModules.splice(0, 1);
      delete require.cache[databaseMod];
    }
  });
  identityDictionary = [];
}

// identityToModName()
function identityToModName(id) {
  return identityDictionary[id];
}

// supportedGames()
function supportedGames() {
  let support = 'Supported Games:\n```';
  const modNames = Object.keys(loadedModules);
  let longestName = -1;
  modNames.forEach((name) => {
    if (longestName < loadedModules[name].FullGameName.length) {
      longestName = loadedModules[name].FullGameName.length;
    }
  });
  modNames.forEach((name) => {
    let newStr = loadedModules[name].FullGameName;
    while (newStr.length < longestName + 2) newStr += '\xa0';
    newStr += `[${loadedModules[name].CommandIdentities.toString().replace(/,/g, ', ')}]\n`;
    support += newStr;
  });
  support += '```';
  return support;
}

// Setting up the generic exports
module.exports = {
  LoadModules: loadModules,
  UnloadModules: unloadModules,
  IdentityToModuleName: identityToModName,
  SupportedGames: supportedGames,
  Modules: loadedModules,
  SongStringCompare: songStringCompare,
  SongIntCompare: songIntCompare,
};
