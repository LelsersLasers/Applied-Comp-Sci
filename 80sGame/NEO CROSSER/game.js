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
        case "w": case "ArrowUp":
            wDown = true;
            lastDir = "w";
            break;
        case "s": case "ArrowDown":
            if (screen == "welcome") screen = "scores";
            sDown = true;
            lastDir = "s";
            break;
        case "a": case "ArrowLeft":
            aDown = true;
            lastDir = "a";
            break;
        case "d": case "ArrowRight":
            if (screen == "welcome") screen = "directions";
            dDown = true;
            lastDir = "d";
            break;
        case "q": case "1": qDown = true; break;
        case "e": case "2": eDown = true; break;
        case "r": case "3": rDown = true; break;
        case "z":
            reset();
            break;
        case "Enter":
            if (screen == "welcome") {
                screen = "game";
                backgroundMusic.currentTime = getRandomInt(20, backgroundMusic.duration);
                backgroundMusic.play();
                backgroundMusic.playing = true;
            }
            else if (screen == "game" && !alive) {
                reset();
            }
            else if (screen == "game") {
                if (backgroundMusic.playing) {
                    backgroundMusic.pause();
                    backgroundMusic.playing = false;
                }
                else {
                    backgroundMusic.play();
                    backgroundMusic.playing = true;
                }
            }
            else if (screen == "directions" || screen == "scores") {
                screen = "welcome";
            }
            break;
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
        if (cursorHB.checkCollide(welcomeHBs[0])) {
            screen = "directions";
        }
        else if (cursorHB.checkCollide(welcomeHBs[1])) {
            screen = "scores";
        }
        else {
            screen = "game";
            backgroundMusic.currentTime = getRandomInt(20, backgroundMusic.duration);
            backgroundMusic.play();
            backgroundMusic.playing = true;
        }
    }
    else if (screen == "game" && !alive) {
        reset();
    }
    else if (screen == "game") {
        // TODO: there has to be a better line that this...
        if(!wTrigger.checkDown(cursorHB, true) && !sTrigger.checkDown(cursorHB, true) && !aTrigger.checkDown(cursorHB, true) && !dTrigger.checkDown(cursorHB, true) && !qAbility.checkDown(cursorHB, true) && !eAbility.checkDown(cursorHB, mouseDown) && !rAbility.checkDown(cursorHB, mouseDown)) {
            if (backgroundMusic.playing) {
                backgroundMusic.pause();
                backgroundMusic.playing = false;
            }
            else {
                backgroundMusic.play();
                backgroundMusic.playing = true;
            }
        }
    }
    else if (screen == "directions" || screen == "scores") {
        screen = "welcome";
    }
}
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = event.clientY - rect.top;
    cursorHB = new HitBox(new Vector(mousePos.x - 6, mousePos.y - 6), 10, 10);
}

function mouseDownActions() {
    if (inputMode != "key") {
        wDown = wTrigger.checkDown(cursorHB, mouseDown);
        sDown = sTrigger.checkDown(cursorHB, mouseDown);
        aDown = aTrigger.checkDown(cursorHB, mouseDown);
        dDown = dTrigger.checkDown(cursorHB, mouseDown);
        qDown = qAbility.checkDown(cursorHB, mouseDown);
        eDown = eAbility.checkDown(cursorHB, mouseDown);
        rDown = rAbility.checkDown(cursorHB, mouseDown);
        if (wDown) lastDir = "w";
        if (sDown) lastDir = "s";
        if (aDown) lastDir = "a";
        if (dDown) lastDir = "d";
    }
}

