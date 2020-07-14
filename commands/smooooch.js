// Exported Command
module.exports.command = {
  keywords: ['smooooch'],
  description: '・∀・',
  author: 'Michael Berger',
  restricted: false,
  secret: true,
  action: smooch,
};

// smooch()
function smooch(message) {
  message.channel.send('\:kissing:');
}
