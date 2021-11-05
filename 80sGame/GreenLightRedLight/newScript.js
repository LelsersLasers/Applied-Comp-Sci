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


class Vector {
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

class Square {
    // Notice that the constructor takes some of its values as inputs,
    //   and sets others by itself.
    constructor(pt, w, h, color) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.v = new Vector(0, 0);
        this.f = []; // forces
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

    move() {
        if (rightPressed) {
            this.pt.x += 1;
        }
        else if (leftPressed) {
            this.pt.x -= 1;
        }
        if ((rightPressed || leftPressed) && !canMove) {
            console.log("Illeagal movement!");
            stateTxt.innerText = "Status: DEAD";
            alive = false;
        }
    }

    checkDone() {
        if (this.pt.x > canvas.width - 50){
            console.log("YOU WIN!");
        }
    }

    update() {
        for (var i = 0; i < this.f.length; i++) { // for every force, update the vel
            this.v.apply(this.f[i])
        }
        this.pt.apply(this.v);
    }

    draw() {
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        if (this.active) {
            context.fill();
        }
        context.stroke();
    }
}

function shortener(start) {
    value = start * Math.pow(0.99, time/100);
    return value;
}

var frame = 0;
var time = 0;
var delay = getRandomInt(200, 400);
var canMove = false;
var alive = true;
function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{
    if (frame == delay) {
        if (!greenLight.active && !redLight.active) {
            greenLight.on()
            redLight.on();
            canMove = true;
            delay = getRandomInt(shortener(100), shortener(200));
            frame = 0;
        }
        else if(greenLight.active && redLight.active){
            greenLight.off();
            frame = 0;
        }
        else {
            redLight.off();
            canMove = false;
            delay = getRandomInt(shortener(200), shortener(400));
            frame = 0;
        }
        
    }
    
    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    sq.draw();
    sq.update();
    greenLight.draw();
    redLight.draw();
    sq.move();

    // Loop the animation to the next frame.
    if (alive) {
        window.requestAnimationFrame(drawAll);
    }

    frame++;
    time++;
}

function reset() {
    sq = new Square(new Vector(50, canvas.height/2 - 25), 50, 50, "#0000ff");
    greenLight = new Square(new Vector(canvas.width - 50, 0), 50, 50, "#00ff00");
    greenLight.off();
    redLight = new Square(new Vector(canvas.width - 50, 54), 50, 50, "#ff0000");
    redLight.off();
    stateTxt.innerText = "Status: Alive";

    frame = 0;
    time = 0;
    delay = getRandomInt(200, 400);
    canMove = false;
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