var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var lastDir = "s";

var qDown = false;
var eDown = false;
var rDown = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", getCursorPosition, false);

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
function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    cursorHB = new HitBox(new Vector(x - 3, y - 3), 6, 6);

    if (screen == "welcome") {
        if (cursorHB.checkCollide(directionsHB)) {
            screen = "directions";
        }
        else {
            screen = "game";
        }
    }
    else if (screen == "game" && alive) {
        qDown = cursorHB.checkCollide(qAbility.hb);
        eDown = cursorHB.checkCollide(eAbility.hb);
        rDown = cursorHB.checkCollide(rAbility.hb);
    }
    else if (screen == "game" && !alive) {
        // screen = "welcome";
        reset();
    }
    else if (screen == "directions") {
        screen = "welcome";
    }
}

function reset() {
    location.reload();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    return value;
}

function drawWelcome() {

    if (textTimer > textWait) {
        textActive = !textActive;
        textTimer = 0;
    }

    context.textAlign = "center";
    context.fillStyle = "#ffffff";

    context.font = carHeight + "px serif";
    context.fillText("NEO CROSSER", canvas.width/2, canvas.height * 1/3);

    if (textActive) {
        context.font = carHeight/2 + "px serif";
        context.fillText("Touch to Start", canvas.width/2, canvas.height * 1/3 + carHeight);
    }
    txt = "Directions";
    context.font = carHeight * 5/12 + "px serif";
    width = context.measureText(txt).width;
    directionsHB = new HitBox(new Vector(canvas.width/2 - width/2 - 10, canvas.height * 1/3 + carHeight * 4 - carHeight * 1/3 - 10), width + 20, carHeight * 5/12 + 20);
    directionsHB.draw("#ffffff");
    context.fillText(txt, canvas.width/2, canvas.height * 1/3 + carHeight * 4);

    textTimer++;
}

function drawDirections() {
    if (textTimer > textWait) {
        textActive = !textActive;
        textTimer = 0;
    }

    context.textAlign = "center";
    context.fillStyle = "#ffffff";

    context.font = carHeight + "px serif";
    context.fillText("Directions", canvas.width/2, canvas.height * 1/3);

    if (textActive) {
        context.font = carHeight/2 + "px serif";
        context.fillText("Touch to Go Back", canvas.width/2, canvas.height * 1/3 + carHeight);
    }
    var txts = [];
    txts.push("Directions: You are the green, the cars are the red. Use 'wasd' to move.");
    txts.push("Don't get hit by cars or go out of bounds sideways.");
    txts.push("Also you can't swim (don't go into the blue water). Cars also can't swim.");
    txts.push("Goal: Go as far up as possible. You also have 3 abilities.");
    txts.push("Q which teleports a short distance,");
    txts.push("E which fires a laser that causes a small stun, and");
    txts.push("R which fires a laser in every direction.");
    txts.push("If you die, touch the screen to restart");
    context.font = carHeight * 5/12 + "px serif";
    for (var i = 0; i < txts.length; i++) {
        context.fillText(txts[i], canvas.width/2, canvas.height * 1/3 + carHeight + carHeight * 1/2 * (3+i));
    }

    textTimer++;
}

function drawGame() {
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
            stateTxt.style.backgroundColor = obstacles[i].deathColor;
            scoreView.color = obstacles[i].deathColor;
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
        scoreView.color = "#dae37b";
    }

    qAbility.draw();
    eAbility.draw();
    rAbility.draw();

    scoreTxt.innerText = "Score: " + topScore;
    scoreView.setTxt("Score: " + topScore);
    scoreView.draw();
    
    qDelay = qAbility.wait - qAbility.timer >= 0 ? qAbility.wait - qAbility.timer : 0;
    qCD2.style.width = ((qAbility.wait - qDelay) * cdBarWidth/qAbility.wait) + "px";
    qCD2.style.backgroundColor = qDelay == 0 ? "#9ee092" : "#5e94d1";

    eDelay = eAbility.wait - eAbility.timer >= 0 ? eAbility.wait - eAbility.timer : 0;
    eCD2.style.width = ((eAbility.wait - eDelay) * cdBarWidth/eAbility.wait) + "px";
    eCD2.style.backgroundColor = eDelay == 0 ? "#9ee092" : "#5e94d1";

    rDelay = rAbility.wait - rAbility.timer >= 0 ? rAbility.wait - rAbility.timer : 0;
    rCD2.style.width = ((rAbility.wait - rDelay) * cdBarWidth/rAbility.wait) + "px";
    rCD2.style.backgroundColor = rDelay == 0 ? "#9ee092" : "#5e94d1";
}

function drawAll() {
    
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (screen == "welcome") {
        drawWelcome();
    }
    else if (screen == "game") {
        drawGame();
    }
    else if (screen == "directions") {
        drawDirections();
    }
    
    // Loop the animation to the next frame.
    // if (alive) {
    //     window.requestAnimationFrame(drawAll);
    // }
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

var screen = "welcome";

var alive = true;
var score = 0;
var topScore = 0;

var moveWait = 30;

var textTimer = 0;
var textWait = 25;
var textActive = false;
var directionsHB;

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

qAbility = new Ability(new Vector(carHeight    , playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "Q");
eAbility = new Ability(new Vector(carHeight * 2, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "E");
rAbility = new Ability(new Vector(carHeight * 3, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 240, 240, "R");
scoreView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", carHeight, carHeight/3, "Score: 0");

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
for (i = 0; i < 14; i++) {
    var c = (i % 2 == 0) ? "#ffff00" : "#ff00ff";
    var c2 = (i % 2 == 0) ? "#ff00ff" : "#ffff00";
    j = i - 2;
    bar.push(new Block(new Vector(0, j * carHeight * 1.5), c, c2, 20, carHeight * 1.5));
    bar.push(new Block(new Vector(canvas.width - 20, j * carHeight * 1.5), c, c2, 20, carHeight * 1.5));
}


// Fire up the animation engine
window.requestAnimationFrame(drawAll);