const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// FULLSCREEN CANVAS
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// CURRENT STATE
let currentNote = "C";
let currentType = "maj";
let lastPlayed = "";

// AUDIO
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

// REQUIRED FOR BROWSER AUDIO
document.body.addEventListener("click", async () => {
await Tone.start();
console.log("Audio ready");
});

// PLAY CHORD
function playChord(note, type) {

const notes = getChordNotes(note, type);

const current = note + type;

if (current === lastPlayed) return;

lastPlayed = current;

synth.triggerAttackRelease(notes, "2n");

document.getElementById("currentChord").innerText =
note + " " + type;
}

// START WEBCAM
navigator.mediaDevices.getUserMedia({
video: {
width: 1280,
height: 720
}
})
.then(stream => {
video.srcObject = stream;
});
