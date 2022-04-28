function Launch(id, len, tries, doubleLetters, cup) {
    document.getElementById(id + "WordLenSub").value = len;
    document.getElementById(id + "TriesSub").value = tries;
    document.getElementById(id + "DoubleLettersSub").value = doubleLetters;
    document.getElementById(id + "CupSub").value = cup;
    document.getElementById(id + "Form").submit();
}