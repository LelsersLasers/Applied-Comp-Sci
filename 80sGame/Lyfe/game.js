var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var mouseDown = false;
var cursorHB = new HitBox(new Vector(-100, -100), 10, 10);
document.addEventListener("keydown", keyDownHandle, false);
document.addEventListener("keyup", keyUpHandle, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", getMousePos, false);
function keyDownHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            wDown = true;
            break;
        case "s":
        case "arrowdown":
            sDown = true;
            break;
        case "a":
        case "arrowleft":
            aDown = true;
            break;
        case "d":
        case "arrowright":
            dDown = true;
            break;
    }
}
function keyUpHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            wDown = false;
            break;
        case "s":
        case "arrowdown":
            sDown = false;
            break;
        case "a":
        case "arrowleft":
            aDown = false;
            break;
        case "d":
        case "arrowright":
            dDown = false;
            break;
    }
}
function clickHandler(event) { }
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    cursorHB.pt.x = event.clientX - rect.left - 6;
    cursorHB.pt.y = event.clientY - rect.top - 6;
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
function checkFrame(frame, interval) {
    var str = frame.toFixed(0);
    var rounded = Number(str);
    if (rounded % interval == 0) {
        return true;
    }
    return false;
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
    player.move();
    player.draw();
    enemy.update();
    enemy.draw();
}
function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawGame();
    setDelta();
    window.requestAnimationFrame(drawAll);
}
function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    canvas.onmousedown = function () { return mouseDown = true; };
    canvas.onmouseup = function () { return mouseDown = false; };
    // Set up the context for the animation
    var context = canvas.getContext("2d");
    // disable anti-alising
    context.imageSmoothingEnabled = false; // standard
    context.mozImageSmoothingEnabled = false; // Firefox
    context.oImageSmoothingEnabled = false; // Opera
    context.webkitImageSmoothingEnabled = false; // Safari
    context.msImageSmoothingEnabled = false; // IE
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 3;
    return context;
}
var t0 = performance.now();
var t1 = performance.now();
var delta = 1; // delta is relative to 60fps
var frame = 0;
var deltas = [];
var font = "monospace";
// Set up the canvas, context objects, and html elements
var canvas;
var context = setUpContext();
var player = new Player(new Vector(20, 20), 20, 20, "#00ff00", 3, 100, 20);
var enemy = new Enemy(player, new Vector(200, 200), 15, 15, "#ff0000", 2, 50, 10);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
