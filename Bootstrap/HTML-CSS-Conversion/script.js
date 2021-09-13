function play() {
    var audio = document.getElementById("audio");
    if (audio.playing) {
        audio.pause();
        audio.playing = false;
    }
    else {
        audio.playing = true;
        audio.play();
    }
}