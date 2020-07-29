// Modules
const fs = require('fs');
const Discord = require('discord.js');

// JSON files
const discordAuth = {
  api_key: process.env.DISCORD_API_KEY,
  api_secret: process.env.DISCORD_API_SECRET,
};

// Server Variables
const discordClient = new Discord.Client();
const ownerID = process.env.OWNER_DISCORD_ID;
const blacklistFile = './blacklist.txt';
const botMasterFile = './bot_masters.txt';
const permissionsLog = './permissions_log.txt';
const commandsLocation = './commands';
const commandToken = '!';
let postingEnabled = true;
const newlineRegex = /\r?\n/;
let newlineChar = '';

//= ====================================================
// Determining the Appropriate Newline Character by OS
//= ====================================================

process.env.NEWLINE_CHAR = (process.platform === 'win32' ? '\r\n' : '\n');
newlineChar = process.env.NEWLINE_CHAR;

//= =========================
// Registering the Commands
//= =========================

const database = require('./database.js');
let commands = [];
let counter = 0;

// LoadDatabase()
function LoadDatabase() {
  console.log('=== LOADING SONGS DATABASE ===');
  database.LoadModules();
  console.log('Done loading songs database!\n');
}
LoadDatabase();

// UnloadDatabase()
function UnloadDatabase() {
  console.log('=== UNLOADING SONGS DATABASE ===');
  delete require.cache[require.resolve('./database.js')];
  console.log('Done unloding songs database!\n');
}

// LoadCustomCommands()
function LoadCustomCommands() {
  console.log('=== LOADING CUSTOM COMMANDS ===');
  commands = [];
  counter = 0;
  fs.readdirSync(commandsLocation).forEach((file) => {
    if (file.endsWith('.js')) {
      console.log(`- Registering ${file}...`);
      const cmdFile = require(`${commandsLocation}/${file}`);
      if (cmdFile.command !== null && cmdFile.command !== undefined) {
        commands[counter] = cmdFile.command;
        counter++;
      } else { console.log(`\nERROR: The 'command' property of [${file}] is null / undefined!\n`); }
    }
  });
  console.log('Done registering custom commands!\n');
}

LoadCustomCommands();

// UnloadCustomCommands()
function UnloadCustomCommands() {
  console.log('=== UNLOADING CUSTOM COMMANDS ===');
  fs.readdirSync(commandsLocation).forEach((file) => {
    if (file.endsWith('.js')) {
      const command = require.resolve(`${commandsLocation}/${file}`);
      delete require.cache[command];
      console.log(`- [${file}] unloaded!`);
    }
  });
  console.log('Done unloading custom commands!\n');
}

//= ======================
// Permissions Functions
//= ======================

let botMasters = [];
let blacklist = [];

// loadPermissions()
function loadPermissions() {
  // Checking the Bot Masters file
  if (fs.existsSync(botMasterFile)) {
    fs.readFile(botMasterFile, 'utf8', (err, data) => {
      if (err) { console.log(`${err}\n`); } else {
        botMasters = data.split(newlineRegex);
        console.log('- Bot Master roles retrieved!\n');
      }
    });
  } else { console.log('- No Bot Master file to read!\n'); }

  // Checking the Blacklist file
  if (fs.existsSync(blacklistFile)) {
    fs.readFile(blacklistFile, 'utf8', (err, data) => {
      if (err) { console.log(`${err}\n`); } else {
        blacklist = data.split(newlineRegex);
        console.log('- Blacklist retrieved!\n');
      }
    });
  } else { console.log('- No Blacklist file to read!\n'); }
}

// writeMemberFile()
function writeMemberFile(fileLoc, members) {
  if (members.length > 0) {
    let stringToSave = '';
    for (let num = 0; num < members.length; num++) { stringToSave += members[num] + (num < members.length - 1 ? newlineChar : ''); }
    fs.writeFile(fileLoc, stringToSave, 'utf8', (err) => {
      if (err) { console.log(`${err}\n`); } else { console.log(`- [${fileLoc}] member file was written!`); }
    });
  } else {
    fs.unlink(fileLoc, (err) => {
      if (err) { console.log(`${err}\n`); } else { console.log(`- [${fileLoc}] member file removed! (no entries)`); }
    });
  }
}

