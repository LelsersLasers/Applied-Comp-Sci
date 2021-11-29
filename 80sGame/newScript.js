var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var lastDir = "s";

var qDown = false;
var eDown = false;
var rDown = false;

var inputMode = "either";
var mouseDown = false;
var mousePos = new Vector(-1, -1);
var cursorHB = new HitBox(-1, -1, 0, 0);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", getMousePos, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp": wDown = true; break;
        case "s": case "ArrowDown": sDown = true; break;
        case "a": case "ArrowLeft": aDown = true; break;
        case "d": case "ArrowRight": dDown = true; break;
        case "q": case "1": qDown = true; break;
        case "e": case "2": eDown = true; break;
        case "r": case "3": rDown = true; break;
        case "z":
            reset();
            break;
        case "Enter":
            if (screen == "welcome") {
                screen = "game";
                backgroundMusic.currentTime = getRandomInt(10, backgroundMusic.duration);
                backgroundMusic.play();
            }
            else if (screen == "game" && !alive) {
                reset();
            }
            else if (screen == "directions") {
                screen = "welcome";
            }
            break;
    }
    if (["w", "a", "s", "d"].indexOf(e.key) >= 0) {
        lastDir = e.key;
    }
    inputMode = "key";
}
function keyUpHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp": wDown = false; break;
        case "s": case "ArrowDown": sDown = false; break;
        case "a": case "ArrowLeft": aDown = false; break;
        case "d": case "ArrowRight": dDown = false; break;
        case "q": case "1": qDown = false; break;
        case "e": case "2": eDown = false; break;
        case "r": case "3": rDown = false; break;
    }
}
function clickHandler(event) {
    if (screen == "welcome") {
        if (cursorHB.checkCollide(directionsHB)) {
            screen = "directions";
        }
        else {
            screen = "game";
            backgroundMusic.currentTime = getRandomInt(10, backgroundMusic.duration);
            backgroundMusic.play();
        }
    }
    else if (screen == "game" && !alive) {
        reset();
    }
    else if (screen == "directions") {
        screen = "welcome";
    }
}
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = event.clientY - rect.top;
    cursorHB = new HitBox(new Vector(mousePos.x - 3, mousePos.y - 3), 6, 6);
    cursorHB.draw("#ffffff");
    // console.log("move");
}

function mouseDownActions() {
    // cursorHB.draw("#ffffff");
    if (inputMode != "key") {
        wDown = cursorHB.checkCollide(wHB) && mouseDown;
        sDown = cursorHB.checkCollide(sHB) && mouseDown;
        aDown = cursorHB.checkCollide(aHB) && mouseDown;
        dDown = cursorHB.checkCollide(dHB) && mouseDown;
        qDown = cursorHB.checkCollide(qAbility.hb) && mouseDown;
        eDown = cursorHB.checkCollide(eAbility.hb) && mouseDown;
        rDown = cursorHB.checkCollide(rAbility.hb) && mouseDown;
        if (wDown) lastDir = "w";
        if (sDown) lastDir = "s";
        if (aDown) lastDir = "a";
        if (dDown) lastDir = "d";
    }
}

