// Modules
const database = require(`${__dirname}/../database.js`);

// Constant Variables
const gcpcIdentities = ['groovecoasterpc', 'gcpc'];
const iidxMobileIdentities = ['iidxmobile', 'iidxm'];
const museDashIdentities = ['musedash', 'msds'];
const prime2Identities = ['piuprime2', 'prime2'];
const piuPrime2GimmickMax = 6;

/* ====================================
 * ===== CHALLENGE HELPER METHODS =====
 * ====================================
 */

// piuPrime2Gimmicks()
function piuPrime2Gimmicks(gimmickNum) {
  // Defining the initial variables
  let gimmickString = '';
  const usedGimmicks = [];
  let chosenGimmick = Math.floor(Math.random() * piuPrime2GimmickMax);
  let subGimmick = -1;

  // Getting the gimmicks
  for (let num = 0; num < gimmickNum; num++) {
    while (usedGimmicks.indexOf(chosenGimmick) > -1) {
      chosenGimmick = Math.floor(Math.random() * piuPrime2GimmickMax);
    }

    gimmickString += '\n';

    switch (chosenGimmick) {
      case 0: // Troll Skin
        subGimmick = Math.floor(Math.random() * 6);
        gimmickString += '- Note Skin: **';
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
        gimmickString += '**';
        break;
      case 1: // Note Path
        subGimmick = Math.floor(Math.random() * 6);
        gimmickString += '- Note Path: **';
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
        gimmickString += '**';
        break;
      case 2: // Judgement
        subGimmick = Math.round(Math.random());
        gimmickString += '- Judgement: **';
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
        gimmickString += '**';
        break;
      case 3: // Unnatural Speed
        subGimmick = Math.floor(Math.random() * 4);
        gimmickString += '- Speed: **';
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
        gimmickString += '**';
        break;
      case 4: // Display
        subGimmick = Math.floor(Math.random() * 6);
        gimmickString += '- Display: **';
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
        gimmickString += '**';
        break;
      case 5: // Alternate
        subGimmick = Math.round(Math.random());
        gimmickString += '- Alternate: **';
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
        gimmickString += '**';
        break;
      default:
        // Do nothing, default case is unachievable
        break;
    }

    usedGimmicks.push(chosenGimmick);
  }

  // Returning the gimmicks
  return gimmickString;
}

/* =======================================
 * ===== CHALLENGE RETRIEVAL METHODS =====
 * =======================================
 */

// grooveCoasterPCChallenge()
function grooveCoasterPcChallenge(message) {
  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    returnString = database.GrooveCoasterPC.Help();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
    returnString = returnString.substring(0, returnString.length - 3);
    returnString = returnString.replace('[extra]\n\n', '[extra] [gimmick]\n\n');
    returnString += '- [gimmick]   = Adds a gameplay modifier to the challenge\n```';
  } else {
    validSongs = database.GrooveCoasterPC.Search(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:headphones: <@${message.author.id}> 's CHALLENGE \:headphones:\nPlay`;
    if (message.content.toLowerCase().indexOf(' extra') > -1) {
      returnString += ` the **Extra (${chosenSong.extra})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' hard') > -1) {
      returnString += ` the **Hard (${chosenSong.hard})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' normal') > -1) {
      returnString += ` the **Normal (${chosenSong.normal})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' simple') > -1) {
      returnString += ` the **Simple (${chosenSong.simple})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;
    if (message.content.toLowerCase().indexOf(' bpm') > -1) { returnString += ` (BPM: ${chosenSong.bpm})`; }
    if (message.content.toLowerCase().indexOf(' gimmick') > -1) {
      returnString += `\n(Gimmick: Use the **${(Math.random() * 2 > 1 ? 'NO INFO' : 'JUST')}** item.)`;
    }
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + `Enter \`challenge ${gcpcIdentities[0]} help\` to see the list of valid `
                  + 'challenge options for this game.';
  }

  // Returning the return string
  return returnString;
}

// museDashChallenge()
function museDashChallenge(message) {
  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    returnString = database.MuseDash.Help();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
  } else {
    validSongs = database.MuseDash.Search(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:womans_hat: <@${message.author.id}> 's CHALLENGE \:womans_hat:\nPlay`;
    if (message.content.toLowerCase().indexOf(' hidden') > -1) {
      returnString += ` the **Hidden (${chosenSong.hidden})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' master') > -1) {
      returnString += ` the **Master (${chosenSong.master})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' hard') > -1) {
      returnString += ` the **Hard (${chosenSong.hard})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' easy') > -1) {
      returnString += ` the **Easy (${chosenSong.easy})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;
    if (message.content.toLowerCase().indexOf(' bpm') > -1) { returnString += ` (BPM: ${chosenSong.bpm})`; }
    returnString += `\n(Pack: ${chosenSong.pack})`;
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + `Enter \`challenge ${museDashIdentities[0]} help\` to see the list of `
                  + 'valid challenge options for this game.';
  }

  // Returning the return string
  return returnString;
}

