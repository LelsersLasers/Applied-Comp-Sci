class Square {
    // Notice that the constructor takes some of its values as inputs,
    //   and sets others by itself.
    constructor(x1, y1, w, h) {
        this.pt1 = [x1, y1];
        this.width = w;
        this.height = h;
        // this.vel1 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
        // this.vel2 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
        this.vel1 = [0, 0];
        this.vel2 = [0, 0];
        this.color = "#0000ff";
        this.width = 3;
        this.cap = 'round';
    }
    draw() {
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        // context.beginPath();
        context.rect(this.pt1[0], this.pt1[1], this.w, this.h);
        context.stroke();
        console.log(this.pt1);
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
sq = new Square(200, 200, 50, 50);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);