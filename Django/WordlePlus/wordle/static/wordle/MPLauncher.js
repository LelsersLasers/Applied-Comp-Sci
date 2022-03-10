function Launch(len, tries, doubleLetters, cup) {
    document.getElementById("wordLenSub").value = len;
    document.getElementById("triesSub").value = tries;
    document.getElementById("doubleLettersSub").value = doubleLetters;
    document.getElementById("cupSub").value = cup;
    document.getElementById("wordGen").submit();
}
