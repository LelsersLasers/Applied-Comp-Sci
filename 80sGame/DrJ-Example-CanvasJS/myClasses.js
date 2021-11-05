class Line {
  // Notice that the constructor takes some of its values as inputs,
  //   and sets others by itself.
  constructor(x1, y1, x2, y2) {
    this.pt1 = [x1, y1];
    this.pt2 = [x2, y2];
    this.vel1 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
    this.vel2 = [Math.random() * 4 - 2, Math.random() * 4 - 2];
    this.color = "#0000ff";
    this.width = 3;
    this.cap = 'round';
  }

  ///////////////// Lots of getters and setters
  get x1() {
    return this.pt1[0];
  }

  set x1(newX1) {
    this.pt1[0] = newX1;
  }

  get y1() {return this.pt1[0];}
  set y1(newX1) {this.pt1[0] = newX1;}

  get x2() {return this.pt1[0];}
  set x2(newX1) {this.pt1[0] = newX1;}

  get y2() {return this.pt1[0];}
  set y2(newX1) {this.pt1[0] = newX1;}

  ////////////////// Custom methods

  applyVelocity() {
    // Add velocity to position in each coordinate
    this.pt1[0] += this.vel1[0];
    this.pt1[1] += this.vel1[1];
    this.pt2[0] += this.vel2[0];
    this.pt2[1] += this.vel2[1];
  }

  bounceCheck() {
    // Check if any point is over any edge.  If it is over the edge, then
    //   set it to be at the edge, reverse direction, and slightly modify
    //   the velocity by a little.
    if (this.pt1[0] > canvas.width) {
      this.pt1[0] = canvas.width;
      this.vel1[0] += Math.random() - 0.5;
      if (this.vel1[0] > 0) {this.vel1[0] *= -1;}
      console.log(line);
    }
    if (this.pt1[0] < 0) {
      this.pt1[0] = 0;
      this.vel1[0] += Math.random() - 0.5;
      if (this.vel1[0] < 0) {this.vel1[0] *= -1;}
      console.log(line);
    }
    if (this.pt2[0] > canvas.width) {
      this.pt2[0] = canvas.width;
      this.vel2[0] += Math.random() - 0.5;
      if (this.vel2[0] > 0) {this.vel2[0] *= -1;}
      console.log(line);
    }
    if (this.pt2[0] < 0) {
      this.pt2[0] = 0;
      this.vel2[0] += Math.random() - 0.5;
      if (this.vel2[0] < 0) {this.vel2[0] *= -1;}
      console.log(line);
    }
    if (this.pt1[1] > canvas.height) {
      this.pt1[1] = canvas.height;
      this.vel1[1] += Math.random() - 0.5;
      if (this.vel1[1] > 0) {this.vel1[1] *= -1;}
      console.log(line);
    }
    if (this.pt1[1] < 0) {
      this.pt1[1] = 0;
      this.vel1[1] += Math.random() - 0.5;
      if (this.vel1[1] < 0) {this.vel1[1] *= -1;}
      console.log(line);
    }
    if (this.pt2[1] > canvas.height) {
      this.pt2[1] = canvas.height;
      this.vel2[1] += Math.random() - 0.5;
      if (this.vel2[1] > 0) {this.vel2[1] *= -1;}
      console.log(line);
    }
    if (this.pt2[1] < 0) {
      this.pt2[1] = 0;
      this.vel2[1] += Math.random() - 0.5;
      if (this.vel2[1] < 0) {this.vel2[1] *= -1;}
      console.log(line);
    }
  }

  draw() {
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.lineCap = this.cap;
    context.beginPath();
    context.moveTo(this.pt1[0], this.pt1[1]);
    context.lineTo(this.pt2[0], this.pt2[1]);
    context.stroke();
  }
}

function setUpContext() {
  // Get width/height of the browser window
  console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

  // Get the canvas, set the width and height from the window
  canvas = document.getElementById("mainCanvas");
  // I found that - 20 worked well for me, YMMV
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  canvas.style.border = "1px solid black";

  // Set up the context for the animation
  context = canvas.getContext("2d");
  return context;
}
