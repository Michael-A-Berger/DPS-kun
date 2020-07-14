// Exported Command
module.exports.command = {
  keywords: ['leggendaria'],
  description: 'Generates a truly legendary song title',
  author: 'Michael Berger',
  restricted: false,
  secret: true,
  action: leggendaria,
};

// Defining the songlist array
const songlist = [
  'V',
  'Last Message',
  'Setsugekka',
  'smooooch・∀・',
  'Mirror Force',
  'Engulfed Beam',
  "You Can't Escape Me",
  'THE SAFARI',
  'She is my wife',
  'GAMBOL',
  'MAX 300',
  'LET THEM MOVE',
  'EGOISM 440',
  'Brain Power',
  'Dyscontrolled Galaxy',
  'FLOWER',
  'GOLD RUSH',
  'PARANOiA',
  '冥',
  '5.1.1.',
  'TOXIC VIBRATION',
  'Elemental Creation',
  'Wow Wow VENUS',
  'Daisuke',
  'Butterfly',
  "Dazzlin' Darlin",
  "You'll Cowards Don't Even Smoke Crack",
  'The Dirty of Loudness',
  'I REALLY WANT TO HURT YOU',
  'デスパシート',
  '渚の小悪魔lovely~radio',
  'CHERNOBOG',
];

// leggendaria()
function leggendaria(message) {
  const songIndex = Math.floor(Math.random() * songlist.length);
  const chosenSong = songlist[songIndex];
  message.channel.send(`${chosenSong} † LEGGENDARIA`);
}
