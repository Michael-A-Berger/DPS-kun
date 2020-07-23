// Modules
const database = require(`${__dirname}/../../database.js`);

// Constant Variables
const songTypes = ['normal',
  'short',
  'full',
  'remix',
  'all'];
const songChannels = ['original',
  'kpop',
  'jmusic',
  'world',
  'xross'];
const songSeries = ['prime2',
  'prime',
  'nx',
  'nxa',
  'fiestaex',
  'fiesta2',
  'fiesta',
  'extra',
  'prex3',
  'exceed',
  'zero',
  '1st',
  'perfect'];
const songDiffRegex = /[sdSD]\d+$/g;

// Game Variables
let allSongs = [];

// printSong()
function printSong(song) {
  let charts = '';
  let unlocks = '';
  for (let num = 0; num < song.charts.length; num++) { charts += song.charts[num] + (num + 1 < song.charts.length ? ', ' : ''); }
  for (let num = 0; num < song.unlocks.length; num++) { unlocks += song.unlocks[num] + (num + 1 < song.unlocks.length ? ', ' : ''); }

  console.log(`==${song.name}==\nArtist:\t\t${song.artist
  }\nBPM:\t\t${song.bpm}\nCharts:\t\t${charts
  }\nUnlocks:\t${unlocks}\nSeries:\t\t${song.series
  }\nChannel:\t${song.channel}\nVersion:\t${song.version
  }\nType:\t\t${song.type}\n`);
}

// loadSongsFile()
function loadSongsFile() {
  allSongs = database.PIUPrime2;
}

// getGimmicks()
function getGimmicks(amount) {
  const gimmicks = [];

  return gimmicks;
}

