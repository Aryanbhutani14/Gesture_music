const hands = new Hands({
locateFile: file =>
`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
maxNumHands: 2,
modelComplexity: 1,
minDetectionConfidence: 0.7,
minTrackingConfidence: 0.7
});

// CAMERA
const camera = new Camera(video, {
onFrame: async () => {
await hands.send({ image: video });
},
width: 1280,
height: 720
});

camera.start();

// RESULTS
hands.onResults(results => {

ctx.clearRect(0, 0, canvas.width, canvas.height);

if (!results.multiHandLandmarks) return;

results.multiHandLandmarks.forEach((landmarks, index) => {

```
const finger = landmarks[8];

// MIRROR X
const x = (1 - finger.x) * canvas.width;
const y = finger.y * canvas.height;

// DRAW CURSOR
ctx.beginPath();
ctx.arc(x, y, 18, 0, Math.PI * 2);

ctx.fillStyle = index === 0 ? "#ff8800" : "#00aaff";

ctx.fill();

// DETECT NOTE
if (index === 0) {
  currentNote = detectNote(x, y);
}

// DETECT CHORD TYPE
else {
  currentType = detectChordType(x, y);
}
```

});

playChord(currentNote, currentType);

});