// Calling loadPermissions() on startup
loadPermissions();

//= ============
// Server Code
//= ============

// Using the API to send a reply
function sendReply(apiObject, reply) {
  apiObject.channel.send(reply);
}

// Using the API to send a DM
function sendDM(apiObject, reply) {
  apiObject.author.send(reply);
}

//

// Printing the "Must Be In Server" message
function MustBeInServerError(msg) {
  sendReply(msg, '\:no_entry_sign: Sorry, but that command cannot be issued in a private chat! '
                    + 'Please join the server this bot is participating in.');
}

// HelpCommand()
function HelpCommand(message) {
  let secretCount = 0;
  let stringToPrint = '```';
  for (counter = 0; counter < commands.length; counter++) {
    if (commands[counter].secret) { secretCount++; } else {
      for (let num = 0; num < commands[counter].keywords.length; num++) {
        stringToPrint += `${commandToken + commands[counter].keywords[num]}\n`;
      }
      stringToPrint += `- ${commands[counter].description}\n\n`;
    }
  }
  stringToPrint += `+${secretCount} secret commands\`\`\``;
  sendDM(message, stringToPrint);
}

// BotHelpCommand()
function BotHelpCommand(message) {
  const stringToPrint = `\`\`\`${commandToken}promote\n`
                        + `- Allows members with the provided role to issue bot master commands\n\n${
                          commandToken}demote\n`
                        + `- Removes the ability for members with the provided role to issue bot master commands\n\n${
                          commandToken}blacklist\n`
                        + '- Modifies the bot command blacklist. Members on the blacklist cannot issue any bot commands. (Note: '
                        + 'Members with bot master roles can be put on the blacklist. The only member immune from being put '
                        + `on the blacklist is this bot's owner, ${process.env.OWNER_NAME}.)\n\n${
                          commandToken}stop\n`
                        + '- All bot commands are disabled until a member with bot master permissions issues the [!start] '
                        + `command\n\n${
                          commandToken}start\n`
                        + '- Enables all bot commands after [!stop] is issued```';

  sendReply(message, stringToPrint);
}

// PromoteRole()
function PromoteRole(message, cmd) {
  const roleToPromote = cmd.substring(8);
  const serverRole = message.guild.roles.find('name', roleToPromote);

  if (serverRole) {
    if (!botMasters.includes(serverRole.id)) {
      botMasters.push(serverRole.id);
      writeMemberFile(botMasterFile, botMasters);
      fs.appendFile(permissionsLog, `${message.id}: ${message.author.username} promoted ${roleToPromote}${newlineChar}`,
        (err) => {
          if (err) { console.log(`${err}\n`); }
        });

      sendReply(message, `\:passport_control: Members with the ${roleToPromote} role now have bot master permissions!`
                        + ` Type \`${commandToken}bothelp\` to see all bot master commands.`);
    } else {
      sendReply(message, `\:warning: Members with the ${roleToPromote} role already have bot master permissions! `
                        + '(There\'s no need to promote them any further.)');
    }
  } else {
    sendReply(message, `\:grey_question: The role "${roleToPromote}" doesn't exist on the server! Please `
                      + 'choose an existing role to promote. (Note: This command is case-sensitive.)');
  }
}

// DemoteRole()
function DemoteRole(message, cmd) {
  const roleToDemote = cmd.substring(7);
  const serverRole = message.guild.roles.find('name', roleToDemote);

  if (serverRole) {
    const roleIndex = botMasters.indexOf(serverRole.id);
    if (roleIndex !== -1) {
      if (botMasters.length > 1) { botMasters = botMasters.splice(roleIndex, 1); } else { botMasters = []; }
      writeMemberFile(botMasterFile, botMasters);
      fs.appendFile(permissionsLog, `${message.id}: ${message.author.username} demoted ${roleToDemote}${newlineChar}`,
        (err) => {
          if (err) { console.log(`${err}\n`); }
        });

      sendReply(message, `\:lock: Bot master permissions for members with the ${roleToDemote} role `
                        + 'have been revoked!');
    } else {
      sendReply(message, `\:warning: Users with the ${roleToDemote} role don't have bot master permissions! If `
                        + `you wish to disable a member from using bot commands altogether, use the \`${commandToken
                        }blacklist\` command.`);
    }
  } else {
    sendReply(message, `\:grey_question: The role "${roleToDemote}" doesn't exist on the server! Please `
                      + 'choose an existing role to demote. (Note: This command is case-sensitive.)');
  }
}

