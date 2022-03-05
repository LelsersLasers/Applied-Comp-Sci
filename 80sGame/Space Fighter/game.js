var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key.toLowerCase()) {
        case "w": case "arrowup":
            wDown = true;
            break;
        case "s": case "arrowdown":
            sDown = true;
            break;
        case "a": case "arrowleft":
            aDown = true;
            break;
        case "d": case "arrowright":
            dDown = true;
            break;
        case "z":
            reset();
            break;
    }
}
function keyUpHandler(e) {
    switch (e.key) {
        case "w": case "arrowup": wDown = false; break;
        case "s": case "arrowdown": sDown = false; break;
        case "a": case "arrowleft": aDown = false; break;
        case "d": case "arrowright": dDown = false; break;
    }
}

function reset() {
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}

function airResistance(speed) {
    return speed * 0.8;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.move();
    player.draw();

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

var canvas;
var context = setUpContext();

var player = new Ship(new Vector(canvas.width/2, canvas.height/2), 30);


// Fire up the animation engine
window.requestAnimationFrame(drawAll);