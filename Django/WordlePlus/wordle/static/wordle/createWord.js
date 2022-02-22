function SPCreateWord() {
    let wordLen = document.getElementById("wordLen").value;
    let tries = document.getElementById("tries").value;

    if (wordLen > 2 && wordLen < 10) {
        let avalibleWords = getWordsOfLen(wordLen);
        document.getElementById("word").value = avalibleWords[Math.floor(Math.random() * avalibleWords.length)];
        document.getElementById("tries").value = tries;
        document.getElementById("wordGen").submit();
    }
    else {
        document.getElementById("wordLen").style.border = "1px solid red";
    }
}