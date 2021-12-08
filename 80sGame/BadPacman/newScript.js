var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var lastDir = "s";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp":
            wDown = true;
            lastDir = "w";
            break;
        case "s": case "ArrowDown":
            sDown = true;
            lastDir = "s";
            break;
        case "a": case "ArrowLeft":
            aDown = true;
            lastDir = "a";
            break;
        case "d": case "ArrowRight":
            dDown = true;
            lastDir = "d";
            break;
        case "z":
            reset();
            break;
    }
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
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    player.move();
    player.draw();
    
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].draw();
        if (tiles[i].hb.checkCollide(player.hb) && alive) {
            alive = false;
            player.off();
        }
    }
    
    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

var alive = true;

const moveWait = 30;

// Set up the canvas, context objects, and html elements
var context = setUpContext();

const tileWidth = canvas.width / 11;
const tileHeight = canvas.height / 3;

var player = new Player(new Vector(tileWidth, tileHeight), tileWidth, tileHeight, canvas.width/14, 1.5 * canvas.height/14);


var tiles = [
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, tileWidth * 1), tileWidth, tileHeight),
    new Tile(new Vector(0, tileWidth * 1), tileWidth, tileHeight),
    new Tile(new Vector(0, tileWidth * 1), tileWidth, tileHeight),
    new Tile(new Vector(0, tileWidth * 1), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
    new Tile(new Vector(0, 0), tileWidth, tileHeight),
];



// Fire up the animation engine
window.requestAnimationFrame(drawAll);