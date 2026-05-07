const NOTE_MAP = {
C: "C4",
D: "D4",
E: "E4",
F: "F4",
G: "G4",
A: "A4",
B: "B4"
};

function getChordNotes(root, type) {
const base = NOTE_MAP[root];

const chords = {
maj: [0, 4, 7],
min: [0, 3, 7],
dim: [0, 3, 6],
"7": [0, 4, 7, 10],
maj7: [0, 4, 7, 11],
sus: [0, 5, 7],
sus4: [0, 5, 7],
aug: [0, 4, 8]
};

return chords[type].map(interval =>
Tone.Frequency(base).transpose(interval).toNote()
);
}
