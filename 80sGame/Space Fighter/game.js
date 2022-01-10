var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp":
            wDown = true;
            break;
        case "s": case "ArrowDown":
            sDown = true;
            break;
        case "a": case "ArrowLeft":
            aDown = true;
            break;
        case "d": case "ArrowRight":
            dDown = true;
            break;
        case "z":
            reset();
            break;
    }
    inputMode = "key";
}
function keyUpHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp": wDown = false; break;
        case "s": case "ArrowDown": sDown = false; break;
        case "a": case "ArrowLeft": aDown = false; break;
        case "d": case "ArrowRight": dDown = false; break;
    }
}

function reset() {
    console.log("restarting...");
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.move();
    player.draw();

    for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
        asteroids[i].draw();
    }
    // console.log("current time: " + new Date().getTime() / 1000);

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

var startTime = new Date().getTime() / 1000;
console.log("starting... (" + startTime + ")");

var context = setUpContext();

var player = new Spaceship(new Vector(canvas.width/2, canvas.height/2), 30);

var asteroids = [];

for (var i = 0; i < 10; i++) {
    let tempAsteroid = new Asteroid();
    asteroids.push(tempAsteroid);
}

var endTime = new Date().getTime() / 1000;
console.log("start up finished... (" + endTime + ")");

console.log("loading time: " + (endTime - startTime));

// Fire up the animation engine
window.requestAnimationFrame(drawAll);