// Blacklist()
function Blacklist(message, cmd) {
  let subcommand = cmd.substring(10).trim();
  let greaterThanLoc = subcommand.indexOf('>');
  const remove = subcommand.startsWith('remove');

  if (remove) {
    subcommand = subcommand.substring(6).trim();
    greaterThanLoc = subcommand.indexOf('>');

    if (subcommand.startsWith('<@') && greaterThanLoc > 2) {
      const memberID = subcommand.substring(2, greaterThanLoc).replace(/!/g, '');
      const memberIndex = blacklist.indexOf(memberID);
      const foundInGuild = message.guild.members.find('id', memberID);

      if (memberIndex !== -1 && foundInGuild) {
        if (blacklist.length > 1) { blacklist = blacklist.splice(memberIndex, 1); } else { blacklist = []; }
        writeMemberFile(blacklistFile, blacklist);
        fs.appendFile(permissionsLog, `${message.id}: ${message.author.username} removed ${foundInGuild.user.username} from the blacklist${newlineChar}`,
          (err) => {
            if (err) { console.log(`${err}\n`); }
          });

        sendReply(message, '\:white_check_mark: That user has been removed from the blacklist!');
      } else if (!foundInGuild && memberIndex !== -1) {
        sendReply(message, '\:warning: That member is not on the server anymore! If you would like to remove them from the blacklist, please '
                                              + 'contact Michael Berger.');
      } else if (memberIndex === -1 && foundInGuild) { sendReply(message, '\:warning: That member is not on the blacklist!'); }
    } else { sendReply(message, '\:no_entry: A member must be specified before they can be removed from the blacklist!'); }
  } else
  if (subcommand.startsWith('<@') && greaterThanLoc > 2) {
    const memberID = subcommand.substring(2, greaterThanLoc).replace(/!/g, '');
    const foundInGuild = message.guild.members.find('id', memberID);

    if (foundInGuild) {
      blacklist.push(memberID);
      writeMemberFile(blacklistFile, blacklist);
      fs.appendFile(permissionsLog, `${message.id}: ${message.author.username} added ${foundInGuild.user.username} to the blacklist${newlineChar}`,
        (err) => {
          if (err) { console.log(`${err}\n`); }
        });

      sendReply(message, '\:no_pedestrians: That member has been added to the blacklist!');
    } else {
      sendReply(message, '\:warning: That user is not an active member! Only active server members can be '
                                              + 'added to the blacklist.');
    }
  } else { sendReply(message, '\:no_entry: A member must be specified before they can be added to the blacklist!'); }
}

// When the Discord module is ready, print to the console that the bot is ready
discordClient.on('ready', () => {
  console.log('DPS-kun is Ready!\n');
});

