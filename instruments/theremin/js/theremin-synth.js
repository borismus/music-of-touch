(function(exports) {

var INACTIVE_TIME = 2000;

/**
 * Class that plays back piano sounds based on messages received from the
 * input.
 */

function ThereminSynth(context) {
  this.context = context;

  this.buffer = null;
  // Load a sound file.
  this._loadSound('sounds/sine.wav');
  this.isPlaying = false;
  this.lastMessageTime = null;

  // Setup a timer that stops playback if there hasn't been a message in the
  // last little while.
  setInterval(this._stopAfterInactivity.bind(this), 1000);
}

ThereminSynth.prototype.playMessage = function(message) {
  console.log(message);
  if (!this.isPlaying) {
    this._playSound();
    this.isPlaying = true;
  }
  if (typeof(message.pitch) !== 'undefined') {
    this._changePitch(message.pitch);
  }
  if (typeof(message.volume) !== 'undefined') {
    this._changeVolume(message.volume);
  }
  this.lastMessageTime = new Date();
};

/**
 * Loads a sound from a URL.
 *
 * @param {String} url The URL to load from.
 * @param {Function} callback The callback to fire when the sound has loaded.
 */
ThereminSynth.prototype._loadSound = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    this.context.decodeAudioData(request.response, function(decodeBuffer) {
      this.buffer = decodeBuffer;
      if (callback) {
        callback();
      }
    }.bind(this), null);
  }.bind(this);
  request.send();
};

/**
 * Plays the loaded sound.
 */
ThereminSynth.prototype._playSound = function() {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  source.connect(this.context.destination);
  source.loop = true;
  source.noteOn(0);

  // Save a handle for later.
  this.source = source;
};

ThereminSynth.prototype._stopSound = function() {
  this.source && this.source.noteOff(0);
  this.isPlaying = false;
};

ThereminSynth.prototype._changePitch = function(pitch) {
  var k = Math.pow(2, 1/12);
  var targetValue = Math.pow(k, pitch);
  var targetTime = this.context.currentTime + 0.2;
  this.source.playbackRate.linearRampToValueAtTime(targetValue, targetTime);
};

ThereminSynth.prototype._changeVolume = function(volume) {
  this.source.gain.value = volume;
};

ThereminSynth.prototype._stopAfterInactivity = function() {
  if (new Date() - this.lastMessageTime > INACTIVE_TIME) {
    this._stopSound();
  }
};

exports.ThereminSynth = ThereminSynth;

})(window);
