// CHORD ENGINE — maps note + type to an array of Tone.js note strings

const NOTE_SEMITONES = {
    C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71
};

const CHORD_INTERVALS = {
    maj:  [0, 4, 7],
    min:  [0, 3, 7],
    dim:  [0, 3, 6],
    "7":  [0, 4, 7, 10],
    maj7: [0, 4, 7, 11],
    sus:  [0, 2, 7],    // sus2
    sus4: [0, 5, 7],    // sus4
    aug:  [0, 4, 8]
};

function getChordNotes(root, type) {
    const rootMidi  = NOTE_SEMITONES[root];
    const intervals = CHORD_INTERVALS[type];

    if (rootMidi === undefined || !intervals) {
        console.warn("Unknown chord:", root, type);
        return ["C4"];
    }

    return intervals.map(interval =>
        Tone.Frequency(rootMidi + interval, "midi").toNote()
    );
}
