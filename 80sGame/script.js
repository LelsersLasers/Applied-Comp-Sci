g = [0, 9.8];

class Square {
    // Notice that the constructor takes some of its values as inputs,
    //   and sets others by itself.
    constructor(x1, y1, w, h) {
        this.pt1 = [x1, y1];
        this.w = w;
        this.h = h;
        this.v = [0, 0];
        // this.vel1 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
        // this.vel2 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
        this.vel1 = [0, 0];
        this.vel2 = [0, 0];
        this.color = "#0000ff";
        this.width = 3;
        this.f = [g];
    }

    update() {
        for (var i = 0; i < this.f.length; i++) {
            this.v[0] = this.v[0] + this.f[i][0];
            this.v[1] = this.v[1] + this.f[i][1];
        }
        this.pt1[0] = this.pt1[0] + this.v[0];
        this.pt1[1] = this.pt1[1] + this.v[1]
    }

    draw() {
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt1[0], this.pt1[1], this.w, this.h);
        context.stroke();
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

    // Loop the animation to the next frame.
    window.requestAnimationFrame(drawAll);
}


function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    // I found that - 20 worked well for me, YMMV
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 50;
    canvas.style.border = "4px solid black";

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

// Set up the canvas and context objects
context = setUpContext();
sq = new Square(50, 50, 50, 50);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);