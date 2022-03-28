var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var qDown = false;
var eDown = false;
var rDown = false;
var mouseDown = false;
var cursorHB = new HitBox(new Vector(-100, -100), 10, 10);
document.addEventListener("keydown", keyDownHandle, false);
document.addEventListener("keyup", keyUpHandle, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", getMousePos, false);
function keyDownHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            if (gameScreen == "restore") {
                selectedIndex -= 1;
                deleteCount = 0;
            }
            wDown = true;
            break;
        case "s":
        case "arrowdown":
            if (gameScreen == "welcome")
                gameScreen = "scores";
            else if (gameScreen == "restore") {
                selectedIndex += 1;
                deleteCount = 0;
            }
            else if (paused) {
                save();
                saveButton.clicked = 10;
            }
            sDown = true;
            break;
        case "a":
        case "arrowleft":
            aDown = true;
            break;
        case "d":
        case "arrowright":
            if (gameScreen == "welcome")
                gameScreen = "directions";
            dDown = true;
            break;
        case "q":
        case "1":
            if (paused)
                reset();
            qDown = true;
            break;
        case "e":
        case "2":
            eDown = true;
            break;
        case "r":
        case "3":
            if (paused) {
                paused = false;
                sDown = false;
            }
            rDown = true;
            break;
        case "z":
        case "escape":
            if (gameScreen == "game")
                paused = !paused;
            break;
        case "p":
            if (gameScreen == "play")
                gameScreen = "restore";
            break;
        case "m":
            if (paused)
                musicToggle();
            break;
        case "g":
            if (gameScreen == "play") {
                gameScreen = "game";
                musicStart();
            }
            break;
        case "x":
            if (gameScreen == "restore") {
                var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                if (games.length > 0)
                    games.splice(selectedIndex, 1);
                localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
            }
            break;
        case "y":
            if (gameScreen == "restore")
                gameScreen = "play";
            break;
        case "enter":
            if (gameScreen == "welcome")
                gameScreen = "play";
            else if (gameScreen == "play")
                gameScreen = "welcome";
            else if (gameScreen == "restore") {
                var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                if (games.length > 0) {
                    restore(games[selectedIndex]);
                    gameScreen = "game";
                }
            }
            else if (gameScreen == "game" && !alive)
                reset();
            else if (gameScreen == "directions" || gameScreen == "scores") {
                gameScreen = "welcome";
                localStorage.setItem("firstBoot", "true");
            }
            break;
    }
}
function keyUpHandle(e) {
    switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
            wDown = false;
            break;
        case "s":
        case "arrowdown":
            sDown = false;
            break;
        case "a":
        case "arrowleft":
            aDown = false;
            break;
        case "d":
        case "arrowright":
            dDown = false;
            break;
        case "q":
        case "1":
            qDown = false;
            break;
        case "e":
        case "2":
            eDown = false;
            break;
        case "r":
        case "3":
            rDown = false;
            break;
    }
}
function clickHandler(event) {
    if (gameScreen == "welcome") {
        if (cursorHB.checkCollide(directionsButton.hb)) {
            gameScreen = "directions";
        }
        else if (cursorHB.checkCollide(scoresButton.hb)) {
            gameScreen = "scores";
        }
        else {
            gameScreen = "play";
        }
    }
    else if (gameScreen == "play") {
        if (cursorHB.checkCollide(previousGameButton.hb)) {
            gameScreen = "restore";
        }
        else if (cursorHB.checkCollide(newGameButton.hb)) {
            gameScreen = "game";
            musicStart();
        }
        else
            gameScreen = "welcome";
    }
    else if (gameScreen == "restore") {
        var buttonHit = false;
        for (var i = 0; i < restoreButtons.length; i++) {
            if (cursorHB.checkCollide(restoreButtons[i].hb)) {
                if (i == selectedIndex) {
                    var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                    restore(games[selectedIndex]);
                    gameScreen = "game";
                }
                selectedIndex = i;
                deleteCount = 0;
                buttonHit = true;
            }
        }
        if (!buttonHit)
            gameScreen = "play";
    }
    else if (gameScreen == "game" && !alive) {
        reset();
    }
    else if (gameScreen == "game") {
        if (cursorHB.checkCollide(pauseButton.hb))
            paused = !paused;
        else if (paused) {
            if (cursorHB.checkCollide(resumeButton.hb)) {
                paused = false;
                sDown = false;
            }
            else if (cursorHB.checkCollide(saveButton.hb)) {
                save();
                saveButton.clicked = 10;
            }
            else if (cursorHB.checkCollide(quitButton.hb)) {
                reset();
            }
            else if (cursorHB.checkCollide(musicButton.hb)) {
                musicToggle();
            }
        }
    }
    else if (gameScreen == "directions" || gameScreen == "scores") {
        gameScreen = "welcome";
        localStorage.setItem("firstBoot", "true");
    }
}
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    cursorHB.pt.x = event.clientX - rect.left - 6;
    cursorHB.pt.y = event.clientY - rect.top - 6;
}
function mouseDownActions() {
    if (gameScreen == "restore") {
        for (var i = 0; i < restoreButtons.length; i++) {
            if (cursorHB.checkCollide(restoreButtons[i].hb) && i == selectedIndex) {
                deleteCount += delta;
                if (deleteCount > 60) {
                    var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                    games.splice(selectedIndex, 1);
                    localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
                    deleteCount = 0;
                }
            }
        }
    }
}
function reset() {
    writeScore();
    location.reload(); // reloads the webpage
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function average(lst) {
    if (lst.length == 0)
        return 1;
    var sum = 0;
    for (var i in lst)
        sum += lst[i];
    return sum / lst.length;
}
function musicStart() {
    backgroundMusic.currentTime = getRandomInt(100, backgroundMusic.duration);
    if (musicShouldPlay === "true") {
        backgroundMusic.play();
        backgroundMusicPlaying = true;
    }
}
function musicToggle() {
    if (backgroundMusicPlaying) {
        backgroundMusic.pause();
        backgroundMusicPlaying = false;
    }
    else {
        backgroundMusic.play();
        backgroundMusicPlaying = true;
    }
    musicButton.clicked = 10;
    localStorage.setItem("playMusic", JSON.stringify(backgroundMusicPlaying));
}
function getName(message) {
    var name = localStorage.getItem("name") != null ? localStorage.getItem("name") : "";
    name = prompt(message, name);
    if (name == null)
        name = "N/A";
    localStorage.setItem("name", name);
    name += "   "; // incase they entered less than 3 characters, backfill with spaces
    name = name.substring(0, 3).toUpperCase();
    return name;
}
function writeScore() {
    var scores = getTopScores();
    var scoresNew = [];
    var swap = 0;
    for (var i = 0; i < scores.length; i++) {
        scoresNew.push(scores[i - swap]);
        if (topScore > parseInt(scores[i].substring(5)) && swap == 0) { // 3 lettes + ':' + ' ' = 5
            var name_1 = getName("Congrats on a Top 10 Score! (Rank " + (i + 1) + "!) Enter 3 letters for your name on the score board:");
            swap = 1;
            scoresNew[i] = name_1 + ": " + topScore;
        }
    }
    localStorage.setItem("NEO CROSSER - Leader Board", JSON.stringify(scoresNew));
}
function getTopScores() {
    var scores = JSON.parse(localStorage.getItem("NEO CROSSER - Leader Board"));
    if (scores == null) { // no scores variable in localStorage -> fill with blank values
        scores = [];
        for (var i = 0; i < 10; i++)
            scores.push("N/A: -1");
        localStorage.setItem("NEO CROSSER - Leader Board", JSON.stringify(scores)); // create the variable b/c it doesn't exist
    }
    return scores;
}
function getFontHeight(w, letters) {
    context.font = 1 + "px " + font;
    var ratio = 1 / context.measureText("a").width;
    return w / letters * ratio;
}
function save() {
    var date = new Date();
    var name = getName("Enter 3 letters for your name to save:");
    name += ": " + topScore + " " + date.getHours() + ":" + date.getMinutes() + "-" + (date.getMonth() + 1) + "/" + date.getDate();
    var gameSave = {
        "name": name,
        "player": player,
        "cars": cars,
        "buildings": buildings,
        "lasers": lasers,
        "bar": bar,
        "ufos": ufos,
        "landSlides": landSlides,
        "pickUps": pickUps,
        "score": score,
        "topScore": topScore,
        "qAbility": qAbility,
        "eAbility": eAbility,
        "rAbility": rAbility,
        "alive": alive,
        "lives": lives,
        "justPlaced": justPlaced,
        "landSlideWait": landSlideWait
    };
    var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    games.push(gameSave);
    localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
}
function restore(savedGame) {
    player.restore(savedGame.player);
    cars = [];
    for (var i = 0; i < savedGame.cars.length; i++) {
        cars.push(new Car(-1, -1, -1));
        cars[i].restore(savedGame.cars[i]);
    }
    buildings = [];
    for (var i = 0; i < savedGame.buildings.length; i++) {
        buildings.push(new Building(-1));
        buildings[i].restore(savedGame.buildings[i]);
    }
    justPlaced = savedGame.justPlaced;
    lasers = [];
    for (var i = 0; i < savedGame.lasers.length; i++) {
        lasers.push(new Laser(new Vector(-1, -1), -1, -1, true));
        lasers[i].restore(savedGame.lasers[i]);
    }
    bar = [];
    for (var i = 0; i < savedGame.bar.length; i++) {
        bar.push(new Block(new Vector(-1, -1), -1, -1, -1));
        bar[i].restore(savedGame.bar[i]);
    }
    ufos = [];
    for (var i = 0; i < savedGame.ufos.length; i++) {
        ufos.push(new Ufo(-1));
        ufos[i].restore(savedGame.ufos[i]);
    }
    landSlides = [];
    for (var i = 0; i < savedGame.landSlides.length; i++) {
        landSlides.push(new LandSlide(-1));
        landSlides[i].restore(savedGame.landSlides[i]);
    }
    landSlideWait = savedGame.landSlideWait;
    pickUps = [];
    for (var i = 0; i < savedGame.pickUps.length; i++) {
        pickUps.push(new PickUp(-1, new Image(), -1, -1, function () { }));
        pickUps[i].restore(savedGame.pickUps[i]);
    }
    qAbility.restore(savedGame.qAbility);
    eAbility.restore(savedGame.eAbility);
    rAbility.restore(savedGame.rAbility);
    score = savedGame.score;
    topScore = savedGame.topScore;
    alive = savedGame.alive;
    lives = savedGame.lives;
    paused = true;
}
function buttonHover() {
    if (gameScreen == "welcome") {
        if (cursorHB.checkCollide(directionsButton.hb))
            directionsButton.clicked = 1;
        else if (cursorHB.checkCollide(scoresButton.hb))
            scoresButton.clicked = 1;
    }
    else if (gameScreen == "play") {
        if (cursorHB.checkCollide(previousGameButton.hb))
            previousGameButton.clicked = 1;
        else if (cursorHB.checkCollide(newGameButton.hb))
            newGameButton.clicked = 1;
    }
    else if (paused) {
        if (cursorHB.checkCollide(resumeButton.hb))
            resumeButton.clicked = 1;
        else if (cursorHB.checkCollide(saveButton.hb))
            saveButton.clicked = 1;
        else if (cursorHB.checkCollide(quitButton.hb))
            quitButton.clicked = 1;
        else if (cursorHB.checkCollide(musicButton.hb))
            musicButton.clicked = 1;
    }
}
function setDelta() {
    t1 = performance.now();
    var lastDelta = (t1 - t0) / (1000 / 60);
    if (frame > 20 && lastDelta < 2 * average(deltas))
        deltas.push(lastDelta); // protect against alt-tab
    delta = average(deltas);
    t0 = performance.now();
    frame++;
}
function drawWelcome() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    context.fillText("NEO CROSSER", canvas.width / 2, canvas.height * 1 / 3);
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight / 2 + "px " + font;
    context.fillText("Touch to Start", canvas.width / 2, canvas.height * 1 / 3 + carHeight);
    directionsButton.draw();
    scoresButton.draw();
}
function drawPlayMenu() {
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight / 2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width / 2, canvas.height * 1 / 4 + carHeight);
    previousGameButton.draw();
    newGameButton.draw();
}
function drawRestoreMenu() {
    var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    restoreButtons = [];
    if (selectedIndex > games.length - 1) {
        selectedIndex = games.length - 1;
        deleteCount = 0;
    }
    else if (selectedIndex < 0) {
        selectedIndex = 0;
        deleteCount = 0;
    }
    for (var i = 0; i < games.length; i++) {
        var y = canvas.height / 2 - (carHeight * 3 / 4 + 20) * 1 / 2 - 10 + (i - selectedIndex) * (carHeight * 3 / 4 + 40);
        var button = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, y), pauseWidth, carHeight * 3 / 4 + 20, games[i].name, carHeight * 1 / 2);
        restoreButtons.push(button);
        if (i == selectedIndex) {
            restoreButtons[i].clicked = 1;
        }
        restoreButtons[i].draw();
    }
    context.font = carHeight * 3 / 4 + "px " + font;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height * 1 / 4 - carHeight / 4);
    context.fillStyle = "#ffffff";
    context.fillText("Press X to Delete, Enter to Resume", canvas.width / 2, canvas.height * 1 / 4 - carHeight * 1.8);
    context.font = carHeight / 2 + "px " + font;
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.fillText("Touch to Go Back (or Y)", canvas.width / 2, canvas.height * 1 / 4 - carHeight);
    if (mouseDown)
        mouseDownActions();
}
function drawDirections() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    var base = canvas.height * 1 / 4;
    context.fillText("Directions", canvas.width / 2, base);
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight / 2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width / 2, base + carHeight);
    var txts = [];
    txts.push("Use 'wasd' to move. Don't get hit by cars.");
    txts.push("(You can also touch the w/a/s/d buttons in the bottom right.)");
    txts.push("Also you can't run through the buildings.");
    txts.push("Cars also can't go through the buildings.");
    txts.push("You also have 3 abilities:");
    txts.push("Q which teleports a short distance,");
    txts.push("E which increases your speed (press again to turn off), and");
    txts.push("R which fires a laser in every direction.");
    txts.push("(Abilites can be actived with their respective key,");
    txts.push("or by tapping the icon in the bottom left.)");
    txts.push("Goal: Go as far up as possible.");
    txts.push("Touch button in top right (or press Esc) to show the pause menu.");
    txts.push("From the pause menu you can toggle the music, save, or quit.");
    context.fillStyle = "#ffffff";
    context.font = carHeight * 5 / 12 + "px  " + font;
    for (var i = 0; i < txts.length; i++)
        context.fillText(txts[i], canvas.width / 2, base + carHeight + carHeight * 1 / 2 * (3 + i));
}
function drawScores() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    var base = canvas.height * 1 / 4;
    context.fillText("Top Scores", canvas.width / 2, base);
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight / 2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width / 2, base + carHeight);
    context.font = carHeight * 5 / 12 + "px " + font;
    var scores = getTopScores();
    var txts = [];
    var maxWidth = 0;
    for (var i = 0; i < scores.length; i++) {
        var line = (i + 1) + ") ";
        if (i < 9)
            line = " " + line; // adjust for 2 digit nums
        if (parseInt(scores[i].substring(5)) > 0)
            line += scores[i];
        else
            line += "N/A: 0"; // no player set
        var width = context.measureText(line).width;
        if (width > maxWidth)
            maxWidth = width; // aline by longest line
        txts.push(line);
    }
    context.textAlign = "left";
    for (var i = 0; i < txts.length; i++) {
        if (i == 0)
            context.fillStyle = "rgba(255, 215, 0, 1)"; // gold
        else if (i == 1)
            context.fillStyle = "rgba(192, 192, 192, 1)"; // silver
        else if (i == 2)
            context.fillStyle = "rgba(205, 127, 50, 1)"; // bronze
        else
            context.fillStyle = "rgba(255, 255, 255, " + (1 - i / 10 + 0.2) + ")"; // white
        context.fillText(txts[i], canvas.width / 2 - maxWidth / 2, base + carHeight + carHeight * 1 / 2 * (3 + i));
    }
    context.textAlign = "center";
}
function drawGameOver() {
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = "bottom";
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight / 2 + "px " + font;
    context.fillText("Touch to Exit", canvas.width / 2, canvas.height / 2 + carHeight);
    context.textBaseline = "middle";
}
function drawHUDDirections() {
    var h = getFontHeight(carHeight * 2.75, 11);
    context.font = h + "px " + font;
    context.fillStyle = "rgba(255,255,255," + directionsOpacity + ")";
    context.textAlign = "left";
    var txts = ["Q: Teleport", "E: Sprint", "R: Lasers"];
    for (var i = 0; i < txts.reverse().length; i++) {
        context.fillText(txts[i], carHeight, playerLevel + carHeight * 2.2 - i * h * 1.1);
    }
    context.textAlign = "center";
    if (!paused)
        directionsOpacity -= delta / 130;
}
function drawPauseMenu() {
    player.draw();
    var obstacles = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], pickUps, true), landSlides, true), cars, true), ufos, true), buildings, true), lasers, true);
    for (var i in obstacles)
        obstacles[i].draw();
    drawHUD();
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    resumeButton.draw();
    saveButton.draw();
    quitButton.draw();
    musicButton.draw();
}
function drawBuffs(stacks, ability, tex, srcX, srcY) {
    stacks = stacks.toFixed(0);
    if (stacks >= 0) {
        var pc = new PickUp(ability.pt.y - carHeight * 4 / 5, tex, srcX, srcY, function () { });
        pc.pt.x = ability.pt.x + carHeight * 1 / 20;
        pc.draw();
        context.fillStyle = "#ffffff";
        context.font = pc.h * 2 / 3 + "px " + font;
        context.fillText(stacks, pc.pt.x + pc.w, pc.pt.y + pc.h);
    }
}
function drawHUD() {
    wTrigger.draw(wDown);
    sTrigger.draw(sDown);
    aTrigger.draw(aDown);
    dTrigger.draw(dDown);
    qAbility.draw();
    eAbility.draw();
    rAbility.draw();
    if (directionsOpacity <= 0) {
        drawBuffs((qAbility.recharge - 1) * 20, qAbility, texCooldownPickUp, 9, 12);
        drawBuffs(player.msX / player.msXIncrease - 20, eAbility, texSpeedPickUp, 16, 27);
    }
    livesView.setTxt("Lives: " + lives);
    livesView.draw();
    scoreView.pt.x = livesView.pt.x + livesView.w * 1.08;
    scoreView.setTxt("Score: " + topScore);
    scoreView.draw();
    pauseButton.draw();
    if (directionsOpacity > 0)
        drawHUDDirections();
}
function drawGame() {
    for (var i in bar)
        bar[i].draw();
    if (!paused) {
        for (var i in landSlides)
            landSlides[i].update();
        for (var i in pickUps)
            pickUps[i].update();
        player.setLastDir();
        player.move();
        player.draw();
        console.log(sDown, player.lastDir);
        for (var i in buildings)
            buildings[i].draw();
        var enemies = __spreadArray(__spreadArray([], cars, true), ufos, true);
        for (var i in enemies) {
            enemies[i].update();
            enemies[i].draw();
            if (alive)
                player.checkHit(enemies[i]);
        }
        for (var i in lasers)
            lasers[i].update();
        for (var i in notices)
            notices[i].draw();
        drawHUD();
        if (!alive)
            drawGameOver();
    }
    else
        drawPauseMenu();
    if (backgroundMusic.currentTime < 100)
        backgroundMusic.currentTime = 100;
}
function drawAll() {
    buttonHover();
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (gameScreen == "welcome")
        drawWelcome();
    else if (gameScreen == "play")
        drawPlayMenu();
    else if (gameScreen == "restore") {
        mouseDownActions();
        drawRestoreMenu();
    }
    else if (gameScreen == "game")
        drawGame();
    else if (gameScreen == "directions")
        drawDirections();
    else if (gameScreen == "scores")
        drawScores();
    textOpacity += opacityDir * delta;
    if (textOpacity > 1 || textOpacity < 0)
        opacityDir *= -1;
    setDelta();
    window.requestAnimationFrame(drawAll);
}
function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    canvas.onmousedown = function () { return mouseDown = true; };
    canvas.onmouseup = function () { return mouseDown = false; };
    // Set up the context for the animation
    context = canvas.getContext("2d");
    // disable anti-alising to make my pixel art look 'crisp'
    context.imageSmoothingEnabled = false; // standard
    context.mozImageSmoothingEnabled = false; // Firefox
    context.oImageSmoothingEnabled = false; // Opera
    context.webkitImageSmoothingEnabled = false; // Safari
    context.msImageSmoothingEnabled = false; // IE
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 3;
    return context;
}
// localStorage.removeItem("NEO CROSSER - Leader Board"); // reset leard board
var t0 = performance.now();
var t1 = performance.now();
var delta = 1; // delta is relative to 60fps
var frame = 0;
var deltas = [];
var softCap = 10000;
var buildingBlockCount = 5;
var landSlideWait = 10;
var font = "monospace";
var gameScreen = localStorage.getItem("firstBoot") == null ? "directions" : "welcome";
var paused = false;
var alive = true;
var score = 0;
var topScore = 0;
var lives = 3;
var spawnLife = softCap / 3;
var moveWait = 30;
var textOpacity = 1;
var opacityDir = -0.035;
var directionsOpacity = 1.2;
var soundOffset = 10.0;
// Set up the canvas, context objects, and html elements
var canvas;
var context = setUpContext();
var qSound = document.createElement("audio");
qSound.src = "qSound.mp3";
qSound.volume = 1.0 / soundOffset;
var eSound = document.createElement("audio");
eSound.src = "eSound.mp3"; // x2
eSound.volume = 3.5 / soundOffset;
var rSound = document.createElement("audio");
rSound.src = "rSound.mp3";
rSound.volume = 1.0 / soundOffset;
var laserSounds = [];
for (var i = 0; i < 10; i++) {
    laserSounds.push(document.createElement("audio"));
    laserSounds[i].src = "laserHitSound.mp3";
    laserSounds[i].volume = 0.8 / soundOffset;
}
var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "backgroundMusic.mp3";
var backgroundMusicPlaying = false;
backgroundMusic.loop = true;
backgroundMusic.volume = 0.9 / soundOffset;
var musicShouldPlay = localStorage.getItem("playMusic") != null ? localStorage.getItem("playMusic") : "true";
var texPlayer = new Image();
texPlayer.src = "player-10x11-8x8-1spacing.png";
var posSourcePlayer = [
    [
        [
            [[0, 0], [11, 0], [22, 0], [33, 0]],
            [[0, 12], [11, 12], [22, 12], [33, 12]],
            [[0, 24], [11, 24], [22, 24], [33, 24]],
            [[0, 36], [11, 36], [22, 36], [33, 36]] // left
        ],
        [
            [[44, 0], [55, 0], [66, 0], [77, 0]],
            [[44, 12], [55, 12], [66, 12], [77, 12]],
            [[44, 24], [55, 24], [66, 24], [77, 24]],
            [[44, 36], [55, 36], [66, 36], [77, 36]] // left
        ]
    ],
    [
        [
            [[0, 48], [11, 48], [22, 48], [33, 48]],
            [[0, 60], [11, 60], [22, 60], [33, 60]],
            [[0, 72], [11, 72], [22, 72], [33, 72]],
            [[0, 84], [11, 84], [22, 84], [33, 84]] // left
        ],
        [
            [[44, 48], [55, 48], [66, 48], [77, 48]],
            [[44, 60], [55, 60], [66, 60], [77, 60]],
            [[44, 72], [55, 72], [66, 72], [77, 72]],
            [[44, 84], [55, 84], [66, 84], [77, 84]] // left
        ]
    ]
];
var texCar = new Image();
texCar.src = "car-34x17-2x4-1spacing.png";
var posSourceCar = [
    [
        [
            [0, 0],
            [35, 0] // animation 2
        ],
        [
            [0, 18],
            [35, 18] // animation 2
        ]
    ],
    [
        [
            [0, 36],
            [35, 36] // animation 2
        ],
        [
            [0, 54],
            [35, 54] // animation 2
        ]
    ],
];
var texBus = new Image();
texBus.src = "bus-40x17-2x4-1spacing.png";
var posSourceBus = [
    [
        [
            [0, 0],
            [41, 0] // animation 2
        ],
        [
            [0, 18],
            [41, 18] // animation 2
        ]
    ],
    [
        [
            [0, 36],
            [41, 36] // animation 2
        ],
        [
            [0, 54],
            [41, 54] // animation 2
        ]
    ],
];
var texTank = new Image();
texTank.src = "tank-33x16-2x4-1spacing.png";
var posSourceTank = [
    [
        [
            [0, 0],
            [34, 0]
        ],
        [
            [0, 17],
            [34, 17]
        ]
    ],
    [
        [
            [0, 34],
            [34, 34]
        ],
        [
            [0, 51],
            [34, 51]
        ]
    ]
];
var texUfo = new Image();
texUfo.src = "ufo-20x19-4x2-1spacing.png";
var posSourceUfo = [
    [
        [
            [0, 0],
            [21, 0]
        ],
        [
            [42, 0],
            [63, 0]
        ],
    ],
    [
        [
            [0, 20],
            [21, 20]
        ],
        [
            [42, 20],
            [63, 20]
        ]
    ]
];
var texBar = new Image();
texBar.src = "arrow-14x11-1x2-1spacing.png";
var posSourceBar = [
    [0, 0],
    [0, 12], // yellow
];
var texBuilding = new Image();
texBuilding.src = "building-26x40-3x1-1spacing.png";
var posSourceBuilding = [
    [0, 0],
    [27, 0],
    [54, 0]
];
var texLandSlide = new Image();
texLandSlide.src = "landSlide-82x41-1x4-1spacing.png";
var posSourceLandSlide = [
    [
        [0, 0],
        [0, 41]
    ],
    [
        [0, 82],
        [0, 123]
    ]
];
var texPause = new Image();
texPause.src = "pause-14x14-2x1-1spacing.png";
var posSourcePause = [
    [0, 0],
    [15, 0]
];
var texLifePickUp = new Image();
texLifePickUp.src = "lifePickUp-11x10.png";
var texCooldownPickUp = new Image();
texCooldownPickUp.src = "cooldownPickUp-9x12.png";
var texSpeedPickUp = new Image();
texSpeedPickUp.src = "speedPickUp-16x27.png";
var texWarning = new Image();
texWarning.src = "landSlideWarning-20x19-1x1.png";
var carWidth = canvas.width * 1 / 9;
var carHeight = canvas.height * 1 / 14;
var ufoWidth = canvas.width * 1 / 8;
var ufoHeight = canvas.height * 1 / 8 * 7 / 9;
var laserSpeed = Math.sqrt((canvas.width * canvas.width + canvas.height * canvas.height) / 52000);
var spacer = canvas.height * 1 / 70;
var playerLevel = carHeight * 10;
var player = new Player();
var qAbility = new Ability(new Vector(carHeight, playerLevel + carHeight * 2.5), carHeight * 3 / 4, carHeight * 3 / 4, 120, "Q", qSound);
var eAbility = new Buff(new Vector(carHeight * 2, playerLevel + carHeight * 2.5), carHeight * 3 / 4, carHeight * 3 / 4, 360, 3, "E", eSound);
var rAbility = new Ability(new Vector(carHeight * 3, playerLevel + carHeight * 2.5), carHeight * 3 / 4, carHeight * 3 / 4, 240, "R", rSound);
var wTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7 / 4), playerLevel + carHeight * 5 / 4), carHeight * 3 / 4, carHeight * 3 / 4, "W");
var sTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7 / 4), playerLevel + carHeight * 11 / 4), carHeight * 3 / 4, carHeight * 3 / 4, "S");
var aTrigger = new Trigger(new Vector(canvas.width - (carHeight * 10 / 4), playerLevel + carHeight * 2), carHeight * 3 / 4, carHeight * 3 / 4, "A");
var dTrigger = new Trigger(new Vector(canvas.width - carHeight, playerLevel + carHeight * 2), carHeight * 3 / 4, carHeight * 3 / 4, "D");
var scoreView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", -1, carHeight / 3, "");
var livesView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", -1, carHeight / 3, "");
context.font = carHeight * 1 / 2 + "px " + font;
var pauseWidth = 0;
var txts = ["[R]esume", "[S]ave", "[Q]uit Without Saving", "Toggle [M]usic", "Resume [P]revious Game", "New [G]ame"];
for (var i in txts) {
    if (context.measureText(txts[i]).width > pauseWidth) {
        pauseWidth = context.measureText(txts[i]).width;
    }
}
pauseWidth += 40;
var resumeButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 - (carHeight * 3 / 4 + spacer * 2) * 3 / 2 - spacer * 3), pauseWidth, carHeight * 3 / 4 + spacer * 2, "Resume", carHeight * 1 / 2);
var saveButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 - (carHeight * 3 / 4 + spacer * 2) / 2 - spacer), pauseWidth, carHeight * 3 / 4 + spacer * 2, "[S]ave", carHeight * 1 / 2);
var quitButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 + (carHeight * 3 / 4 + spacer * 2) / 2 + spacer), pauseWidth, carHeight * 3 / 4 + spacer * 2, "[Q]uit Without Saving", carHeight * 1 / 2);
var musicButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 + (carHeight * 3 / 4 + spacer * 2) * 3 / 2 + spacer * 3), pauseWidth, carHeight * 3 / 4 + spacer * 2, "Toggle [M]usic", carHeight * 1 / 2);
var previousGameButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 - (carHeight * 3 / 4 + 20) / 2 - spacer), pauseWidth, carHeight * 3 / 4 + spacer * 2, "Resume [P]revious Game", carHeight * 1 / 2);
var newGameButton = new ButtonMenu(new Vector(canvas.width / 2 - pauseWidth / 2, canvas.height / 2 + (carHeight * 3 / 4 + 20) / 2 + spacer), pauseWidth, carHeight * 3 / 4 + spacer * 2, "New [G]ame", carHeight * 1 / 2);
var restoreButtons = [];
var deleteCount = 0;
{ // so games ('let') stops in here
    var games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    if (games == null) {
        games = [];
        localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
    }
    var selectedIndex = games.length > 3 ? 2 : games.length;
}
context.font = carHeight * 5 / 12 + "px " + font;
var menuWidth = context.measureText("[D]irections").width; // both txts have the same number of characters (by pure chance)
var directionsButton = new ButtonMenu(new Vector(canvas.width / 2 - menuWidth / 2 - spacer, canvas.height * 1 / 3 + carHeight * 4 - carHeight * 1 / 3 - spacer), menuWidth + spacer * 2, carHeight * 5 / 12 + spacer * 2, "[D]irections", carHeight * 5 / 12);
var scoresButton = new ButtonMenu(new Vector(canvas.width / 2 - menuWidth / 2 - spacer, canvas.height * 1 / 3 + carHeight * 4 + carHeight * 1.3 - carHeight * 1 / 3 - spacer), menuWidth + spacer * 2, carHeight * 5 / 12 + spacer * 2, "Top [S]cores", carHeight * 5 / 12);
var ufos = [];
var cars = [];
var buildings = [];
var lasers = [];
var bar = [];
var landSlides = [];
var notices = [];
var pickUps = [];
var base = playerLevel - 3 * carHeight;
var justPlaced = true; // true to skip placing one in the first row
for (var i = 0; i < 10; i++) {
    var startPosY = base - (1.5 * carHeight * i);
    var speed = (getRandomInt(700, 900) / 120) * canvas.width * 1 / 6000;
    speed = getRandomInt(1, 3) == 2 ? -speed : speed;
    cars.push(new Car(startPosY, speed, speed / 100));
    if (Math.random() < buildingBlockCount / 10 && !justPlaced) {
        buildings.push(new Building(startPosY));
        justPlaced = true;
    }
    else
        justPlaced = false;
}
// to make it look like player is moving
var barWidth = 3 / 4 * carHeight;
var barHeight = (barWidth * 11) / 14; // (33/56) * carHeight
for (var i = 0; i < canvas.height / barHeight; i++) {
    bar.push(new Block(new Vector(0, i * barHeight), i, barWidth, barHeight));
    bar.push(new Block(new Vector(canvas.width - barWidth, i * barHeight), i, barWidth, barHeight));
}
var pauseButton = new ButtonExtra(barWidth * 3 / 4, barWidth * 3 / 4);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