function reset() {
    writeScore();
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function writeScore() {
    localStorage.setItem("lastScore", topScore);
    let scores = getTopScores();
    let scoresNew = [];
    let swap = 0;
    for (let i = 0; i < scores.length; i++) {
        scoresNew.push(scores[i - swap]);
        if (topScore > parseInt(scores[i].substring(5)) && swap == 0) { // 3 lettes + ':' + ' ' = 5
            var name = localStorage.getItem("name") != null ? localStorage.getItem("name") : "";
            name = prompt("Congrats on a Top 10 Score! Enter 3 letters for your name on the score board:", name);
            if (name == null) name = "N/A";
            localStorage.setItem("name", name);
            name += "   "; // incase they entered less than 3 characters, backfill with spaces
            swap = 1;
            scoresNew[i] = name.substring(0,3) + ": " + topScore;
        }
    }
    localStorage.setItem("NEO CROSSER - Leader Board", scoresNew);
}

function getTopScores() {
    let scoresTxt = localStorage.getItem("NEO CROSSER - Leader Board");
    let scores = [];
    if (scoresTxt == null) { // no scores variable in localStorage -> fill with blank values
        for (let i = 0; i < 10; i++) scores.push("N/A: -1");
        localStorage.setItem("NEO CROSSER - Leader Board", scores.toString()); // create the variable b/c it doesn't exist
    }
    else scores = scoresTxt.split(",");
    return scores;
}

function drawWelcome() {
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,1)";
    context.font = carHeight + "px " + font;
    context.fillText("NEO CROSSER", canvas.width/2, canvas.height * 1/3);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Start", canvas.width/2, canvas.height * 1/3 + carHeight);

    context.fillStyle = "rgba(255,255,255,1)";
    context.font = carHeight * 5/12 + "px " + font;
    txts = ["[D]irections", "Top [S]cores"];
    for (i = 0; i < txts.length; i++) {
        let width = context.measureText(txts[i]).width;
        let y = canvas.height * 1/3 + carHeight * 4 + i * carHeight * 1.3;
        welcomeHBs.push(new HitBox(new Vector(canvas.width/2 - width/2 - 10, y - carHeight * 1/3 - 10), width + 20, carHeight * 5/12 + 20));
        welcomeHBs[i].draw("#ffffff");
        context.fillText(txts[i], canvas.width/2, y);
    }
}

function drawDirections() {
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,1)";
    context.font = carHeight + "px " + font;
    let base = canvas.height * 1/4;
    context.fillText("Directions", canvas.width/2, base);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width/2, base + carHeight);

    var txts = [];
    txts.push("Use 'wasd' to move. Don't get hit by cars or go out of bounds sideways.");
    txts.push("(You can also touch the w/a/s/d buttons in the bottom right.)")
    txts.push("Don't get hit by cars, buses.");
    txts.push("Also you can't run through the buildings.");
    txts.push("Cars also can't go through the buildings.");
    txts.push("You also have 3 abilities:");
    txts.push("Q which teleports a short distance,");
    txts.push("E which fires a laser that causes a small stun, and");
    txts.push("R which fires a laser in every direction.");
    txts.push("(Abilites can be actived with their respective key,");
    txts.push("or by tapping the icon in the bottom left.)")
    txts.push("Goal: Go as far up as possible.")
    txts.push("If you die, touch the screen to restart.");
    txts.push("(Touch the click the screen to toggle the music while alive.)")

    context.fillStyle = "rgba(255,255,255,1)";
    context.font = carHeight * 5/12 + "px  " + font;
    for (var i = 0; i < txts.length; i++) {
        context.fillText(txts[i], canvas.width/2, base + carHeight + carHeight * 1/2 * (3+i));
    }
}

