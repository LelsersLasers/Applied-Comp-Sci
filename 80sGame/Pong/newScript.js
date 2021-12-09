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

var ball = new Ball(new Vector(canvas.width/2, canvas.height/2), 10);

var paddle1 = new Paddle(new Vector(50/600 * canvas.width, getRandomInt(0, canvas.height)), 10/600 * canvas.width, 100/600 * canvas.height, 2);
var paddle2 = new Paddle(new Vector(canvas.width - 50/600 * canvas.width, getRandomInt(0, canvas.height)), 10/600 * canvas.width, 100/600 * canvas.height, 2);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);