const video = document.getElementById("webcam");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
video.srcObject = stream;
});

// Placeholder variables
let currentNote = "C";
let currentType = "maj";

// Simple Tone.js setup
const synth = new Tone.PolySynth().toDestination();

function playChord() {
const chordMap = {
maj: ["C4", "E4", "G4"],
min: ["C4", "Eb4", "G4"]
};

synth.triggerAttackRelease(chordMap[currentType], "1n");

document.getElementById("currentChord").innerText =
currentNote + " " + currentType;
}