function reset() {
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
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
    txts.push("You are the green, the cars are the red.");
    txts.push("To move, either use 'wasd' or touch the top, bottom, left, and right.")
    txts.push("Don't get hit by cars or go out of bounds sideways.");
    txts.push("Also you can't swim (don't go into the blue water). Cars also can't swim.");
    txts.push("You also have 3 abilities:");
    txts.push("Q which teleports a short distance,");
    txts.push("E which fires a laser that causes a small stun, and");
    txts.push("R which fires a laser in every direction.");
    txts.push("(Abilites can be actived with their respective key, or by tapping the icon in the bottom right.)")
    txts.push("Goal: Go as far up as possible.")
    txts.push("If you die, click the screen to restart");
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
    if (mouseDown) {
        mouseDownActions();
    }
    mouseDownActions();
    player.move();
    player.updateHB();
    player.draw();
    obstacles = [...cars, ...waters];
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();
        if (obstacles[i].hb.checkCollide(player.hb) && alive) {
            stateTxt.innerText = "Status: " + obstacles[i].deathMessage + " (DEAD)";
            stateTxt.style.backgroundColor = obstacles[i].deathColor;
            scoreView.color = obstacles[i].deathColor;
            obstacles[i].deathSound.currentTime = 0;
            obstacles[i].deathSound.play();
            alive = false;
            player.off();
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

    if (wDown || sDown || aDown || dDown) {
        frame++;
    }
    if (frame % 11 == 0 && alive) {
        player.animation++;
        frame++; // so if player stops on a %10, it doesn't freak out
        if (player.animation > 3) player.animation = 0;
    }

    if (backgroundMusic.currentTime > backgroundMusic.duration - 10) {
        backgroundMusic.currentTime = 10;
    }

    wHB.draw("#ffffff");
    sHB.draw("#ffffff");
    aHB.draw("#ffffff");
    dHB.draw("#ffffff");
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
    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 100;
    
    // MARK, makes these like the others
    canvas.onmousedown = function(event) {
        mouseDown = true;
    }
    canvas.onmouseup = function(event) {
        mouseDown = false;
    }

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

var screen = "welcome";

var alive = true;
var score = 0;
var topScore = 0;

var moveWait = 30;
var frame = 0;

var textTimer = 0;
var textWait = 25;
var textActive = false;
var directionsHB;

var lasers = [];

// Set up the canvas, context objects, and html elements
context = setUpContext();
stateTxt = document.getElementById("state");
scoreTxt = document.getElementById("score");

cdBarWidth = 1/6 * canvas.width;

qDelayTxt = document.getElementById("qDelay");
qCD1 = document.getElementById("qCD1");
qCD2 = document.getElementById("qCD2");
var teleportSound = document.getElementById("teleportSound");

eDelayTxt = document.getElementById("eDelay");
eCD1 = document.getElementById("eCD1");
eCD2 = document.getElementById("eCD2");
var laserSound = document.getElementById("laserSound");

rDelayTxt = document.getElementById("rDelay");
rCD1 = document.getElementById("rCD1");
rCD2 = document.getElementById("rCD2");
var multipleLaserSound = document.getElementById("multipleLaserSound");

var laserHitSound = document.getElementById("laserHitSound");

qCD1.style.width = cdBarWidth + "px";
eCD1.style.width = cdBarWidth + "px";
rCD1.style.width = cdBarWidth + "px";

var backgroundMusic = document.getElementById("backgroundMusic");

// player
var texPlayer = new Image();
texPlayer.src = "player-10x11-4x4-1spacing.png";
var posSourceAnimation = [ // [!alive][dir][animationPlayer][x/y]
    [
        [[0, 0], [11, 0], [22, 0], [33, 0]], // down
        [[0, 12], [11, 12], [22, 12], [33, 12]], // up
        [[0, 24], [11, 24], [22, 24], [33, 24]], // right
        [[0, 36], [11, 36], [22, 36], [33, 36]] // left
    ],
    [
        [[0, 48], [11, 48], [22, 48], [33, 48]], // down
        [[0, 60], [11, 60], [22, 60], [33, 60]], // up
        [[0, 72], [11, 72], [22, 72], [33, 72]], // right
        [[0, 84], [11, 84], [22, 84], [33, 84]] // left
    ]
];

carWidth = canvas.width * 1/9;
carHeight = canvas.height * 1/14;
playerLevel = carHeight * 10;
player = new Player(new Vector(canvas.width/2 - carHeight/2, playerLevel), carHeight * 10/11, carHeight, carHeight * 1.5 * canvas.width/900, carHeight * 1.5);

qAbility = new Ability(new Vector(carHeight    , playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "Q");
eAbility = new Ability(new Vector(carHeight * 2, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "E");
rAbility = new Ability(new Vector(carHeight * 3, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 240, 240, "R");

wHB = new HitBox(new Vector(canvas.width * 1/5, 0), canvas.width * 3/5, canvas.height * 1/5);
sHB = new HitBox(new Vector(canvas.width * 1/5, canvas.height * 4/5), canvas.width * 3/5, canvas.height * 1/5);
aHB = new HitBox(new Vector(0, canvas.height * 1/5), canvas.width * 1/5, canvas.height * 3/5);
dHB = new HitBox(new Vector(canvas.width * 4/5, canvas.height * 1/5), canvas.width * 1/5, canvas.height * 3/5);

scoreView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", carHeight, carHeight/3, "Score: 0");

var cars = [];
waterBlockCount = 5;
waters = [];
base = playerLevel - 3 * carHeight;
for (var i = 0; i < 10; i++) {
    startPos = new Vector(getRandomInt(0, canvas.width - carWidth), base - (1.5 * carHeight * i));
    var speed = (getRandomInt(i/6 + 1, i/4 + 2)/900) * canvas.width;
    speed = getRandomInt(1, 3) == 2 ? -speed : speed;
    cars.push(new Car(startPos, speed));
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