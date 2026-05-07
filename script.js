// MAIN — audio context, state, and chord playback

const video  = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

// Match canvas to viewport
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ─── State ────────────────────────────────────────────────────────────────────

let currentNote      = "C";
let currentChordType = "maj";
let lastPlayedKey    = "";

// ─── Audio ────────────────────────────────────────────────────────────────────

let synth = null;
let audioStarted = false;

async function startAudio() {
    if (audioStarted) return;
    audioStarted = true;

    // Hide the start overlay
    const overlay = document.getElementById("startOverlay");
    if (overlay) overlay.classList.add("hidden");

    await Tone.start();

    synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: {
            attack:  0.05,
            decay:   0.3,
            sustain: 0.4,
            release: 1.2
        }
    }).toDestination();

    synth.set({ volume: -6 });

    console.log("Audio ready ✅");

    // Play a welcome chord so the user knows audio is working
    playChord("C", "maj");
}

// Audio requires a user gesture — click or tap anywhere to start
document.body.addEventListener("click",  startAudio, { once: true });
document.body.addEventListener("touchstart", startAudio, { once: true });

// ─── Chord playback ───────────────────────────────────────────────────────────

// Called by handTracking whenever note or chord type changes
function triggerChord() {
    playChord(currentNote, currentChordType);
}

function playChord(note, type) {
    if (!synth) return;

    const key = note + "_" + type;
    if (key === lastPlayedKey) return;   // same chord, skip
    lastPlayedKey = key;

    const notes = getChordNotes(note, type);

    // Release any held notes first, then play new chord
    synth.releaseAll();
    synth.triggerAttackRelease(notes, "2n");

    // Update display
    document.getElementById("currentChord").innerText = note + " " + type;
}