// getChallenge()
function getChallenge(message) {
  let stringToReturn = '';

  const validSongs = [];
  let diffRange = false;
  let diffType = '';
  const diffLevels = [];
  let searchUnlocks = false;
  let validTypes = ['Normal'];
  let validChannels = [];
  const validSeries = [];
  let gimmickCount = 0;

  const options = message.content.toLowerCase().split(' ');

  // Getting the options
  let optionFound = false;
  for (let num = 0; num < options.length && stringToReturn === ''; num++) {
    optionFound = false;

    // Getting the difficulty
    if (options[num].match(songDiffRegex)) {
      if (options[num].startsWith('~')) {
        diffRange = true;
        options[num] = options[num].substring(1);
      }

      diffType = options[num].substring(0, 1);

      if (diffType === 's' || diffType === 'd') {
        const baseDiff = parseInt(options[num].substring(1), 10);

        if (!Number.isNaN(baseDiff)) {
          optionFound = true;
          if (diffRange) {
            for (let n = baseDiff - 1; n < baseDiff + 2; n++) { diffLevels.push(diffType.toUpperCase() + n.toString()); }
          } else { diffLevels.push(diffType.toUpperCase() + baseDiff.toString()); }
        } else {
          stringToReturn = '\:warning: You entered an invalid chart rating! Type '
                                    + '`chll prime2 help` to see the range of valid difficulties.';
        }
      } else {
        stringToReturn = '\:warning: You entered an invalid chart type! Type `chll '
                                + 'prime2 help` to see the valid chart types.';
      }
    }

    // Getting the song types
    switch (songTypes.indexOf(options[num])) {
      case 0:
        // Don't change the array, it's the "normal" type
        optionFound = true;
        break;
      case 1: // Short
        validTypes = ['Short'];
        validChannels = [];
        optionFound = true;
        break;
      case 2: // Full
        validTypes = ['Full'];
        validChannels = [];
        optionFound = true;
        break;
      case 3: // Remix
        validTypes = ['Remix'];
        validChannels = [];
        optionFound = true;
        break;
      case 4: // [All Types]
        validTypes.push('Short');
        validTypes.push('Full');
        validTypes.push('Remix');
        optionFound = true;
        break;
      default:
        break;
    }

    // Getting the song channel
    switch (songChannels.indexOf(options[num])) {
      case 0: // Original
        validChannels.push('Original');
        optionFound = true;
        break;
      case 1: // K-Pop
        validChannels.push('K-Pop');
        optionFound = true;
        break;
      case 2: // J-Music
        validChannels.push('J-Music');
        optionFound = true;
        break;
      case 3: // World
        validChannels.push('World');
        optionFound = true;
        break;
      case 4: // Xross
        validChannels.push('Xross');
        optionFound = true;
        break;
      default:
        break;
    }

    // Getting the song series
    switch (songSeries.indexOf(options[num])) {
      case 0:
        validSeries.push('Prime 2');
        optionFound = true;
        break;
      case 1:
        validSeries.push('Prime');
        optionFound = true;
        break;
      case 2:
        validSeries.push('Fiesta 2');
        optionFound = true;
        break;
      case 3:
        validSeries.push('Fiesta EX');
        optionFound = true;
        break;
      case 4:
        validSeries.push('Fiesta');
        optionFound = true;
        break;
      case 5:
      case 6:
        validSeries.push('NX ~ NXA');
        optionFound = true;
        break;
      case 7:
      case 8:
        validSeries.push('Extra ~ Prex 3');
        optionFound = true;
        break;
      case 9:
      case 10:
        validSeries.push('Exceed ~ Zero');
        optionFound = true;
        break;
      case 11:
      case 12:
        validSeries.push('1st ~ Perfect');
        optionFound = true;
        break;
      default:
        break;
    }

    // Noticing to search unlockable charts
    if (options[num] === 'unlocks') {
      searchUnlocks = true;
      optionFound = true;
    }

    // Noticing that gimmicks should be applied
    if (options[num].startsWith('gimmick')) {
      gimmickCount = parseInt(options[num].replace('gimmick', ''), 10);

      if (Number.isNaN(gimmickCount)) { gimmickCount = 1; }

      if (gimmickCount > 4) { gimmickCount = 4; }

      optionFound = true;
    }

    // IF no option was found...
    if (!optionFound) {
      stringToReturn = '\:grey_question: You entered an invalid option! Type `chll prime2 help` to see '
                                + 'a list of available challenge options.';
    }
  }

  // TEST TEST TEST
  // console.log("\ndiffLevels:\t" + diffLevels.length);
  // if (diffLevels.length > 0)
  //    console.log(diffLevels);
  // console.log("unlocks:\t" + searchUnlocks);
  // console.log("validTypes:\t" + validTypes.length);
  // if (validTypes.length > 0)
  //    console.log(validTypes);
  // console.log("validChannels:\t" + validChannels.length);
  // if (validChannels.length > 0)
  //    console.log(validChannels);
  // console.log("validSeries:\t" + validSeries.length);
  // if (validSeries.length > 0)
  //    console.log(validSeries);
  // console.log("gimmickCount:\t" + gimmickCount);
  // console.log("");
  // TEST TEST TEST

  // Getting the valid songs
  for (let songNum = 0; songNum < allSongs.length && stringToReturn === ''; songNum++) {
    let canAdd = true;

    if (diffLevels.length > 0) {
      canAdd = false;

      for (let diffNum = 0; diffNum < diffLevels.length; diffNum++) {
        if (allSongs[songNum].charts.includes(diffLevels[diffNum])
                    || (searchUnlocks && allSongs[songNum].unlocks.includes(diffLevels[diffNum]))) {
          canAdd = true;
          break;
        }
      }
    }

    if (!validTypes.includes(allSongs[songNum].type)) { canAdd = false; }

    if (validChannels.length > 0 && !validChannels.includes(allSongs[songNum].channel)) { canAdd = false; }

    if (validSeries.length > 0 && !validSeries.includes(allSongs[songNum].series)) { canAdd = false; }

    if (canAdd) { validSongs[validSongs.length] = allSongs[songNum]; }
  }

  // Choosing a valid song
  if (validSongs.length > 0) {
    stringToReturn = `\:dancer: <@${message.author.id}> 's CHALLENGE \:dancer:\n`;

    const chosenSong = validSongs[Math.floor(Math.random() * validSongs.length)];
    const validDiffs = [];

    for (let num = 0; num < chosenSong.charts.length; num++) {
      if (diffLevels.length === 0 || diffLevels.includes(chosenSong.charts[num])) { validDiffs.push(chosenSong.charts[num]); }
    }

    if (searchUnlocks) {
      for (let num = 0; num < chosenSong.unlocks.length; num++) {
        if (diffLevels.length === 0 || diffLevels.includes(chosenSong.unlocks[num])) { validDiffs.push(chosenSong.charts[num]); }
      }
    }

    const chosenDiff = validDiffs[Math.floor(Math.random() * validDiffs.length)];

    stringToReturn += `Play the **${chosenDiff}** chart of **${chosenSong.name}** `
                            + `(by ${chosenSong.artist})`;

    if (gimmickCount > 0) { stringToReturn += `${createGimmicks(gimmickCount)}\n\n`; } else { stringToReturn += '!\n'; }

    stringToReturn += `(Channel: ${chosenSong.channel})`;
  } else if (stringToReturn === '') {
    stringToReturn = '\:open_file_folder: No songs could be found with those restrictions! '
        + 'Enter `chll prime2 help` to see the list of valid challenge options for this game.';
  }

  if (message.content === 'help' || stringToReturn === '') {
    stringToReturn = 'Proper Usage:\n```challenge piuprime2 [difficulty?] [unlocks?] [type?] '
                        + '[channel?] [series?] [gimmick?]\n\n'
                        + '[difficulty?]   = The chart level to retrieve (Format: S## | ~S## | D## | ~D##)\n'
                        + '[unlocks?]      = Includes unlockable charts (Format: unlocks)\n'
                        + '[type?]         = Limits the song type (Format: normal | short | full | remix | all)\n'
                        + '[channel?]      = Limits the song channel (Only works w/ Normal type songs) (Format: original | kpop | jmusic | world | xross)\n'
                        + '[series?]       = Limits the song origins (Format: prime2 | prime | fiesta2 | fiestaex | fiesta | nx | nxa | prex3 | extra | exceed | zero | perfect | 1st)\n'
                        + '[gimmick?]      = Add gimmicks to the challenge (Format: gimmick#)\n```';
  }

  return stringToReturn;
}

