// HAND TRACKING — MediaPipe Hands integration

const hands = new Hands({
    locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

// Start camera feed through MediaPipe
const mpCamera = new Camera(video, {
    onFrame: async () => {
        await hands.send({ image: video });
    },
    width: 1280,
    height: 720
});

mpCamera.start();

// ─── Results ─────────────────────────────────────────────────────────────────

hands.onResults(results => {

    // Clear canvas each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        return;
    }

    let leftDetected  = false;
    let rightDetected = false;

    results.multiHandLandmarks.forEach((landmarks, index) => {

        // MediaPipe labels hands from its own perspective (mirrored),
        // so "Right" in multiHandedness = user's LEFT hand on screen
        const handLabel = results.multiHandedness[index].label; // "Left" or "Right"

        // Index finger tip = landmark 8
        const finger = landmarks[8];

        // Mirror X because video is CSS-flipped (scaleX(-1))
        const x = (1 - finger.x) * canvas.width;
        const y = finger.y * canvas.height;

        // Dot color: orange for left hand, blue for right hand
        const isLeftHand = (handLabel === "Right"); // mirrored
        const dotColor   = isLeftHand ? "#ff8800" : "#00aaff";

        // Draw fingertip glow dot
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.shadowColor = dotColor;
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;

        // White ring
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hand skeleton
        drawHandSkeleton(landmarks);

        if (isLeftHand) {
            leftDetected = true;
            const detected = detectNote(x, y);
            if (detected !== currentNote) {
                currentNote = detected;
                triggerChord();
            }

            // Highlight active segment on left wheel
            const dx = x - leftCircle.x;
            const dy = y - leftCircle.y;
            if (Math.sqrt(dx * dx + dy * dy) <= leftCircle.radius) {
                const seg = getNoteSegment(x, y);
                const leftSvg = document.getElementById("leftWheelSvg");
                if (leftSvg) highlightSegment(leftSvg, seg, "#ff8800", NOTE_COUNT);
            }

        } else {
            rightDetected = true;
            const detected = detectChordType(x, y);
            if (detected !== currentChordType) {
                currentChordType = detected;
                triggerChord();
            }

            // Highlight active segment on right wheel
            const dx = x - rightCircle.x;
            const dy = y - rightCircle.y;
            if (Math.sqrt(dx * dx + dy * dy) <= rightCircle.radius) {
                const seg = getChordSegment(x, y);
                const rightSvg = document.getElementById("rightWheelSvg");
                if (rightSvg) highlightSegment(rightSvg, seg, "#00aaff", CHORD_COUNT);
            }
        }
    });

    // Clear highlights for hands not detected this frame
    if (!leftDetected) {
        const leftSvg = document.getElementById("leftWheelSvg");
        if (leftSvg) { const old = leftSvg.querySelector(".active-segment"); if (old) old.remove(); }
    }
    if (!rightDetected) {
        const rightSvg = document.getElementById("rightWheelSvg");
        if (rightSvg) { const old = rightSvg.querySelector(".active-segment"); if (old) old.remove(); }
    }
});

// ─── Skeleton drawing ─────────────────────────────────────────────────────────

const HAND_CONNECTIONS = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17]
];

function drawHandSkeleton(landmarks) {
    HAND_CONNECTIONS.forEach(([a, b]) => {
        const lmA = landmarks[a];
        const lmB = landmarks[b];
        const ax = (1 - lmA.x) * canvas.width;
        const ay = lmA.y * canvas.height;
        const bx = (1 - lmB.x) * canvas.width;
        const by = lmB.y * canvas.height;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}
