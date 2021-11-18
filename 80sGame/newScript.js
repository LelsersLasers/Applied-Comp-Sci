var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var lastDir = "d";

var qDown = false;
var eDown = false;
var rDown = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "w") {
        wDown = true;
        lastDir = e.key;
    }
    if(e.key == "s") {
        sDown = true;
        lastDir = e.key;
    }
    if(e.key == "a") {
        aDown = true;
        lastDir = e.key;
    }
    if(e.key == "d") {
        dDown = true;
        lastDir = e.key;
    }
    if (e.key == "q") {
        qDown = true;
    }
    if (e.key == "e") {
        eDown = true;
    }
    if (e.key == "r") {
        rDown = true;
    }
    if (e.key == "z") {
        reset();
    }
    // if (e.key == "x") {
    //     alive = false;
    // }
}
function keyUpHandler(e) {
    if(e.key == "w") {
        wDown = false;
    }
    if(e.key == "s") {
        sDown = false;
    }
    if(e.key == "a") {
        aDown = false;
    }
    if(e.key == "d") {
        dDown = false;
    }
    if (e.key == "q") {
        qDown = false;
    }
    if (e.key == "e") {
        eDown = false;
    }
    if (e.key == "r") {
        rDown = false;
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
    // player.drawCenter();
    obstacles = [...cars, ...waters];
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();
        if (obstacles[i].hb.checkCollide(player.hb)) {
            alive = false;
            player.off();
            stateTxt.innerText = "Status: " + obstacles[i].deathMessage + " (DEAD)";
            stateTxt.style.backgroundColor = obstacles[i].deathColor;
        }
    }
    for (var i = 0; i < lasers.length; i++) {
        lasers[i].update();
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
        stateTxt.style.backgroundColor = "#dae37b";
    }

    scoreTxt.innerText = "Score: " + topScore;
    // moveDelay = moveLockWait - frame > 0 ? moveLockWait - frame : 0;
    // moveDelayTxt.innerText = "Move Wait: " + moveDelay;
    
    qDelay = qWait - qTimer >= 0 ? qWait - qTimer : 0;
    qCD2.style.width = ((qWait - qDelay) * cdBarWidth/qWait) + "px";
    qCD2.style.backgroundColor = qDelay == 0 ? "#9ee092" : "#5e94d1";

    eDelay = eWait - eTimer >= 0 ? eWait - eTimer : 0;
    eCD2.style.width = ((eWait - eDelay) * cdBarWidth/eWait) + "px";
    eCD2.style.backgroundColor = eDelay == 0 ? "#9ee092" : "#5e94d1";

    rDelay = rWait - rTimer >= 0 ? rWait - rTimer : 0;
    rCD2.style.width = ((rWait - rDelay) * cdBarWidth/rWait) + "px";
    rCD2.style.backgroundColor = rDelay == 0 ? "#9ee092" : "#5e94d1";

    
    moveTimer++;
    qTimer++;
    eTimer++;
    rTimer++;
    // Loop the animation to the next frame.
    // if (alive) {
    //     window.requestAnimationFrame(drawAll);
    // }
    window.requestAnimationFrame(drawAll);
}

function reset() {
    location.reload();
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
var alive = true;
var score = 0;
var topScore = 0;

var moveWait = 30;
var moveTimer = 0;

var qWait = 120;
var qTimer = qWait;
var eWait = 120;
var eTimer = eWait;
var rWait = 240;
var rTimer = rWait;

var lasers = [];

// Set up the canvas, context objects, and html elements
context = setUpContext();
stateTxt = document.getElementById("state");
scoreTxt = document.getElementById("score");
// moveDelayTxt = document.getElementById("moveDelay");

cdBarWidth = 1/6 * canvas.width;

qDelayTxt = document.getElementById("qDelay");
qCD1 = document.getElementById("qCD1");
qCD2 = document.getElementById("qCD2");

eDelayTxt = document.getElementById("eDelay");
eCD1 = document.getElementById("eCD1");
eCD2 = document.getElementById("eCD2");

rDelayTxt = document.getElementById("rDelay");
rCD1 = document.getElementById("rCD1");
rCD2 = document.getElementById("rCD2");

qCD1.style.width = cdBarWidth + "px";
eCD1.style.width = cdBarWidth + "px";
rCD1.style.width = cdBarWidth + "px";

// player
carWidth = canvas.width * 1/9;
carHeight = canvas.height * 1/14;
playerLevel = carHeight * 10;
player = new Player(new Vector(canvas.width/2 - carHeight/2, playerLevel), carHeight, carHeight, carHeight * 1.5 * canvas.width/900, carHeight * 1.5);

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
var bar = [];
for (i = 0; i < 10; i++) {
    var c = (i % 2 == 0) ? "#ffff00" : "#ff00ff";
    var c2 = (i % 2 == 0) ? "#ff00ff" : "#ffff00";
    bar.push(new Block(new Vector(0, i * carHeight * 1.5), c, c2, 20, carHeight * 1.5));
    bar.push(new Block(new Vector(canvas.width - 20, i * carHeight * 1.5), c, c2, 20, carHeight * 1.5));
}


// Fire up the animation engine
window.requestAnimationFrame(drawAll);