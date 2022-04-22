var doubleLetters = true;

function toggle() {
    doubleLetters = !doubleLetters;
}

function SPCreateWord() {
    wordLen = document.getElementById("wordLen").value;
    if (wordLen >= 3 && wordLen <= 10) {
        document.getElementById("wordLenSub").value = wordLen;
        document.getElementById("triesSub").value = document.getElementById("tries").value;
        document.getElementById("doubleLettersSub").value = doubleLetters;
        document.getElementById("wordGen").submit();
    }
    else document.getElementById("wordLen").style.border = "1px solid red";
}