// When a Discord message is received...
discordClient.on('message', (message) => {
  // Getting the message context variables
  const hasCommandToken = message.content.startsWith(commandToken);
  let masterCommand = (message.author.id === ownerID);
  const commandInDM = (message.channel.type === 'dm' || message.channel.type === 'group');
  let userOnBlacklist = false;
  if (blacklist.includes(message.author.id) && !masterCommand) { userOnBlacklist = true; }
  for (let num = 0; num < botMasters.length; num++) {
    if (!commandInDM && message.member.roles !== undefined
        && message.member.roles.has(botMasters[num])) {
      masterCommand = true;
      num = botMasters.length;
    }
  }

  // Getting the command
  let cmd;
  let firstSpace = -1;
  if (hasCommandToken) {
    cmd = message.content.replace(/\n/g, '').replace(/  */g, ' ');
    cmd = cmd.substring(1).trim();
    firstSpace = cmd.indexOf(' ');
    console.log(`[${message.content}]`);
  }

  // IF the message is a command AND the sender is NOT on the blacklist...
  if (cmd !== undefined && !userOnBlacklist) {
    // IF posting is enabled...
    if (postingEnabled) {
      // ::::::::::::::::::
      // GENERIC COMMANDS
      // ::::::::::::::::::

      let found = false;
      for (counter = 0; counter < commands.length && !found; counter++) {
        for (let num = 0; num < commands[counter].keywords.length && !found; num++) {
          if (cmd.toLowerCase().substring(0, (firstSpace > 0 ? firstSpace : cmd.length)) === commands[counter].keywords[num]) {
            if (!commands[counter].restricted || !commandInDM) {
              message.content = cmd.substring(commands[counter].keywords[num].length).trim();
              console.log(`- [${message.content}]`);
              found = true;

              commands[counter].action(message);
            } else {
              MustBeInServerError(message);
              found = true;
            }
          }
        }
      }

      // ::::::::::::::::::
      // SPECIAL COMMANDS
      // ::::::::::::::::::

      // help
      if (!found && cmd === 'help') {
        HelpCommand(message);
        found = true;
      }

      // bothelp
      if (!found && cmd === 'bothelp' && masterCommand) {
        BotHelpCommand(message);
        found = true;
      }

      // == PROMOTE ==
      if (!found && cmd.startsWith('promote')) {
        if (masterCommand && !commandInDM) {
          if (firstSpace < 1) { sendReply(message, 'Proper Usage: `!promote [server role]`'); } else {
            PromoteRole(message, cmd);
          }
        } else if (commandInDM) { MustBeInServerError(message); }

        found = true;
      }

      // == DEMOTE ==
      if (!found && cmd.startsWith('demote')) {
        if (masterCommand && !commandInDM) {
          if (firstSpace < 1) { sendReply(message, 'Proper Usage: `!demote [server role]`'); } else {
            DemoteRole(message, cmd);
          }
        } else if (commandInDM) { MustBeInServerError(message); }

        found = true;
      }

      // == BLACKLIST ==
      if (!found && cmd.startsWith('blacklist')) {
        if (masterCommand && !commandInDM) {
          if (firstSpace < 1 || cmd.endsWith('help')) {
            sendReply(message, `Proper Usage:\n\`\`\`${commandToken}blacklist @[username]\n- Adds a user to the `
                              + `bot blacklist (they will be unable to issue bot commands)\n\n${commandToken}`
                              + 'blacklist remove @[username]\n- Removes a user from the bot blacklist```');
          } else {
            Blacklist(message, cmd);
          }

          found = true;
        } else if (commandInDM) { MustBeInServerError(message); }
      }
    }

    // stop
    if (cmd === 'stop' && masterCommand && postingEnabled && !userOnBlacklist) {
      postingEnabled = false;
      sendReply(message, `${'\:rotating_light: All bot commands have been disabled! \:rotating_light:\n'
                                + 'A user with bot master permissions must type `'}${commandToken}start\` to enable`
                                + 'bot commands\nplease don\'t keep me offline for long senpai \:sob:');
    }

    // start
    if (cmd === 'start' && masterCommand && !postingEnabled && !userOnBlacklist) {
      postingEnabled = true;
      sendReply(message, '\:white_check_mark: Bots commands are enabled! \:white_check_mark:\n'
                                + 'Thank you so much senpai~\:kissing_heart:');
    }

    // reload
    if (cmd === 'reload' && message.author.id === ownerID) {
      postingEnabled = false;
      sendReply(message, 'Unloading the custom commands...');
      UnloadCustomCommands();
      sendReply(message, 'Unloading the database...');
      UnloadDatabase();
      sendReply(message, 'Reloading the database...');
      LoadDatabase();
      sendReply(message, 'Reloading the custom commands...');
      LoadCustomCommands();
      sendReply(message, 'Reload completed!');
      postingEnabled = true;
    }

    // shutdown
    if (cmd === 'shutdown' && message.author.id === ownerID) {
      sendReply(message, 'Shutting down...');
      setTimeout(() => {
        process.exit();
      }, 500);
    }
  }

  // IF the bot was mentioned...
});

// Logging into Discord
discordClient.login(discordAuth.api_key);