// createGimmicks()
function createGimmicks(gimmickNum) {
  let gimmickString = ` with the following gimmick${gimmickNum > 1 ? 's:' : ':'}`;
  const usedGimmicks = [];
  let chosenGimmick = Math.round(Math.random() * 5);
  let subGimmick = 0;

  for (let num = 0; num < gimmickNum; num++) {
    while (usedGimmicks.indexOf(chosenGimmick) > -1) { chosenGimmick = Math.round(Math.random() * 5); }

    gimmickString += '\n';

    switch (chosenGimmick) {
      case 0: // Troll Skin
        subGimmick = Math.round(Math.random() * 5);
        gimmickString += '- Note Skin: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'Flower Card';
            break;
          case 1:
            gimmickString += 'Poker';
            break;
          case 2:
            gimmickString += 'Music';
            break;
          case 3:
            gimmickString += 'Canon';
            break;
          case 4:
            gimmickString += 'Missile';
            break;
          case 5:
            gimmickString += 'Soccerball';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      case 1: // Note Path
        subGimmick = Math.round(Math.random() * 5);
        gimmickString += '- Note Path: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'NX';
            break;
          case 1:
            gimmickString += 'Drop (DR)';
            break;
          case 2:
            gimmickString += 'Snake (SN)';
            break;
          case 3:
            gimmickString += 'Rise (RI)';
            break;
          case 4:
            gimmickString += 'X';
            break;
          case 5:
            gimmickString += 'Under Attack (UA)';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      case 2: // Judgement
        subGimmick = Math.round(Math.random());
        gimmickString += '- Judgement: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'Reverse Judgement (JR)';
            break;
          case 1:
            gimmickString += 'Hard Judgement (HJ)';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      case 3: // Unnatural Speed
        subGimmick = Math.round(Math.random() * 3);
        gimmickString += '- Speed: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'Earthworm (EW)';
            break;
          case 1:
            gimmickString += 'Random Velocity (RV)';
            break;
          case 2:
            gimmickString += 'Decelerating (DC)';
            break;
          case 3:
            gimmickString += 'Accelerating (AC)';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      case 4: // Display
        subGimmick = Math.round(Math.random() * 5);
        gimmickString += '- Display: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'Flicker (FR)';
            break;
          case 1:
            gimmickString += 'Random Skin (RS)';
            break;
          case 2:
            gimmickString += 'Vanish (V)';
            break;
          case 3:
            gimmickString += 'Appear (AP)';
            break;
          case 4:
            gimmickString += 'Freedom (FD)';
            break;
          case 5:
            gimmickString += 'Non-Step (NS)';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      case 5: // Alternate
        subGimmick = Math.round(Math.random());
        gimmickString += '- Alternate: ';
        switch (subGimmick) {
          case 0:
            gimmickString += 'Mirror (M)';
            break;
          case 1:
            gimmickString += 'Random Step (RS)';
            break;
          default:
            // Do nothing, default case is unachievable
            break;
        }
        break;
      default:
        // Do nothing, default case is unachievable
        break;
    }

    usedGimmicks.push(chosenGimmick);
  }

  return gimmickString;
}

// Export Challenge
module.exports.challenge = {
  identities: ['piu', 'pumpitup', 'piuprime2', 'prime2'],
  title: 'Pump It Up Prime 2',
  author: 'Michael Berger',
  load: loadSongsFile,
  get: getChallenge,
};
