const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Current state
let currentNote = "C";
let currentType = "maj";
let lastPlayed = "";

// Tone.js
const synth = new Tone.PolySynth().toDestination();

function playChord(note, type) {
const notes = getChordNotes(note, type);

const chordKey = note + type;
if (chordKey === lastPlayed) return;

lastPlayed = chordKey;

synth.triggerAttackRelease(notes, "1n");

document.getElementById("currentChord").innerText =
note + " " + type;
}

// Webcam setup
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
video.srcObject = stream;
});
