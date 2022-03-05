function Launch6x5x1() {
    document.getElementById("wordLenSub").value = 5;
    document.getElementById("triesSub").value = 6;
    document.getElementById("doubleLettersSub").value = false;
    document.getElementById("wordGen").submit();
}

function Launch0x5x1() {
    document.getElementById("wordLenSub").value = 5;
    document.getElementById("triesSub").value = 0;
    document.getElementById("doubleLettersSub").value = true;
    document.getElementById("wordGen").submit();
}