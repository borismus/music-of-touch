/**
 * Class that plays back piano sounds based on messages received from the
 * input.
 */

function PianoSynth(context) {
  this.context = context;

  this.buffer = null;
  // Load a sound file.
  this._loadSound('sounds/sample.wav');
}

PianoSynth.prototype.playMessage = function(message) {
  console.log(message);
  this._playSound(message.pitch);
};

/**
 * Loads a sound from a URL.
 *
 * @param {String} url The URL to load from.
 * @param {Function} callback The callback to fire when the sound has loaded.
 */
PianoSynth.prototype._loadSound = function(url, callback) {
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
PianoSynth.prototype._playSound = function(pitch) {
  var source = this.context.createBufferSource();
  source.buffer = this.buffer;
  source.connect(this.context.destination);
  var k = Math.pow(2, 1/12);
  source.playbackRate.value = Math.pow(k, pitch);
  source.noteOn(0);
};
