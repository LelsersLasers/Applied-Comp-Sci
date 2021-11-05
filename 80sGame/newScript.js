var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    if (e.key == "r") {
        reset();
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    console.log("Random Number: " + value);
    return value;
}


class Vector { // also a force
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    print() {
        console.log(this.x, this.y);
    }

    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
    setBoth(values) {
        this.x = values[0];
        this.y = values[1];
    }
}

class Thing {
    constructor(pt, w, h, color, f) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.v = new Vector(0, 0);
        this.f = f; // forces
        this.color = color;
        this.width = 3;
        this.active = true;
    }

    off() {
        this.active = false;
    }
    on() {
        this.active = true;
    }
    toggle() {
        this.active = !this.active;
    }

    update() {
        for (var i = 0; i < this.f.length; i++) { // for every force, update the vel
            this.v.apply(this.f[i])
        }
        this.pt.apply(this.v);
    }

    // draw to be pre extend
    // draw() {
    //     context.strokeStyle = this.color;
    //     context.fillStyle = this.color;
    //     context.lineWidth = this.width;
    //     context.beginPath();
    //     context.rect(this.pt.x, this.pt.y, this.w, this.h);
    //     if (this.active) {
    //         context.fill();
    //     }
    //     context.stroke();
    // }
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
Fg = new Vector(0, 9.8);

// Set up the canvas and context objects
context = setUpContext();
sq = new Square(new Vector(50, canvas.height/2 - 25), 50, 50, "#0000ff");
greenLight = new Square(new Vector(canvas.width - 50, 0), 50, 50, "#00ff00");
greenLight.off();
redLight = new Square(new Vector(canvas.width - 50, 54), 50, 50, "#ff0000");
redLight.off();

stateTxt = document.getElementById("state");

// Fire up the animation engine
window.requestAnimationFrame(drawAll);