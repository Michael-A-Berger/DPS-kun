// Modules
const fs = require('fs');

// Constant Variables
const modulesLocation = './database-modules';
const moduleExports = [
  'ModuleName',
  'FullGameName',
  'CommandIdentities',
  'Header',
  'Load',
  'Songs',
  'Format',
  'SearchParams',
  'Search',
  'ChartName',
  'MiscProperties',
  'SortCategory',
  'Help',
  'Help2',
];
let loadedModules = [];
let identityDictionary = [];
const noCommaInParenthesesRegex = /,\s*(?![^\[\(]*[\]\)])/g;

/* =================================
 * ===== MODULE HELP FUNCTIONS =====
 * =================================
 */

// parseStringFromCSV()
function parseStringFromCSV(str) {
  // Copying the passed-in string to another variable
  let csvStr = str;

  // Defining the parsed string array + counter variable + the next comma variable
  const parsedStr = [];
  let counter = 0;
  let nextCommaPos = 0;

  // WHILE the copied CSV string still has data...
  // while (csvStr.length > 0) {
  while (csvStr !== '🔣') {
    // IF the CSV string starts with a quote, find the next instance of a quote w/ a comma right after it
    if (csvStr.startsWith('"')) {
      nextCommaPos = csvStr.indexOf('",');
      // IF the next comma was found, parse the value and do another loop
      if (nextCommaPos > -1) {
        parsedStr[counter] = csvStr.substr(1, nextCommaPos - 1).replace(/\"\"+/g, '"');
        csvStr = csvStr.substr(nextCommaPos + 2);
      } else {
        // ELSE... (the next comma was NOT found, ergo just get until the end of the string)
        parsedStr[counter] = csvStr.substr(1, csvStr.length - 2).replace(/\"\"+/g, '"');
        csvStr = '🔣';
      }
    } else {
      // ELSE... (CSV string does NOT start with a quote, so find the next comma)
      nextCommaPos = csvStr.indexOf(',');
      // IF the next comma was found, parse the value and do another loop
      if (nextCommaPos > -1) {
        parsedStr[counter] = csvStr.substr(0, nextCommaPos);
        csvStr = csvStr.substr(nextCommaPos + 1);
      } else {
        // ELSE... (the next comma was NOT found, ergo just get until the end of the string)
        parsedStr[counter] = csvStr;
        csvStr = '🔣';
      }
    }
    counter++;
  }

  // Returning the parsed array
  return parsedStr;
}

// defineSearchParam()
function defineSearchParam(desc, tp = undefined, apnd = '') {
  return {
    append: apnd,
    description: desc,
    type: (tp !== undefined ? typeof tp : tp),
  };
}

// searchTextToJSON()
function searchTextToJSON(searchParams, searchText) {
  // Getting the search parameters by name
  const searchNames = Object.keys(searchParams);

  // Defining the search JSON object
  const searchJSON = {};
  searchNames.forEach((param) => {
    // console.log(`${param}.type:\t${searchParams[param].type}`);
    searchJSON[param] = false;
    switch (searchParams[param].type) {
      case 'string':
        searchJSON[`${param}Term`] = '';
        break;
      case 'number':
        searchJSON[`${param}Term`] = NaN;
        searchJSON[`${param}Range`] = false;
        break;
      default:
        // Do nothing
        break;
    }
  });

  // Parsing the search text
  const params = searchText.toLowerCase().split(' ');
  let colonPos = -1;
  let paramFound = false;
  params.forEach((currentParam) => {
    // Resetting the "Parameter Found" boolean
    paramFound = false;

    // FOREACH search parameter
    let range = false;
    searchNames.forEach((srchParam) => {
      // IF the parameter was not already found AND the parameter is a valid search parameter
      if (!paramFound && currentParam.startsWith(srchParam)) {
        // Set the search JSON parameter to true
        paramFound = true;
        searchJSON[srchParam] = true;

        // IF the parameter has a term, get the term
        colonPos = currentParam.indexOf(':');
        if (colonPos > -1) {
          switch (searchParams[srchParam].type) {
            case 'string':
              searchJSON[`${srchParam}Term`] = currentParam.substr(colonPos + 1);
              break;
            case 'number':
              range = (currentParam[colonPos + 1] === '~');
              searchJSON[`${srchParam}Range`] = range;
              searchJSON[`${srchParam}Term`] = parseFloat(currentParam.substr(colonPos + (range ? 2 : 1)));
              break;
            default:
              // Do nothing
              break;
          }
        }
      }
    });
  });

  // Returning the search JSON
  return searchJSON;
}

// songStringCompare()
function songStringCompare(song, property, matchPhrase, equal = false) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF the match phrase is not empty...
    if (matchPhrase !== undefined && matchPhrase.length > 0) {
      // IF we're looking for an equal match, check if the match phrase is the property
      if (equal) {
        if (Array.isArray(song[property])) {
          for (let num = 0; !result && num < song[property].length; num++) {
            result = (song[property][num].toLowerCase() === matchPhrase);
          }
        } else {
          result = (song[property].toLowerCase() === matchPhrase);
        }
      } else {
        // ELSE just check if the match phrase exists in the property
        result = (song[property].toString().toLowerCase().indexOf(matchPhrase) > -1);
      }
    } else {
      // ELSE just check if the property is defined
      result = (song[property] !== undefined && song[property].length > 0);
    }
  }

  // Returning the result
  return result;
}

