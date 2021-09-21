// MAX javascript component to cycle through 9 images
// randomly selecting 1-3 images and fading them in/out
// https://docs.cycling74.com/max7/tutorials/javascriptchapter01

// inlets and outlets
inlets = 1 // on or off
outlets = 9 // opacity of 9 images

// global variables
var powerSwitch = 0;
var runningJob = null;
// directions: positive/negative depending on fading in/out
//             
var directions = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// states
var states = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// maximums: sort of the 'top of the yo-yo' 
//   State keeps going until it hits the maximum
//   Even though opacity is clamped to 1.
//   state can go above that post-fadein, to 'stay on'
var maximums = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var runsPerSecond = 60;

// 2000 ms to fade in/out
var fadeRange = 2000;

// maxFullOnRange: longest possible period (ms) to stay fully on (beyond fade in/out time)
var maxFullOnRange = 4000;

function bang() {
  powerSwitch = 1;
  // startup (a different way)
  if (runningJob) {
    clearInterval(runningJob);
  }
  startup();
}

function msg_float(r) {
  if (r != powerSwitch) {
    if (powerSwitch) {
      // startup
    } else {
      // power-off
    }
  }
  powerSwitch = r;
  outlet(9, r);
}

function startup() {
  runningJob = setInterval(gameLoop, parseInt(1000 / runsPerSecond));
}

function gameLoop() {
  // SECTION 1: Do we need to start a new image?
  var numActive = 0;
  var nextChoice = Math.floor(Math.random() * (directions.length - 2));
  var nextIndex = null;
  for (var i=0, l=directions.length; i<l; i++) {
    if (nextChoice == 0) {
      nextIndex = i;
    }
    if (directions[i] != 0) {
      numActive += 1;
    } else {
      nextChoice -= 1;
    }
  }
  if (numActive < 3 && nextIndex !== null) {
    // how much to increment each time for fadeRange to go from 0->1
    directions[nextIndex] = 1 / runsPerSecond / (fadeRange / 1000);
    // from 1-> random()*
    maximums[nextIndex] = 1 + (Math.random() * maxFullOnRange / fadeRange);
  }

  // SECTION 2: update all the image values
  for (var j=0, jl=directions.length; j<jl; j++) {
    states[j] += directions[j];
    // set direction to 0 if state is 0
    if (states[j] <= 0) {
      states[j] = 0;
      directions[j] = 0;
    }
    // flip direction if we hit the 'top'
    if (states[j] > 0 && states[j] >= maximums[j]) {
      // negate
      directions[j] = -directions[j];
    }

    // output new value
    outlet(j, Math.min(1, states[j]));
  }

}
