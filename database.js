// Modules
const fs = require('fs');

// Game Files
const grooveCoasterPcFile = './database/groove-coaster-pc.csv';
const museDashFile = './database/muse-dash.csv';
const piuPrime2File = './database/piu-prime-2.csv';

// Song Arrays
const grooveCoasterPcSongs = [];
const museDashSongs = [];
const piuPrime2Songs = [];

// Constant Variables
const newlineChar = '\r\n';

/* ===================================
 * ===== GAME SPECIFIC FUNCTIONS =====
 * ===================================
 */

// loadGrooveCoasterPC()
function loadGrooveCoasterPC() {
  let fileString = fs.readFileSync(grooveCoasterPcFile, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      grooveCoasterPcSongs[num - 1] = {
        name: songString[0],
        artist: songString[1],
        bpm: parseInt(songString[2], 10),
        difficulties: songString[3].split(' '),
        type: songString[4].toLowerCase(),
        date: songString[5],
      };
    }
  }

  console.log('-- Groove Coaster PC songs loaded!');
}

// loadMuseDash()
function loadMuseDash() {
  let fileString = fs.readFileSync(museDashFile, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      museDashSongs[num - 1] = {
        name: songString[0],
        artist: songString[1],
        length: songString[2],
        bpm: songString[3],
        unlockLevel: parseInt(songString[4], 10),
        easy: parseInt(songString[5], 10),
        hard: parseInt(songString[6], 10),
        master: parseInt(songString[7], 10),
        hidden: parseInt(songString[8], 10),
        pack: songString[9],
        cover: songString[10],
      };
    }
  }

  console.log('-- Muse Dash songs loaded!');
}

// loadPiuPrime2()
function loadPiuPrime2() {
  let fileString = fs.readFileSync(piuPrime2File, 'utf8');
  let songString = [];

  fileString = fileString.split(newlineChar);
  for (let num = 1; num < fileString.length; num++) {
    if (fileString[num].includes(',')) {
      songString = fileString[num].split(',');
      piuPrime2Songs[num - 1] = {
        type: songString[0],
        bpm: +songString[1],
        artist: songString[2],
        name: songString[3],
        version: songString[4],
        charts: songString[5].split(' '),
        unlocks: songString[6].split(' '),
        series: songString[7],
        channel: songString[8],
      };
    }
  }

  console.log('-- Pump It Up Prime 2 songs loaded!');
}

/* =============================
 * ===== GENERIC FUNCTIONS =====
 * =============================
 */
// loadSongs()
function loadSongs() {
  // Loading the song CSVs
  loadGrooveCoasterPC();
  loadMuseDash();
  loadPiuPrime2();
}

// Setting up the exports
module.exports = {
  LoadSongs: loadSongs,
  MuseDash: museDashSongs,
  PIUPrime2: piuPrime2Songs,
  GrooveCoasterPC: grooveCoasterPcSongs,
};
