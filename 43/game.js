function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    coins.push(new Coin());
    total++;

    for (var i = 0; i < lines.length; i++) {
        lines[i].draw();
    }
    for (var i = 0; i < coins.length; i++) {
        coins[i].draw();
    }

    let percent = (fails/total) * 100;
    percent = percent.toFixed(0);
    context.fillStyle = "#ffffff";
    context.fillText(percent + "%", 20, canvas.height/40 + 20);
    context.fillText(fails + "/" + total, 20, canvas.height/20 + 40);
    
    console.log("Percent red (touching a line) rounded to nearest percent = "  + percent + "%");

    window.requestAnimationFrame(drawAll);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
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
for (var i = 0; i < canvas.width/12; i++) {
    lines.push(new Line(i * 12));
}

var fails = 0;
var total = 0;
var coins = [];

context.font = 1/20 * canvas.height + "px monospace";
context.textAlign = "left";

// Fire up the animation engine
window.requestAnimationFrame(drawAll);