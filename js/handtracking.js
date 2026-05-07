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

const camera = new Camera(video, {
onFrame: async () => {
await hands.send({ image: video });
},
width: 640,
height: 480
});

camera.start();

hands.onResults(results => {
ctx.clearRect(0, 0, canvas.width, canvas.height);

if (!results.multiHandLandmarks) return;

results.multiHandLandmarks.forEach((landmarks, index) => {
const finger = landmarks[8];

```
const x = finger.x * canvas.width;
const y = finger.y * canvas.height;

// Draw cursor
ctx.beginPath();
ctx.arc(x, y, 10, 0, 2 * Math.PI);
ctx.fillStyle = index === 0 ? "orange" : "blue";
ctx.fill();

// Detect circle interaction
if (index === 0) {
  currentNote = detectNote(x, y);
} else {
  currentType = detectChordType(x, y);
}
```

});

playChord(currentNote, currentType);
});