function drawScores() {
    context.textAlign = "center";
    context.fillStyle = "rgba(255,255,255,1)";
    context.font = carHeight + "px " + font;
    let base = canvas.height * 1/4;
    context.fillText("Top Scores", canvas.width/2, base);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width/2, base + carHeight);
 
    context.font = carHeight * 5/12 + "px " + font;
    let scores = getTopScores();
    let txts = [];
    let maxWidth = 0;
    for (let i = 0; i < scores.length; i++) {
        let line = (i + 1) + ") ";
        if (i < 9) line = " " + line; // adjust for 2 digit nums
        if (parseInt(scores[i].substring(5)) > 0) line += scores[i];
        else line += "N/A: 0" // no player set score
        line = line.toUpperCase();
        let width = context.measureText(line).width;
        if (width > maxWidth) maxWidth = width; // aline by longest line
        txts.push(line);
    }
    context.textAlign = "left";
    for (let i = 0; i < txts.length; i++) {
        if (i == 0)      context.fillStyle = "rgba(255, 215, 0, 1)"; // gold
        else if (i == 1) context.fillStyle = "rgba(192, 192, 192, 1)"; // silver
        else if (i == 2) context.fillStyle = "rgba(205, 127, 50, 1)"; // bronze
        else             context.fillStyle = "rgba(255, 255, 255, 1)"; // white
        context.fillText(txts[i], canvas.width/2 - maxWidth/2, base + carHeight + carHeight * 1/2 * (3+i));
    }
}

function drawGame() {
    for (var i = 0; i < bar.length; i++) bar[i].draw();
    mouseDownActions();
    player.move();
    player.draw();
    for (var i = 0; i < buildings.length; i++) buildings[i].draw();
    enemies = [...cars, ...ufos];
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        // enemies[i].hb.draw("#ffffff");
        if (enemies[i].hb.checkCollide(player.hb) && alive) {
            scoreView.color = "#e37e7b";
            enemies[i].deathSound.play();
            alive = false;
            player.off();
        }
    }
    for (var i = 0; i < lasers.length; i++) lasers[i].update();

    wTrigger.draw(wDown);
    sTrigger.draw(sDown);
    aTrigger.draw(aDown);
    dTrigger.draw(dDown);
    qAbility.draw();
    eAbility.draw();
    rAbility.draw();

    scoreView.setTxt("Score: " + topScore);
    scoreView.draw();

    if (backgroundMusic.currentTime > backgroundMusic.duration - 20) backgroundMusic.currentTime = 20;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (screen == "welcome") drawWelcome();
    else if (screen == "game") drawGame();
    else if (screen == "directions") drawDirections();
    else if (screen == "scores") drawScores();

    if (textOpacity > 1) opacityDir = -0.04;
    else if (textOpacity < 0) opacityDir = 0.04;
    textOpacity += opacityDir;

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

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

// localStorage.removeItem("NEO CROSSER - Leader Board"); // reset leard board

var font = "monospace";

var screen = "welcome";

var alive = true;
var score = 0;
var topScore = 0;

const moveWait = 30;

var textOpacity = 1;
var opacityDir = -0.04;
var welcomeHBs = [];

const soundOffset = 10.0;
// Set up the canvas, context objects, and html elements
var context = setUpContext();

var qSound = document.createElement("audio");
qSound.src = "qSound.mp3";
qSound.volume = 1.0/soundOffset;
var eSound = document.createElement("audio");
eSound.src = "eSound.mp3"; // x2
eSound.volume = 3.5/soundOffset;
var rSound = document.createElement("audio");
rSound.src = "rSound.mp3";
rSound.volume = 1.0/soundOffset;

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "backgroundMusic.mp3";
backgroundMusic.playing = false;
backgroundMusic.volume = 0.9/soundOffset;

var texPlayer = new Image();
texPlayer.src = "player-10x11-4x8-1spacing.png";
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

var texCar = new Image();
texCar.src = "car-34x17-2x4-1spacing.png";
var posSourceCar = [ // [active][dir][animation][x/y]
    [ // if active
        [ // if dir == right
            [0, 0], // animation 1
            [35, 0] // animation 2
        ],
        [ // if dir == left
            [0, 18], // animation 1
            [35, 18] // animation 2
        ]
    ],
    [ // if not active
        [ // if dir == right
            [0, 36], // animation 1
            [35, 36] // animation 2
        ],
        [ // if dir == left
            [0, 54], // animation 1
            [35, 54] // animation 2
        ]
    ],
];

