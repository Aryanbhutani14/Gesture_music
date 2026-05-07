// UI — wheel geometry, segment detection, and SVG building

const notes      = ["C", "D", "E", "F", "G", "A", "B"];
const chordTypes = ["maj", "min", "7", "maj7", "sus4", "sus", "dim", "aug"];

const NOTE_COUNT  = notes.length;      // 7
const CHORD_COUNT = chordTypes.length; // 8

// Circle hit-test geometry (screen pixels) — recalculated on resize
let leftCircle  = { x: 0, y: 0, radius: 0 };
let rightCircle = { x: 0, y: 0, radius: 0 };

function initWheels() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const containerW = 400;
    const scale      = containerW / 400; // = 1.0 (container matches viewBox)

    const leftContainerLeft  = W * 0.04;
    const rightContainerLeft = W - W * 0.04 - containerW;
    const containerCenterY   = H * 0.5;

    leftCircle = {
        x:      leftContainerLeft + 200 * scale,
        y:      containerCenterY,
        radius: 180 * scale
    };

    rightCircle = {
        x:      rightContainerLeft + 200 * scale,
        y:      containerCenterY,
        radius: 180 * scale
    };
}

initWheels();
window.addEventListener("resize", initWheels);

// ─── Segment helpers ──────────────────────────────────────────────────────────

// Returns angle in [0, 2π) with 0 at the top (12 o'clock), going clockwise
function clockwiseAngle(x, y, center) {
    let a = Math.atan2(y - center.y, x - center.x) + Math.PI / 2;
    if (a < 0) a += Math.PI * 2;
    return a;
}

function getNoteSegment(x, y) {
    return Math.floor(clockwiseAngle(x, y, leftCircle) / (Math.PI * 2 / NOTE_COUNT));
}

function getChordSegment(x, y) {
    return Math.floor(clockwiseAngle(x, y, rightCircle) / (Math.PI * 2 / CHORD_COUNT));
}

// ─── Detection ────────────────────────────────────────────────────────────────

function detectNote(x, y) {
    const dx = x - leftCircle.x, dy = y - leftCircle.y;
    if (Math.sqrt(dx*dx + dy*dy) > leftCircle.radius) return currentNote;
    return notes[getNoteSegment(x, y) % NOTE_COUNT];
}

function detectChordType(x, y) {
    const dx = x - rightCircle.x, dy = y - rightCircle.y;
    if (Math.sqrt(dx*dx + dy*dy) > rightCircle.radius) return currentChordType;
    return chordTypes[getChordSegment(x, y) % CHORD_COUNT];
}

// ─── SVG wheel builder ────────────────────────────────────────────────────────
// Builds a wheel with `count` equal segments into the given SVG element.
// Labels are placed at the midpoint angle of each segment, at 75% radius.

function buildWheel(svgEl, labels) {
    const count = labels.length;
    const cx = 200, cy = 200, r = 180;
    const labelR = 138; // distance from center for label placement
    const step = (Math.PI * 2) / count;

    // Clear existing content
    svgEl.innerHTML = "";

    // Outer ring
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("class", "outer-ring");
    svgEl.appendChild(circle);

    // Segment divider lines + labels
    for (let i = 0; i < count; i++) {
        // Line angle: segment boundary starts at top (−π/2), each step apart
        const lineAngle = -Math.PI / 2 + i * step;
        const lx = cx + r * Math.cos(lineAngle);
        const ly = cy + r * Math.sin(lineAngle);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", cx);
        line.setAttribute("y1", cy);
        line.setAttribute("x2", lx.toFixed(2));
        line.setAttribute("y2", ly.toFixed(2));
        svgEl.appendChild(line);

        // Label at midpoint of this segment
        const midAngle = lineAngle + step / 2;
        const tx = cx + labelR * Math.cos(midAngle);
        const ty = cy + labelR * Math.sin(midAngle);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", tx.toFixed(2));
        text.setAttribute("y", ty.toFixed(2));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.textContent = labels[i];
        svgEl.appendChild(text);
    }
}

// ─── Segment highlight ────────────────────────────────────────────────────────

function highlightSegment(svgEl, segmentIndex, color, totalSegments) {
    const old = svgEl.querySelector(".active-segment");
    if (old) old.remove();

    const cx = 200, cy = 200, r = 180;
    const step = (Math.PI * 2) / totalSegments;

    const startAngle = -Math.PI / 2 + segmentIndex * step;
    const endAngle   = startAngle + step;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "active-segment");
    path.setAttribute("d", `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`);
    path.setAttribute("fill", color);
    path.setAttribute("opacity", "0.4");

    // Insert as first child so it renders behind lines and text
    svgEl.insertBefore(path, svgEl.firstChild);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

// Build both wheels once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const leftSvg  = document.getElementById("leftWheelSvg");
    const rightSvg = document.getElementById("rightWheelSvg");
    if (leftSvg)  buildWheel(leftSvg,  notes);
    if (rightSvg) buildWheel(rightSvg, chordTypes);
});