// piuPrime2Challenge()
function piuPrime2Challenge(message) {
  // piuPrime2.load();
  // return piuPrime2.get(message);

  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    returnString = database.PIUPrime2.Help();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
  } else if (message.content.endsWith('help2')) {
    returnString = database.PIUPrime2.Help2();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
    returnString = returnString.replace('\n\n', ' [gimmick]\n\n');
    returnString = returnString.substr(0, returnString.length - 3);
    returnString += '- [gimmick]       = Adds a gameplay modifier to the challenge (append \':#\' for multiple modifiers)\n```';
  } else {
    validSongs = database.PIUPrime2.Search(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, then format the string
  if (chosenSong !== undefined) {
    returnString = `\:dancer: <@${message.author.id}> 's CHALLENGE \:dancer:\nPlay`;

    // ===== GETTING THE CHART TYPE =====
    if (message.content.indexOf(' coop') > -1) {
      // IF the user wanted a co-op chart, choose the first one (Prime 2 songs don't have multiple co-op charts)
      returnString += ` the **Co-op (x${chosenSong.coop[0]})** chart of`;
    } else if (message.content.indexOf(' dperformance') > -1) {
      // ELSE IF the user wanted a DP chart, give it to them
      let colonPos = message.content.indexOf(' dperformance:');
      if (colonPos > -1) {
        colonPos += 14;
        let toMatch = message.content.substr(colonPos, 3);
        const range = (toMatch.startsWith('~') ? 1 : 0);
        toMatch = parseInt(toMatch.replace(/[^\d]/g, ''), 10);
        toMatch = chosenSong.dPerformance.filter((num) => (num >= toMatch - range && num <= toMatch + range));
        returnString += ` the **DP${toMatch[Math.floor(Math.random() * toMatch.length)]}** chart of`;
      } else {
        returnString += ' a **Double Performance** chart of';
      }
    } else if (message.content.indexOf(' sperformance') > -1) {
      // ELSE IF the user wanted an SP chart, give it to them
      let colonPos = message.content.indexOf(' sperformance:');
      if (colonPos > -1) {
        colonPos += 14;
        let toMatch = message.content.substr(colonPos, 3);
        const range = (toMatch.startsWith('~') ? 1 : 0);
        toMatch = parseInt(toMatch.replace(/[^\d]/g, ''), 10);
        toMatch = chosenSong.sPerformance.filter((num) => (num >= toMatch - range && num <= toMatch + range));
        returnString += ` the **SP${toMatch[Math.floor(Math.random() * toMatch.length)]}** chart of`;
      } else {
        returnString += ' a **Single Performance** chart of';
      }
    } else if (message.content.indexOf(' double') > -1) {
      // ELSE IF the user wanted a Double chart, give it to them
      let colonPos = message.content.indexOf(' double:');
      if (colonPos > -1) {
        colonPos += 8;
        let toMatch = message.content.substr(colonPos, 3);
        const range = (toMatch.startsWith('~') ? 1 : 0);
        toMatch = parseInt(toMatch.replace(/[^\d]/g, ''), 10);
        toMatch = chosenSong.double.filter((num) => (num >= toMatch - range && num <= toMatch + range));
        returnString += ` the **D${toMatch[Math.floor(Math.random() * toMatch.length)]}** chart of`;
      } else {
        returnString += ' a **Double** chart of';
      }
    } else if (message.content.indexOf(' single') > -1) {
      // ELSE IF the user wanted a Single chart, give it to them
      let colonPos = message.content.indexOf(' single:');
      if (colonPos > -1) {
        colonPos += 8;
        let toMatch = message.content.substr(colonPos, 3);
        const range = (toMatch.startsWith('~') ? 1 : 0);
        toMatch = parseInt(toMatch.replace(/[^\d]/g, ''), 10);
        toMatch = chosenSong.single.filter((num) => (num >= toMatch - range && num <= toMatch + range));
        returnString += ` the **S${toMatch[Math.floor(Math.random() * toMatch.length)]}** chart of`;
      } else {
        returnString += ' a **Single** chart of';
      }
    }

    // Adding the song name + artist
    returnString += ` **${chosenSong.name} (${chosenSong.type})** (by ${chosenSong.artist})`;

    // IF the BPM was defined, add it
    if (message.content.indexOf(' bpm') > -1) {
      returnString += ` (BPM: ${chosenSong.bpm})`;
    }

    // IF the Channel was defined, add it
    if (message.content.indexOf(' channel') > -1) {
      returnString += ` (Channel: ${chosenSong.channel})`;
    }

    // IF Gimmicks were requested, add them
    if (message.content.indexOf(' gimmick') > -1) {
      // Determining the amount of gimmicks
      let gimmickNum = message.content.indexOf(' gimmick:');
      if (gimmickNum > -1) {
        gimmickNum = parseInt(message.content.substr(gimmickNum + 9, 2), 10);
      } else { gimmickNum = 1; }

      // Truncating the gimmick amount
      if (gimmickNum < 1 || Number.isNaN(gimmickNum)) {
        gimmickNum = 1;
      } else if (gimmickNum > piuPrime2GimmickMax) {
        gimmickNum = piuPrime2GimmickMax;
      }

      // Adding the gimmick intro text
      returnString += ` with the following gimmick${(gimmickNum > 1 ? 's:' : ':')}`;

      // Defining the gimmicks
      returnString += piuPrime2Gimmicks(gimmickNum);
    }

    // Adding the Series
    returnString += `\n(Series: ${chosenSong.series})`;
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + `Enter \`challenge ${prime2Identities[0]} help\` to see the list of `
                  + 'valid challenge options for this game.';
  }

  // Returning the return string
  return returnString;
}

// iidxMobileChallenge()
function iidxMobileChallenge(message) {
  // Defining the return string + the song + the valid songs
  let returnString;
  let chosenSong;
  let validSongs = [];

  // Getting the help message if requested, otherwise searching the songs
  if (message.content.endsWith('help')) {
    returnString = database.IIDXMobile.Help();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
  } else if (message.content.endsWith('help2')) {
    returnString = database.IIDXMobile.Help2();
    returnString = returnString.replace(/<dps_cmd>/g, 'challenge');
  } else {
    validSongs = database.IIDXMobile.Search(message.content);
  }

  // IF the valid songs array is longer than one song, randomly choose a song
  if (validSongs.length > 1) {
    chosenSong = validSongs[Math.round(Math.random() * (validSongs.length - 1))];
  } else if (validSongs.length === 1) { chosenSong = validSongs[0]; }

  // IF a song was chosen, format the return string
  if (chosenSong !== undefined) {
    returnString = `\:cd:\:point_left: <@${message.author.id}> 's CHALLENGE \:point_right:\:cd:\nPlay`;

    // Listing the difficulty
    if (message.content.toLowerCase().indexOf(' another') > -1) {
      returnString += ` the **Another (${chosenSong.spa})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' hyper') > -1) {
      returnString += ` the **Hyper (${chosenSong.sph})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' normal') > -1) {
      returnString += ` the **Normal (${chosenSong.spn})** chart of`;
    } else if (message.content.toLowerCase().indexOf(' beginner') > -1) {
      returnString += ` the **Beginner (${chosenSong.beginner})** chart of`;
    }
    returnString += ` **${chosenSong.name}** (by ${chosenSong.artist})`;

    // Listing other parameters (if requested)
    if (message.content.toLowerCase().indexOf(' genre') > -1) {
      returnString += ` (Genre: ${chosenSong.genre})`;
    }
    if (message.content.toLowerCase().indexOf(' bpm') > -1) {
      returnString += ` (BPM: ${chosenSong.bpm})`;
    }
    if (message.content.toLowerCase().indexOf(' origin') > -1) {
      returnString += ` (Origin: ${chosenSong.origin})`;
    }
    if (message.content.toLowerCase().indexOf(' price') > -1) {
      returnString += ` (Price: ${chosenSong.price})`;
    }

    // Adding the song style
    returnString += `\n(Style: ${chosenSong.style})`;
  }

  // IF the return string has not been defined yet... (no matches found)
  if (returnString === undefined) {
    returnString = '\:open_file_folder: No songs could be found with those restrictions! '
                  + `Enter \`challenge ${iidxMobileIdentities[0]} help\` to see the list of `
                  + 'valid challenge options for this game.';
  }

  // Returning the return string
  return returnString;
}

