function changeSectionHeadColor() {
    var headers = document.getElementsByClassName("sectionHead");
    var c1 = '#FAF8F6';
    var c2 = '#ff6961';

    for (var i = 0; i < headers.length; i++) {
      headers[i].style.backgroundColor = c1;
      headers[i].style.color = c2;
    }
  }
  