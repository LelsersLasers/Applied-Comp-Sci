document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp": paddle1.keys[0] = true; break;
        case "s": case "ArrowDown": paddle1.keys[1] = true; break;

        case "p": paddle2.keys[0] = true; break;
        case "l": paddle2.keys[1] = true; break;

        case "1": case "Enter": paddle1.mode = !paddle1.mode; break;
        case "2": case "Enter": paddle2.mode = !paddle2.mode; break;

        case "z":
            reset();
            break;
    }
}
function keyUpHandler(e) {
    switch (e.key) {
        case "w": paddle1.keys[0] = false; break;
        case "s": paddle1.keys[1] = false; break;

        case "p": paddle2.keys[0] = false; break;
        case "l": paddle2.keys[1] = false; break;
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
    
    ball.update();
    ball.draw();

    paddle1.update();
    paddle2.update();

    paddle1.draw();
    paddle2.draw();

    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = 1/8 * canvas.height + "px serif";
    var txt = score[0] + " : " + score[1];
    context.fillText(txt, canvas.width/2, canvas.height * 1/6);

    if (score[0] >= 11) {
        alive = false;
        context.font = 1/6 * canvas.height + "px serif";
        var txt = "PLAYER 1 WINS!";
        context.fillText(txt, canvas.width/2, canvas.height * 1/2);
    }
    else if (score[1] >= 11) {
        alive = false;
        context.font = 1/6 * canvas.height + "px serif";
        var txt = "PLAYER 2 WINS!";
        context.fillText(txt, canvas.width/2, canvas.height * 1/2);
    }

    if (alive) window.requestAnimationFrame(drawAll);
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
var score = [0, 0];

// Set up the canvas, context objects, and html elements
var context = setUpContext();

var ball = new Ball((canvas.width * canvas.width + canvas.height * canvas.height)/(500 * 500));

var paddle1 = new Paddle(50/600 * canvas.width, 10/600 * canvas.width, 100/600 * canvas.height, 1/2 * (canvas.width * canvas.width + canvas.height * canvas.height)/(500 * 500));
var paddle2 = new Paddle(canvas.width - 50/600 * canvas.width, 10/600 * canvas.width, 100/600 * canvas.height, 1/2 * (canvas.width * canvas.width + canvas.height * canvas.height)/(500 * 500));

// Fire up the animation engine
window.requestAnimationFrame(drawAll);