var texBus = new Image();
texBus.src = "bus-35x17-2x4-1spacing.png";
var posSourceBus = [ // [active][dir][animation][x/y]
    [ // if active
        [ // if dir == right
            [0, 0], // animation 1
            [36, 0] // animation 2
        ],
        [ // if dir == left
            [0, 18], // animation 1
            [36, 18] // animation 2
        ]
    ],
    [ // if not active
        [ // if dir == right
            [0, 36], // animation 1
            [36, 36] // animation 2
        ],
        [ // if dir == left
            [0, 54], // animation 1
            [36, 54] // animation 2
        ]
    ],
];

var texUfo = new Image();
texUfo.src = "ufo-20x19-2x2-1spacing.png";
var posSourceUfo = [
    [
        [0, 0],
        [21, 0]
    ],
    [
        [0, 20],
        [21, 20]
    ]
];

var texBar = new Image();
texBar.src = "arrow-14x11-1x2-1spacing.png";
var posSourceBar = [
    [0, 0], // purple
    [0, 12], // yellow
];

var texBuilding = new Image();
texBuilding.src = "building-26x40-3x1-1spacing.png";
var posSourceBuilding = [
    [0, 0],
    [27, 0],
    [54, 0]
];

const carWidth = canvas.width * 1/9;
const carHeight = canvas.height * 1/14;

const ufoWidth = canvas.width * 1/8;
const ufoHeight = canvas.height * 1/8 * 7/9;

const playerLevel = carHeight * 10;
var player = new Player(new Vector(canvas.width/2 - carHeight/2, playerLevel), carHeight * 10/11, carHeight, canvas.width/14, 1.5 * canvas.height/14);

var qAbility = new Ability(new Vector(carHeight    , playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "Q", qSound);
var eAbility = new Ability(new Vector(carHeight * 2, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "E", eSound);
var rAbility = new Ability(new Vector(carHeight * 3, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 240, 240, "R", rSound);

var wTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7/4), playerLevel + carHeight * 5/4), carHeight * 3/4, carHeight * 3/4, "W");
var sTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7/4), playerLevel + carHeight * 11/4), carHeight * 3/4, carHeight * 3/4, "S");
var aTrigger = new Trigger(new Vector(canvas.width - (carHeight * 10/4), playerLevel + carHeight * 2), carHeight * 3/4, carHeight * 3/4, "A");
var dTrigger = new Trigger(new Vector(canvas.width - carHeight, playerLevel + carHeight * 2), carHeight * 3/4, carHeight * 3/4, "D");

var scoreView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", carHeight, carHeight/3, "Score: 0");

var ufos = [];
var cars = [];
var buildings = [];
var lasers = [];
var bar = [];

const base = playerLevel - 3 * carHeight;
var justPlaced = true; // true to skip placing one in the first row
const buildingBlockCount = 5;
for (var i = 0; i < 10; i++) {
    let startPosY = base - (1.5 * carHeight * i);
    let speed = (getRandomInt(i/6 + 1, i/4 + 2)/900) * canvas.width * 2/3;
    speed = getRandomInt(1, 3) == 2 ? -speed : speed;
    cars.push(new Car(startPosY, speed));
    if (Math.random() < buildingBlockCount/10 && !justPlaced) {
        buildings.push(new Building(startPosY));
        justPlaced = true;
    }
    else justPlaced = false;
}

// to make it look like player is moving
const barWidth = 3/4 * carHeight;
const barHeight = (barWidth * 11) / 14; // (33/56) * carHeight
for (i = 0; i < canvas.height/barHeight; i++) {
    bar.push(new Block(new Vector(0, i * barHeight), i, barWidth, barHeight));
    bar.push(new Block(new Vector(canvas.width - barWidth, i * barHeight), i, barWidth, barHeight));
}


// Fire up the animation engine
window.requestAnimationFrame(drawAll);