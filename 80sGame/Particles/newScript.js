function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    for (var i = 0; i < walls.length; i++) {
        walls[i].draw();
    }

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = 600;
    canvas.height = 600;

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

var alive = true;

const moveWait = 30;

// Set up the canvas, context objects, and html elements
var context = setUpContext();


var walls = [];
walls.push(new Thing(new Vector(0, 0), "#ff0000", 600, 5, 1));
walls.push(new Thing(new Vector(0, 0), "#ff0000", 5, 600, 2));
walls.push(new Thing(new Vector(595, 0), "#ff0000", 5, 600, 2));
walls.push(new Thing(new Vector(0, 595), "#ff0000", 600, 5, 1));

walls.push(new Thing(new Vector(50, 50), "#ff0000", 5, 550, 2));
walls.push(new Thing(new Vector(100, 0), "#ff0000", 5, 550, 2));
walls.push(new Thing(new Vector(150, 0), "#ff0000", 5, 550, 2));
walls.push(new Thing(new Vector(200, 50), "#ff0000", 5, 550, 2));

walls.push(new Thing(new Vector(200, 50), "#ff0000", 50, 5, 1));
walls.push(new Thing(new Vector(300, 50), "#ff0000", 50, 5, 1));
walls.push(new Thing(new Vector(400, 50), "#ff0000", 150, 5, 1));


var particles = [];
for (var i = 0; i < 200; i++) {
    particles.push(new Particle(new Vector(30, 30), 1, 1));
}



// Fire up the animation engine
window.requestAnimationFrame(drawAll);