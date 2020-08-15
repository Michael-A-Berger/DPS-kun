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

// help()
function help() {
  return 'Proper Usage:\n```challenge [game] [criteria?]\n\n'
        + "- [game]       = The game to choose the chart from ('support' lists all supported games)\n"
        + "- [criteria?]  = Restricts chosen song to certain criteria (issue 'challenge [game] "
        + "help' to see options)```";
}

// formatChallenge()
function formatChallenge(message, chosenMod) {
  // Defining the chosen song + final string to print
  let chosenSong;
  let str = database.Modules[chosenMod].Header;

  // Defining the full first line of print string
  str += `\t<@${message.author.id}> 's CHALLENGE\t`;
  str += database.ReverseEmoji(database.Modules[chosenMod].Header);

  // Getting the search object
  const searchJSON = database.SearchTextToJSON(database.Modules[chosenMod].SearchParams, message.content);
  const validSongs = database.Modules[chosenMod].Search(message.content);

  // IF there is more than one search result...
  if (validSongs.length > 0) {
    // Choosing a random song
    chosenSong = validSongs[Math.floor(Math.random() * validSongs.length)];

    // Getting the display strings for the challenge
    const chartName = database.Modules[chosenMod].ChartName(chosenSong, searchJSON);
    const miscProps = database.Modules[chosenMod].MiscProperties(chosenSong, searchJSON);
    const sortStr = database.Modules[chosenMod].SortCategory(chosenSong);

    // Formatting the miscellaneous properties to a single string
    let propStr = '';
    let formattedPropName = '';
    const miscKeys = Object.keys(miscProps);
    for (let num = 0; num < miscKeys.length; num++) {
      formattedPropName = miscKeys[num].replace(/([A-Z][a-z])/g, ' $&').trim();
      propStr += ` (${formattedPropName}: ${miscProps[miscKeys[num]]})`;
    }

    // Formatting the rest of the message to send
    str += '\nPlay ';
    if (chartName.length > 0) {
      str += `the **${chartName}** chart of `;
    }
    str += `**${chosenSong.name}** (by ${chosenSong.artist})`;
    if (propStr.length > 0) str += propStr;
    if (sortStr.length > 0) str += `\n${sortStr}`;

    // Sending back the challenge message
    message.channel.send(str);
  } else {
    // ELSE, send an error message
    const noResults = '\:open_file_folder: No songs could be found with those restrictions! '
                    + `Enter \`challenge ${database.Modules[chosenMod].CommandIdentities[0]} help\` `
                    + 'to see the list of valid challenge options for this game.';
    message.channel.send(noResults);
  }
}

// challenge()
function challenge(message) {
  // Getting the first token of the command + its related module
  const firstToken = message.content.split(' ')[0];
  const chosenMod = database.IdentityToModuleName(firstToken);

  // IF support was requested, show the user the supported games
  if (firstToken === 'support') {
    message.channel.send(database.SupportedGames());
  } else if (chosenMod === undefined) {
    // ELSE IF the module was not found, show the help message
    message.channel.send(help());
  } else if (message.content.endsWith(' help')) {
    // ELSE IF the user just wants database search help (basic)
    let gameHelp = database.Modules[chosenMod].Help();
    gameHelp = gameHelp.replace(/<dps_cmd>/g, 'challenge');
    message.channel.send(gameHelp);
  } else if (message.content.endsWith(' help2')) {
    // ELSE IF the user just wants database search help (advanced)
    let gameHelp = database.Modules[chosenMod].Help2();
    gameHelp = gameHelp.replace(/<dps_cmd>/g, 'challenge');
    message.channel.send(gameHelp);
  } else {
    // ELSE just search the database
    formatChallenge(message, chosenMod);
  }
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
