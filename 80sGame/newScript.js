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
var moveLockWait = 30;
function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{
    
    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bar.length; i++) {
        bar[i].draw();
    }
    player.move();
    player.draw();
    for (var i = 0; i < cars.length; i++) {
        cars[i].update();
        cars[i].draw();
        if (cars[i].hb.checkCollide(player.hb)) {
            alive = false;
            player.off();
            stateTxt.innerText = "Status: Road Kill (DEAD)";
        }
    }
    if (player.hb.outOfBounds()) {
        alive = false;
        player.off();
        stateTxt.innerText = "Status: Got Lost (DEAD)";
    }

    // Loop the animation to the next frame.
    // if (alive) {
    //     window.requestAnimationFrame(drawAll);
    // }
    window.requestAnimationFrame(drawAll);
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

// Set up the canvas and context objects
context = setUpContext();
stateTxt = document.getElementById("state");
carWidth = canvas.width * 1/9;
carHeight = canvas.height * 1/14;
console.log(carHeight);
playerLevel = carHeight * 9;
player = new Player(new Vector(canvas.width/2, playerLevel + 1.25 * carHeight), "#00ff00", carHeight, carHeight, carHeight * 1.5);

// car1 = new Car(new Vector(0, playerLevel - 1.75 * carHeight), "#ff0000", carWidth, carHeight, 3/900 * canvas.height);
// car2 = new Car(new Vector(canvas.width - carWidth, playerLevel - 3.25 * carHeight), "#ff0000", carWidth, carHeight, -3/900 * canvas.height);
// car3 = new Car(new Vector(0, playerLevel - 4.75 * carHeight), "#ff0000", carWidth, carHeight, 5/900 * canvas.height);
// car4 = new Car(new Vector(0, playerLevel - 6.25 * carHeight), "#ff0000", carWidth, carHeight, 7/900 * canvas.height);
// car5 = new Car(new Vector(0, playerLevel - 7.75 * carHeight), "#ff0000", carWidth, carHeight, 3/900 * canvas.height);
// car6 = new Car(new Vector(canvas.width - carWidth, playerLevel - 9.25 * carHeight), "#ff0000", carWidth, carHeight, -3/900 * canvas.height);
// car7 = new Car(new Vector(0, playerLevel - 10.75 * carHeight), "#ff0000", carWidth, carHeight, 3/900 * canvas.height);
// car8 = new Car(new Vector(0, playerLevel - 12.25 * carHeight), "#ff0000", carWidth, carHeight, 5/900 * canvas.height);
// car9 = new Car(new Vector(0, playerLevel - 13.75 * carHeight), "#ff0000", carWidth, carHeight, -7/900 * canvas.height);
// car10 = new Car(new Vector(0, playerLevel - 15.25 * carHeight), "#ff0000", carWidth, carHeight, 7/900 * canvas.height);
// cars = [car1, car2, car3, car4, car5, car6, car7, car8, car9, car10];
cars = [];
base = playerLevel - 1.75 * carHeight;
for (var i = 0; i < 10; i++) {
    startPos = new Vector(getRandomInt(0, canvas.width - carWidth), base - (1.5 * carHeight * i));
    speed = (getRandomInt(i/4 + 1, i/3 + 2)/900) * canvas.width;
    cars.push(new Car(startPos, "#ff0000", carWidth, carHeight, speed));
}

// to make it look like player is moving
bar = [];
for (i = 0; i < 14; i++) {
    c = "#ffff00";
    c2 = "#ff00ff";
    if (i % 2 == 0) {
        c = "#ff00ff";
        c2 = "#ffff00";
    }
    bar.push(new Block(new Vector(0, i * carHeight), c, c2, 20, carHeight));
    bar.push(new Block(new Vector(canvas.width - 20, i * carHeight), c, c2, 20, carHeight));
}

// Fire up the animation engine
window.requestAnimationFrame(drawAll);