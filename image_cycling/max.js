// MAX javascript component to cycle through 9 images
// randomly selecting 1-3 images and fading them in/out
// https://docs.cycling74.com/max7/tutorials/javascriptchapter01
// Tasks/intervals: https://docs.cycling74.com/max8/tutorials/javascriptchapter03

// inlets and outlets
inlets = 1 // on or off
outlets = 9 // opacity of 9 images

// global variables
var runsPerSecond = 60;

// keep at 1 unless you want things to go faster, and then increase
var simSpeed = 1;
// 2000 ms to fade in/out
var fadeRange = 2000 / simSpeed;
// How much do images fade-in at their maximums? Between 0->1
var maxFadeIn = 0.4;

// minFullOnRange: minimum period after fade-in occurs
var minFullOnRange = 2000 / simSpeed;
// maxFullOnRange: longest possible period (ms) to stay fully on (beyond fade in/out time)
// MUST be bigger than minFullOnRange (or very weird things will happen)
var maxFullOnRange = 4000 / simSpeed;
// how often should a blank be chosen compared to an image
// 0.5 will mean 1/3 time there will be a single image and 1/3^2=1/9 chance that no image will be shown
var blankRatio = 0.5;


var powerSwitch = 0;
var runningJob = null;

function zeroArray(len) {
  var arr = new Array(len);
  for (var i=0,l=len; i<l; i++) {
    arr[i] = 0;
  }
  return arr;
}

// directions: positive/negative depending on fading in/out
// NOTE: this array should
// to make a 'blank' more likely and 0s to this array and the states[] and maximums[] arrays
var directions = zeroArray(Math.ceil(outlets * (1 + blankRatio)));

// states
var states = zeroArray(Math.ceil(outlets * (1 + blankRatio)));

// maximums: sort of the 'top of the yo-yo' 
//   State keeps going until it hits the maximum
//   Even though opacity is clamped to 1.
//   state can go above that post-fadein, to 'stay on'
var maximums = zeroArray(Math.ceil(outlets * (1 + blankRatio)));

var tsk = new Task(gameLoop, this);

function bang() {
  powerSwitch = 1;
  post("bang");
  tsk.cancel();
  startup();
}

function msg_float(r) {
  if (r) {
    tsk.cancel();
    post("msg_float startup");
    startup();
  }
  if (powerSwitch == 1 && r == 0) {
    post("msg_float fade out");
    // end: should fade everything out
    for (var i=0,l=directions.length; i<l; i++) {
      if (directions[i] > 0) {
        directions[i] = -directions[i];
        states[i] = Math.min(1, states[i]);
      }
    }
  }
  powerSwitch = r;
}

function startup() {
  tsk.interval = parseInt(1000 / runsPerSecond);
  tsk.repeat(10000000); // a BIG number to repeat for a long time
}

function gameLoop() {
  // SECTION 1: Do we need to start a new image?
  var numActive = 0;
  var nextChoice = Math.floor(Math.random() * (directions.length - 1));
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
  post("gameLoop: " + numActive);
  if (powerSwitch && numActive < 2 && nextIndex !== null) {
    // how much to increment each time for fadeRange to go from 0->1
    directions[nextIndex] = 1 / runsPerSecond / (fadeRange / 1000);
    // from 1-> random()*
    maximums[nextIndex] = 1 + (minFullOnRange + Math.random() * (maxFullOnRange - minFullOnRange)) / fadeRange;
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
      directions[j] = -Math.abs(directions[j]);
    }

    // output new value
    if (j < outlets) {
      outlet(j, maxFadeIn * Math.min(1, states[j]));
    }
  }

}
