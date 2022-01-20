var settings = {
    "coinSize": 20,
    "lineSpacing": 30,
    "lineWidth": 0.0001,
    "lineStartOffset": true,
};


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    coins.push(new Coin());
    total++;

    for (var i in lines) lines[i].draw();
    for (var i in coins) coins[i].draw();

    let percent = (fails/total) * 100;
    percent = percent.toFixed(0);
    context.fillStyle = "#ffffff";
    context.fillText(percent + "%", 20, canvas.height/40 + 20);
    context.fillText(fails + "/" + total, 20, canvas.height/20 + 40);

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

var lines = [];
for (var i = 0; i < canvas.width/settings.lineSpacing; i++) {
    let y = i * settings.lineSpacing + (settings.lineStartOffset ? settings.lineSpacing/2 : 0);
    lines.push(new Line(y));
}

var fails = 0;
var total = 0;
var coins = [];

context.font = 1/20 * canvas.height + "px monospace";
context.textAlign = "left";

// Fire up the animation engine
window.requestAnimationFrame(drawAll);