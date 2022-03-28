var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
document.addEventListener("keydown", keyDownHandle, false);
document.addEventListener("keyup", keyUpHandle, false);
function keyDownHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
            wDown = true;
            break;
        case "s":
            sDown = true;
            break;
        case "a":
            aDown = true;
            break;
        case "d":
            dDown = true;
            break;
    }
}
function keyUpHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
            wDown = false;
            break;
        case "s":
            sDown = false;
            break;
        case "a":
            aDown = false;
            break;
        case "d":
            dDown = false;
            break;
    }
}
function mouseDownActions() { }
function reset() {
    location.reload(); // reloads the webpage
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function average(lst) {
    if (lst.length == 0)
        return 1;
    var sum = 0;
    for (var i in lst)
        sum += lst[i];
    return sum / lst.length;
}
function getFontHeight(w, letters) {
    context.font = 1 + "px " + font;
    var ratio = 1 / context.measureText("a").width;
    return w / letters * ratio;
}
function setDelta() {
    t1 = performance.now();
    var lastDelta = (t1 - t0) / (1000 / 60);
    if (frame > 20 && lastDelta < 2 * average(deltas))
        deltas.push(lastDelta); // protect against alt-tab
    delta = average(deltas);
    t0 = performance.now();
    frame++;
}
function drawGame() {
    player.draw("#00ff00");
}
function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGame();
    setDelta();
    window.requestAnimationFrame(drawAll);
}
function setUpCanvas() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    // Set up the context for the animation
    context = canvas.getContext("2d");
    // disable anti-alising
    context.imageSmoothingEnabled = false; // standard
    context.mozImageSmoothingEnabled = false; // Firefox
    context.oImageSmoothingEnabled = false; // Opera
    context.webkitImageSmoothingEnabled = false; // Safari
    context.msImageSmoothingEnabled = false; // IE
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 3;
}
var t0 = performance.now();
var t1 = performance.now();
var delta = 1; // delta is relative to 60fps
var frame = 0;
var deltas = [];
var font = "monospace";
// Set up the canvas, context objects, and html elements
var canvas;
var context;
setUpCanvas();
var player = new HitBox(new Vector(20, 20), 20, 20);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
