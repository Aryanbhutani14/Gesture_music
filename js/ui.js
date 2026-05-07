const notes = ["C","D","E","F","G","A","B"];
const chordTypes = ["maj","min","dim","7","maj7","sus","sus4","aug"];

function getCircleCenter(isLeft) {
const x = isLeft
? window.innerWidth * 0.2
: window.innerWidth * 0.8;

const y = window.innerHeight * 0.5;

return { x, y };
}

function getAngle(x, y, center) {
return Math.atan2(y - center.y, x - center.x);
}

function detectNote(x, y) {
const center = getCircleCenter(true);
const angle = getAngle(x, y, center);

const index = Math.floor(
((angle + Math.PI) / (2 * Math.PI)) * notes.length
);

return notes[Math.abs(index % notes.length)];
}

function detectChordType(x, y) {
const center = getCircleCenter(false);
const angle = getAngle(x, y, center);

const index = Math.floor(
((angle + Math.PI) / (2 * Math.PI)) * chordTypes.length
);

return chordTypes[Math.abs(index % chordTypes.length)];
}
