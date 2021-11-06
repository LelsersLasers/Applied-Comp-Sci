var up = false;
var down = false;
var left = false;
var right = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "w") {
        up = true;
    }
    else if(e.key == "s") {
        down = true;
    }
    else if(e.key == "a") {
        left = true;
    }
    else if(e.key == "d") {
        right = true;
    }
    if (e.key == "r") {
        reset();
    }
}

function keyUpHandler(e) {
    if(e.key == "w") {
        up = false;
    }
    else if(e.key == "s") {
        down = false;
    }
    else if(e.key == "a") {
        left = false;
    }
    else if(e.key == "d") {
        right = false;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    console.log("Random Number: " + value);
    return value;
}


function shortener(start) {
    value = start * Math.pow(0.99, time/100);
    return value;
}

var frame = 0;
var alive = true;
function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{
    
    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.checkMove();
    player.update();
    player.draw();

    // Loop the animation to the next frame.
    if (alive) {
        window.requestAnimationFrame(drawAll);
    }

    frame++;
}

function reset() {

    frame = 0;
    alive = true;
    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    // canvas.style.border = "4px solid black";

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

// gravity
Fg = new Force(0, 9.8, 270);

Fforward = new Vector(5, 0, 0);
Fforward.setHeading(0);
Fbackward = new Vector(-5, 0, 0);

player = new Ship(new Vector(50,50), 20, 20, 0, "#00ff00", [Fforward]);


// Set up the canvas and context objects
context = setUpContext();

stateTxt = document.getElementById("state");

// Fire up the animation engine
window.requestAnimationFrame(drawAll);