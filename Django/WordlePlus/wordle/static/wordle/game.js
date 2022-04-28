var word;
var availableWords = [];
var startTime;
var takenTime;

var wordLen;
var tries;
var infiniteTries = false;

var guesses;
var stat;

var state = "game";
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

var guessPos = [0, 0];

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (state == "game") {
        if (e.key == "Backspace") {
            guesses[guessPos[0]][guessPos[1] - 1] = "";
            if (guessPos[1] > 0) guessPos[1]--;
            document.getElementById("info").innerHTML = " ";
        }
        if (guessPos[1] >= wordLen) {
            if (e.key == "Enter") {
                let guessWord = guesses[guessPos[0]].join("").toLowerCase();
                if (search(guessWord)) {
                    guessPos[1] = 0;
                    let match = 0;
                    for (let i = 0; i < wordLen; i++) {
                        if (guesses[guessPos[0]][i] == word.charAt(i).toUpperCase()) {
                            stat[guessPos[0]][i] = 2;
                            match++;
                        }
                        else if (word.toUpperCase().split("").includes(guesses[guessPos[0]][i])) {
                            stat[guessPos[0]][i] = 1;
                        }
                        else {
                            stat[guessPos[0]][i] = -1;
                        }
                    }
                    if (match == wordLen) {
                        state = "won";
                    }
                    else if (guessPos[0] >= tries - 1 && !infiniteTries) {
                        state = "lost";
                    }
                    guessPos[0]++;
                    document.getElementById("info").innerHTML = "";
                    if (infiniteTries && state == "game") {
                        tries++;
                        guesses.push([]);
                        for (var j = 0; j < wordLen; j++) {
                            guesses[guesses.length - 1].push("");
                        }
                        stat.push([]);
                        for (var j = 0; j < wordLen; j++) {
                            stat[stat.length - 1].push(0);
                        }
                    }
                }
                else {
                    document.getElementById("info").innerHTML = "Guesses must be words";
                }
            }
        }
        else if (alphabet.includes(e.key.toLowerCase())) {
            guesses[guessPos[0]][guessPos[1]] = e.key.toUpperCase();
            guessPos[1]++;
        }
        draw();
    }
}

function draw() {
    main = document.getElementById("holder");
    main.innerHTML = "";

    for (var i = 0; i < tries; i++) {
        let txt = "";
        for (var j = 0; j < wordLen; j++) {
            colorStyle = "default";
            if (stat[i][j] == 1) colorStyle = "yellow";
            else if (stat[i][j] == 2) colorStyle = "green";
            else if (i == guessPos[0]) {
                if (guessPos[1] == wordLen && j == 4) colorStyle = "selected";
                else if (guessPos[1] == j) colorStyle = "selected";
            }
            txt += "<div class='box " + colorStyle + "' id='" + i + "-" + j +"'>"
            + guesses[i][j] + "</div>";
        }
        main.innerHTML += "<div class='row' id='row" + i + "'> " + txt + "</div>";
    }
    if (state == "lost") document.getElementById("info").innerHTML = "You lost! The correct word was: " + word;
    else if (state == "won") {
        let seconds = ((Date.now() - startTime)/1000).toFixed(0);
        takenTime = seconds;
        let minutes = 0;
        while (seconds > 60) {
            minutes++;
            seconds -= 60;
        }
        if (seconds < 10) seconds = "0" + seconds;
        if (minutes < 10) minutes = "0" + minutes;
        document.getElementById("info").innerHTML = "YOU WON!\nGuesses: " + guessPos[0] + ", time taken: " + minutes + ":" + seconds;
        if (document.getElementById("cupIn").value.trim() != "SP") {
            document.getElementById("MPSubmitButton").removeAttribute("hidden");
            document.getElementById("MPBackButton").setAttribute("hidden", "");
        }
        else {
            document.getElementById("showWord").setAttribute("hidden", "");
        }
    }
}

function sendScore() {
    document.getElementById("cupName").value = document.getElementById("cupIn").value;
    document.getElementById("word").value = word;
    document.getElementById("guesses").value = guessPos[0];
    document.getElementById("time").value = takenTime;
    document.getElementById("MPSubmit").submit();
}

function showWord() {
    if (state != "won") {
        state = "lost";
        document.getElementById("info").innerHTML = "You lost! The correct word was: " + word;
    }
}

function setupGame() {
    word = atob(document.getElementById("wordTxtIn").value.trim().split("'")[1]);
    wordLen = document.getElementById("lengthIn").value;
    tries = document.getElementById("triesIn").value;
    
    let availableWordsString = document.getElementById("availableWordsIn").value.replace("[", "").replace("]", "").replaceAll(" ", "").replaceAll("'", "");
    let tempWord = "";
    for (var i in availableWordsString) {
        if (availableWordsString[i] == ",") {
            availableWords.push(tempWord);
            tempWord = "";
        }
        else tempWord += availableWordsString[i];
    }

    if (tries < 1) {
        infiniteTries = true;
        tries = 1;
    }

    guesses = [];
    for (var i = 0; i < tries; i++) {
        guesses.push([]);
        for (var j = 0; j < wordLen; j++) {
            guesses[i].push("");
        }
    }

    stat = [];
    for (var i = 0; i < tries; i++) {
        stat.push([]);
        for (var j = 0; j < wordLen; j++) {
            stat[i].push(0);
        }
    }

    draw();
    startTime = Date.now();
}

function search(x) {
    let start = 0;
    let end = availableWords.length-1;

    while (start <= end){
        let mid = Math.floor((start + end)/2);
        if (availableWords[mid] == x) return true;
        else if (availableWords[mid] < x) start = mid + 1;
        else end = mid - 1;
    }
    return false;
}