// challenge()
function challenge(message) {
  let found = false;
  let stringToPrint = '';

  // Groove Coaster PC
  for (let num = 0; !found && num < gcpcIdentities.length; num++) {
    if (message.content.startsWith(gcpcIdentities[num])) {
      stringToPrint = grooveCoasterPcChallenge(message);
      found = true;
    }
  }

  // IIDX Ultimate Mobile
  for (let num = 0; !found && num < iidxMobileIdentities.length; num++) {
    if (message.content.startsWith(iidxMobileIdentities[num])) {
      stringToPrint = iidxMobileChallenge(message);
      found = true;
    }
  }

  // Muse Dash
  for (let num = 0; !found && num < museDashIdentities.length; num++) {
    if (message.content.startsWith(museDashIdentities[num])) {
      stringToPrint = museDashChallenge(message);
      found = true;
    }
  }

  // PIU Prime 2
  for (let num = 0; !found && num < prime2Identities.length; num++) {
    if (message.content.startsWith(prime2Identities[num])) {
      stringToPrint = piuPrime2Challenge(message);
      found = true;
    }
  }

  // List of Supported Games
  if (message.content === 'support') {
    stringToPrint = database.SupportedGames();
    found = true;
  }

  if (!found) {
    stringToPrint = 'Proper Usage:\n```challenge [game] [criteria?]\n\n'
                    + "- [game]       = The game to choose the chart from ('support' lists all supported games)\n"
                    + "- [criteria?]  = Restricts chosen song to certain criteria (issue 'challenge [game] "
                    + "help' to see options)```";
  }

  message.channel.send(stringToPrint);
}

// Exported Command
module.exports.command = {
  keywords: ['chll', 'challenge'],
  description: 'Issues a challenge for the user to overcome (for fun)',
  author: 'Michael Berger',
  restricted: false,
  secret: false,
  action: challenge,
};
