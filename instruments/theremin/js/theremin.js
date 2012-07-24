(function(exports) {

// Shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function(callback) {
  window.setTimeout(callback, 1000 / 60);
};
})();

var ANGLE_THRESHOLD = 1;
var ANGLE_DELTA = 5;
/**
 * UI of the Theremin (mostly based on tilting).
 */
function Theremin() {
  window.addEventListener('deviceorientation',
      this._handleOrientationChange.bind(this));

  document.addEventListener('webkitvisibilitychange',
      this._handleVisibilityChange.bind(this));

  // Get the element to transform.
  this.el = document.querySelector('#theremin img');

  // Setup RAF and draw a debug thing moving to volume and pitch.
  requestAnimFrame(this._render.bind(this));

  // Setup keyboard for debugging.
  document.addEventListener('keydown', this._onKeyDown.bind(this));

  this.pitchAngle = 0;
  this.volumeAngle = 0;
  this.isCalibrated = false;
}

Theremin.prototype.onOrientationChange = function(callback) {
  this.callback = callback;
};

/** PRIVATE STUFF */

Theremin.prototype._handleOrientationChange = function(e) {
  // Check if we've calibrated.
  if (!this.isCalibrated && e.gamma) {
    this.refPitchAngle = e.gamma;
    this.refVolumeAngle = e.beta;
    this.isCalibrated = true;
  }
  // Get left-to-right tilt in degrees, where right is positive.
  var pitchAngle = e.gamma || 0;

  // Get front-to-back tilt in degrees, where front is positive.
  var volumeAngle = e.beta || 0;

  // Only callback if the pitch or volume changes.
  shouldCallback = false;
  if (Math.abs(pitchAngle - this.pitchAngle) > ANGLE_THRESHOLD) {
    this.pitchAngle = pitchAngle;
    this.callback && this.callback({pitch: Math.round(pitchAngle/6)});
  }
  if (Math.abs(volumeAngle - this.volumeAngle) > ANGLE_THRESHOLD) {
    this.volumeAngle = volumeAngle;
    this.callback && this.callback({
      volume: this._normAngleDiff(this.refVolumeAngle, volumeAngle)
    });
  }
};

Theremin.prototype._handleVisibilityChange = function(e) {
  if (document.webkitHidden) {
    this.callback && this.callback({stop: true});
  } else {
    this.callback && this.callback({play: true});
  }
};

Theremin.prototype._render = function(time) {
  this.el.style.webkitTransform = 'rotateX($Adeg) rotateZ($Bdeg)'
      .replace('$A', this.volumeAngle)
      .replace('$B', this.pitchAngle);

  // Keep rendering.
  requestAnimFrame(this._render.bind(this));
};

/** DEBUG ONLY */
Theremin.prototype._onKeyDown = function(e) {
  if (37 <= e.keyCode && e.keyCode <= 40) {
    e.preventDefault();
  }
  var fakeEvent = {
    gamma: this.pitchAngle || 0,
    beta: this.volumeAngle || 0
  };
  if (e.keyCode == 37) { // Left
    fakeEvent.gamma = this.pitchAngle - ANGLE_DELTA;
  } else if (e.keyCode == 39) { // Right
    fakeEvent.gamma = this.pitchAngle + ANGLE_DELTA;
  } else if (e.keyCode == 38) { // Up
    fakeEvent.beta = this.volumeAngle - ANGLE_DELTA;
  } else if (e.keyCode == 40) { // Down
    fakeEvent.beta = this.volumeAngle + ANGLE_DELTA;
  }
  this._handleOrientationChange(fakeEvent);
};

/**
 * @return Normalized angular difference (between 0 and 1).
 */
Theremin.prototype._normAngleDiff = function(ref, angle) {
  // Translate the value.
  var a = ref - angle;
  // Scale value by a factor to make sense for angles.
  var scaled = a / 40;
  // Clamp value between [-1, 1].
  var norm = Math.min(1, Math.max(-1, scaled));
  // Next, translate range to [0, 1].
  return (norm + 1)/2;
};


exports.Theremin = Theremin;
})(window);
