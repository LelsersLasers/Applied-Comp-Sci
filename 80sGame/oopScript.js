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
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
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
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.v = new Vector(0, 0);
        this.f = []; // forces
        this.color = "#0000ff";
        this.width = 3;
    }

    move() {
        if (rightPressed) {
            this.pt.x += 4;
        }
        else if (leftPressed) {
            this.pt.x -= 4;
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
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();
    }

    checkWalls() {
        if (this.pt.y > canvas.height) {
            var Fground = new Vector(0, -Fg.y);
            this.f.push(Fground);
            console.log("Ground found!");
            this.pt.setBoth([this.pt.x, canvas.height]);
        }
    }
}


function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{

    
    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    sq.draw();
    sq.update();
    sq.checkWalls();
    // sq.pt.print();
    sq.move();

    // Loop the animation to the next frame.
    window.requestAnimationFrame(drawAll);
}


function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 50;
    canvas.style.border = "4px solid black";

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

// gravity
Fg = new Vector(0, 9.8);

// Set up the canvas and context objects
context = setUpContext();
sq = new Square(new Vector(50, 50), 50, 50);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);