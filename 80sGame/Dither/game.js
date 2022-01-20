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
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#383434";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let matrixPos = [0, 0];

    for (var i = 0; i < canvas.height; i += pxSize) {
        for (var j = 0; j < canvas.width; j += pxSize) {
            let totalLight = 0;
            for (var l in lights) {
                totalLight += lights[l].calcStrength(new Vector(j * pxSize, i * pxSize));
            }
            totalLight *= ditherMatrix[matrixPos[0]][matrixPos[1]];
            if (totalLight - minLight > 0) {
                context.beginPath();
                context.fillStyle = "#000000";
                context.fillRect(j * pxSize, i * pxSize, pxSize, pxSize);
            }
            if (matrixPos[0] == 0) matrixPos[0] = 1;
            else matrixPos[0] = 0;
        }
        if (matrixPos[1] == 0) matrixPos[1] = 1;
        else matrixPos[1] = 0;
    }

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

var context = setUpContext();

var lights = [
    new Light(new Vector(50, 50), 300)
];


const pxSize = 2;
const minLight = 50;
const ditherMatrix = [
    [0.25, 0.75],
    [1, 0.5]
];


// Fire up the animation engine
window.requestAnimationFrame(drawAll);