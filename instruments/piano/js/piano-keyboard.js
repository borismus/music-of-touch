function PianoKeyboard() {
  this.el = document.querySelector('#piano');
  this.Config = {
    KEY_WIDTH: 40
  };
  this.create();
}

PianoKeyboard.prototype.create = function() {
  // Create some octaves.
  for (var i = 0; i < 2; i++) {
    this._createOctave(i);
  }
  //this._createOctave(0);
};

PianoKeyboard.prototype._createOctave = function(number) {
  // TODO: Create a bunch of keys. Map each key's pointer down events.
  //
  var blackCount = 0;
  var whiteCount = 0;
  var semitoneRoot = number * 12;
  var offsetRoot = number * this.Config.KEY_WIDTH * 7;
  for (var i = 0; i < 12; i++) {
    // Check if it's black or white.
    if (this._isBlack(i)) {
      var pos = blackCount < 2 ? blackCount + 1 : blackCount + 2;
      this._createKey({
        className: 'black-key',
        offset: offsetRoot + pos * this.Config.KEY_WIDTH,
        pitch: semitoneRoot + i
      });
      blackCount++;
    } else {
      this._createKey({
        className: 'white-key',
        offset: offsetRoot + whiteCount * this.Config.KEY_WIDTH,
        pitch: semitoneRoot + i
      });
      whiteCount++;
    }
  }
};

PianoKeyboard.prototype._createKey = function(options) {
  var key = document.createElement('div');
  key.className = options.className;
  var transform = 'translateX(%px)'.replace('%', options.offset);
  key.style.webkitTransform = transform;
  key.style.MozTransform = transform;
  key.style.OTransform = transform;
  key.dataset.pitch = options.pitch;
  key.addEventListener('pointerdown', this._onPointerDown.bind(this));

  this.el.appendChild(key);
};

/**
 * Returns true iff the index (starting from C) is black.
 */
PianoKeyboard.prototype._isBlack = function(index) {
  var blacks = [0,1,0,1,0,0,1,0,1,0,1,0];
  return blacks[index];
}

PianoKeyboard.prototype._onPointerDown = function(e) {
  var pitch = e.target.dataset.pitch;
  if (this.callback) {
    this.callback({pitch: pitch});
  }
};

PianoKeyboard.prototype.onKey = function(callback) {
  // Register key pressed callback.
  this.callback = callback;
};
