function hover(id, hoverState) {
    let element = document.getElementById(id);
    if (hoverState) {
        element.classList.remove("colors1");
        element.classList.add("colors2");
    }
    else {
        element.classList.remove("colors2");
        element.classList.add("colors1");
    }
}