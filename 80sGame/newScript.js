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
    return value;
}

function drawAll() {
    
    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < bar.length; i++) {
        bar[i].draw();
    }
    player.move();
    player.draw();
    obstacles = [...cars, ...waters];
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();
        if (obstacles[i].hb.checkCollide(player.hb)) {
            alive = false;
            player.off();
            stateTxt.innerText = "Status: " + obstacles[i].deathMessage + " (DEAD)";
        }
    }
    for (var i = 0; i < cars.length; i++) {
        for (var j = 0; j < waters.length; j++) {
            waters[j].updateHB();
            if (cars[i].hb.checkCollide(waters[j].hb)) {
                cars[i].ms = -1 * cars[i].ms;
            }
        }
    }
    if (player.hb.outOfBounds()) {
        alive = false;
        player.off();
        stateTxt.innerText = "Status: Got Lost (DEAD)";
    }

    scoreTxt.innerText = "Score: " + topScore;
    moveDelay = moveLockWait - frame > 0 ? moveLockWait - frame : 0;
    moveDelayTxt.innerText = "Move Wait: " + moveDelay;

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
var frame = 0;
var alive = true;
var moveLockWait = 30;
var score = 0;
var topScore = 0;

// Set up the canvas and context objects
context = setUpContext();
stateTxt = document.getElementById("state");
scoreTxt = document.getElementById("score");
moveDelayTxt = document.getElementById("moveDelay");

// player
carWidth = canvas.width * 1/9;
carHeight = canvas.height * 1/14;
playerLevel = carHeight * 10;
player = new Player(new Vector(canvas.width/2, playerLevel), carHeight, carHeight, carHeight * 1.5);

var cars = [];
waterBlockCount = 5;
waters = [];
base = playerLevel - 3 * carHeight;
for (var i = 0; i < 10; i++) {
    startPos = new Vector(getRandomInt(0, canvas.width - carWidth), base - (1.5 * carHeight * i));
    var speed = (getRandomInt(i/4 + 1, i/3 + 2)/900) * canvas.width;
    speed = getRandomInt(1, 3) == 2 ? -speed : speed;
    cars.push(new Car(startPos, carWidth, carHeight, speed));

    if (Math.random() < waterBlockCount/10) {
        waters.push(new Water(startPos.y));
    }
}

// to make it look like player is moving
bar = [];
for (i = 0; i < 14; i++) {
    var c = (i % 2 == 0) ? "#ffff00" : "#ff00ff";
    var c2 = (i % 2 == 0) ? "#ff00ff" : "#ffff00";
    bar.push(new Block(new Vector(0, i * carHeight), c, c2, 20, carHeight));
    bar.push(new Block(new Vector(canvas.width - 20, i * carHeight), c, c2, 20, carHeight));
}


// Fire up the animation engine
window.requestAnimationFrame(drawAll);