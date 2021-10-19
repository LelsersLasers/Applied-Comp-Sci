
function setPic(source, id) {
    img = document.getElementById(id);
    img.src = source;
}

function showAccount(popUpId) {
    console.log("clicked")
    div = document.getElementById(popUpId);
    if (div.classList.contains("d-none")){
        div.classList.remove("d-none");
        shown = true;
    }
    else {
        div.classList.add("d-none");
        shown = false;
    }
}