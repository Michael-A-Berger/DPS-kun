// Modules
const fs = require('fs');

// Constant Variables
const jsonFile = 'remy_links.json';
const logFile = 'remy_log.txt';
const remyUrl = 'https://remywiki.com/';

// Default Links
const defaultLinks = {
  help: '```!remy [subject]\n- Retrieves the RemyWiki link for the subject\n\n!remy add [subject] [RemyWiki link]\n- Assigns the subject the given RemyWiki link```',
  iidx: 'https://remywiki.com/Beatmania_IIDX_Information',
  popn: 'https://remywiki.com/Pop%27n_music_Information',
  gfdm: 'https://remywiki.com/GITADORA_Information',
  ddr: 'https://remywiki.com/DanceDanceRevolution_Information',
  jubeat: 'https://remywiki.com/Jubeat_Information',
  sdvx: 'https://remywiki.com/SOUND_VOLTEX_Information',
  nostalgia: 'https://remywiki.com/NOSTALGIA_Information',
  drs: 'https://remywiki.com/NOSTALGIA_Information',
  popnstage: 'https://remywiki.com/Pop%27n_stage_Information',
  kbm: 'https://remywiki.com/KEYBOARDMANIA_Information',
  rb: 'https://remywiki.com/REFLEC_BEAT_Information',
  danceevo: 'https://remywiki.com/DanceEvolution_Information',
  bst: 'https://remywiki.com/BeatStream_Information',
  museca: 'https://remywiki.com/MUSECA_Information',
};

// RemyWiki links JSON
let remyLinks;

// Getting the appropriate newline character
const newlineChar = process.env.NEWLINE_CHAR;

// remy()
function remy(message) {
  // First-Time populating of wiki links JSON object
  if (remyLinks === undefined) {
    if (fs.existsSync(`./commands/${jsonFile}`)) { remyLinks = require(`./${jsonFile}`); } else { remyLinks = defaultLinks; }
  }

  // Setting the content string
  let contentStr = message.content;

  // IF the user wants to add an association...
  if (contentStr.startsWith('add ')) {
    let added = false;

    contentStr = contentStr.replace('add ', '').split(' ');

    let alreadyAssociated;
    let linkToRemy;
    let frontPage;

    if (contentStr.length >= 2) {
      contentStr[0] = contentStr[0].toLowerCase();

      alreadyAssociated = (remyLinks[contentStr[0]] !== undefined && remyLinks[contentStr[0]] !== null);
      linkToRemy = contentStr[1].startsWith(remyUrl);
      frontPage = (contentStr[1].length <= remyUrl.length) || (contentStr[1] === `${remyUrl}Main_Page`);

      if (!alreadyAssociated && linkToRemy && !frontPage) {
        remyLinks[contentStr[0]] = contentStr[1];
        added = true;

        fs.writeFile(`./commands/${jsonFile}`, JSON.stringify(remyLinks).replace(/,/g, ',\n'), (err) => {
          if (err) { console.log(err); } else { console.log('remy() - remy_links JSON saved!'); }
        });

        fs.appendFile(`./commands/${logFile}`, `${message.id}: ${message.author.username} added '${contentStr[0]}'${newlineChar}`,
          (err) => {
            if (err) { console.log(err); }
          });
      }
    }

    if (added) {
      message.channel.send(`\:white_check_mark: \`${contentStr[0]}\` added to the wiki list!`);
    } else if (alreadyAssociated !== undefined && alreadyAssociated) {
      message.channel.send(`\:no_entry: \`${contentStr[0]}\` already has an entry on the wiki list!`);
    } else if (linkToRemy !== undefined && !linkToRemy) {
      message.channel.send('\:no_entry: The RemyWiki link *must* be a RemyWiki link');
    } else if (frontPage !== undefined && frontPage) {
      message.channel.send('\:no_entry: The RemyWiki link cannot be a link to the RemyWiki landing page');
    } else {
      message.channel.send('Proper Usage: `remy add [subject] [RemyWiki link]`');
    }
  // ELSE... (the user wants to retreive an association)
  } else {
    contentStr = contentStr.toLowerCase();
    const result = remyLinks[contentStr];
    if (result !== undefined && result !== null) { message.channel.send(result); } else { message.channel.send(`\:grey_question: \`${contentStr}\` is not on the wiki list!`); }
  }
}

// Exported Command
module.exports.command = {
  keywords: ['remy', 'remywiki'],
  description: 'Retrieves the RemyWiki page for the given subject',
  author: 'Michael Berger',
  restricted: true,
  secret: false,
  action: remy,
};
