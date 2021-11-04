function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{
  // Set up the frame
  line.applyVelocity();
  line.bounceCheck();

  // Draw the new frame
  context.clearRect(0, 0, canvas.width, canvas.height);
  line.draw();

  // Loop the animation to the next frame.
  window.requestAnimationFrame(drawAll);
}

// Set up the canvas and context objects
context = setUpContext();

// Create instance of Line object
line = new Line(0, 0, 0, 0, context);
console.log(line);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);
