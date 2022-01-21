// CHANGE THESE IF WANTED
// NOTE: keep a 2:3 ratio between coinSize and lineSpacing as described by the problem 
const settings = {
    "coinSize": 40, // current scale is 1px = 0.5 mm
    "lineSpacing": 60,
    "lineWidth": 0.0001,
    "lineStartOffset": true,
    "decimalPlaces": 1,
    "coinOutline": 1,
    "drawnLineWidth": 1,
    "drawnLineColor": "#ffffff",
    "spawnSpeed": 10 // higher = slower, must be a int and > 1
};
// Don't change below this

function drawWelcome() {
    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = 1/15 * canvas.height + "px " + font;
    context.fillText("Problem 47", canvas.width/2, canvas.height * 1/3);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = 1/30 * canvas.height + "px " + font;
    context.fillText("Touch to Start", canvas.width/2, canvas.height * 1/3 + 1/15 * canvas.height);

    // directionsButton.draw();
    // scoresButton.draw();
}

function drawSimulation() {
    if (simFrame % settings.spawnSpeed == 0) {
        coins.push(new Coin());
        total++;
    }
    
    for (var i in coins) coins[i].draw();
    for (var i in lines) lines[i].draw();

    let percent = (noTouching/total) * 100;
    percent = percent.toFixed(settings.decimalPlaces);

    context.font = 1/20 * canvas.height + "px " + font;
    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.fillText(percent + "%", 20, canvas.height/40 + 20);
    context.fillText(noTouching + "/" + total, 20, canvas.height/20 + 40);

    simFrame++;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (screen == "welcome") drawWelcome();
    else if (screen == "simulation") drawSimulation();
    

    if (textOpacity > 1) opacityDir = -0.04;
    else if (textOpacity < 0) opacityDir = 0.04;
    textOpacity += opacityDir;

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    context = canvas.getContext("2d");
    return context;
}

var context = setUpContext();

var lines = [];
for (var i = 0; i < canvas.width/settings.lineSpacing; i++) {
    let y = i * settings.lineSpacing + (settings.lineStartOffset ? settings.lineSpacing/2 : 0);
    lines.push(new Line(y));
}


const font = "monospace";

var screen = "welcome";

var noTouching = 0;
var total = 0;
var simFrame = 0;

var textOpacity = 1;
var opacityDir = -0.04;

var coins = [];

console.log("Current Settings (change at the top of 'game.js'):" + JSON.stringify(settings));

// Fire up the animation engine
window.requestAnimationFrame(drawAll);