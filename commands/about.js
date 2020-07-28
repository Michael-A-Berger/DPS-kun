// about()
function about(message) {
  message.channel.send('This bot was created by Michael Berger for use with rhythm game '
                      + 'community Discord servers. You can view all of its commands by typing `!help`\n'
                      + '- DX-23000 (nicknamed "DPS-kun") was created by Yoshiaki Heshiki and is '
                      + "© Konami\n- The profile picture was blatantly stolen from Lytessill's Red"
                      + 'buble page. Google him!');
}

// Exported Command
module.exports.command = {
  keywords: ['about'],
  description: 'Explains this bot',
  author: 'Michael Berger',
  restricted: false,
  secret: false,
  action: about,
};
