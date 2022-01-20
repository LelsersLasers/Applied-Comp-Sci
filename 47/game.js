// CHANGE THESE IF WANTED
// NOTE: keep a 2:3 ratio between coinSize and lineSpacing as described by the problem 
var settings = {
    "coinSize": 40, // current scale is 1px = 0.5 mm
    "lineSpacing": 60,
    "lineWidth": 0.0001,
    "lineStartOffset": true,
    "decimalPlaces": 1,
    "coinOutline": 1,
    "drawnLineWidth": 1,
    "drawnLineColor": "#ffffff"
};
// Don't change below this


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    coins.push(new Coin()); // create 1 coin each frame
    total++;
    
    for (var i in coins) coins[i].draw();
    for (var i in lines) lines[i].draw();

    let percent = (noTouching/total) * 100;
    percent = percent.toFixed(settings.decimalPlaces);
    context.fillStyle = "#ffffff";
    context.fillText(percent + "%", 20, canvas.height/40 + 20);
    context.fillText(noTouching + "/" + total, 20, canvas.height/20 + 40);

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

var noTouching = 0;
var total = 0;
var coins = [];

context.font = 1/20 * canvas.height + "px monospace";
context.textAlign = "left";

console.log("Current Settings (change at the top of 'game.js'):" + JSON.stringify(settings));

// Fire up the animation engine
window.requestAnimationFrame(drawAll);