// songIntCompare()
function songIntCompare(song, property, matchNum, range = 0) {
  // Defining the result variable to return
  let result = false;

  // IF the song exists...
  if (song !== undefined) {
    // IF the match number is defined, return return whether the property is within the range
    if (!Number.isNaN(matchNum)) {
      if (Array.isArray(song[property])) {
        for (let num = 0; !result && num < song[property].length; num++) {
          result = (matchNum - range <= song[property][num] && song[property][num] <= matchNum + range);
        }
      } else {
        result = (matchNum - range <= song[property] && song[property] <= matchNum + range);
      }
    } else {
      // ELSE check if the property is defined
      result = !Number.isNaN(song[property]);
    }
  }

  // Returning the result
  return result;
}

// formatArrayForString()
function formatArrayForString(propArray, limit = 999, boldNames = true) {
  // Defining the print string + early definition boolean
  let printStr = '';

  // IF the property array is an actual array, create the formatted array string
  if (typeof propArray !== 'string' && propArray.length > 1) {
    for (let num = 0; num < propArray.length && num < limit; num++) {
      if (num === propArray.length - 1) printStr += ' and ';
      if (boldNames) printStr += `**${propArray[num]}**`;
      else printStr += propArray[num];
      if (num < propArray.length - 2) printStr += ', ';
    }
    if (limit < propArray.length) {
      printStr += `and ${propArray.length - limit} others`;
    }
  } else if (typeof propArray === 'string') {
    // ELSE IF the property array is just a string, format it accordingly
    printStr = propArray;
    if (boldNames) printStr = `**${printStr}**`;
  } else {
    // ELSE... (the property array is an actual array, get the first element)
    [printStr] = propArray;
    if (boldNames) printStr = `**${printStr}**`;
  }

  // Returning the print string
  return printStr;
}

// helpFromSearchParams()
function helpFromSearchParams(searchParams, gameId, exceptions = []) {
  // Defining the help string
  let str = 'Proper Usage:\n```<dps_cmd> <game_id>';

  // Defining the option string dynamic function
  const optionStr = ((nm) => `[${nm}${searchParams[nm].append}]`);

  // Defining the search options
  let longestOption = -1;
  const searchNames = Object.keys(searchParams);
  searchNames.forEach((name) => {
    if (exceptions.indexOf(name) === -1) {
      const option = optionStr(name);
      if (longestOption < option.length) longestOption = option.length;
      str += ` ${option}`;
    }
  });
  str += '\n\n';

  // Listing the search option descriptions
  searchNames.forEach((name) => {
    if (exceptions.indexOf(name) === -1) {
      let option = `- ${optionStr(name)}`;
      while (option.length < longestOption + 4) option += '\xa0';
      option += `= ${searchParams[name].description}\n`;
      str += option;
    }
  });
  str += '```';

  // Adding the full help message
  if (exceptions.length > 0) {
    str += '(Issue ` <dps_cmd> <game_id> help2 ` for all options)';
  }

  // Replacing the generic game ID instances
  str = str.replace(/<game_id>/g, gameId);

  return str;
}

// reverseEmojis()
function reverseEmoji(emojiStr) {
  let result = '';
  const emojies = emojiStr.split(':\:');
  for (let num = 0; num < emojies.length; num++) {
    if (num !== 0) emojies[num] = `\:${emojies[num]}`;
    if (num !== emojies.length - 1) emojies[num] = `${emojies[num]}:`;
  }
  result = emojies.reverse().toString().replace(/,/g, '');
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
  NoCommaInParenthesesRegex: noCommaInParenthesesRegex,
  ParseStringFromCSV: parseStringFromCSV,
  DefineSearchParam: defineSearchParam,
  SearchTextToJSON: searchTextToJSON,
  SongStringCompare2: songStringCompare,
  SongIntCompare2: songIntCompare,
  FormatArrayForString: formatArrayForString,
  HelpFromSearchParams: helpFromSearchParams,
  ReverseEmoji: reverseEmoji,
};
