function AudioSynthManager() {
  // Create a Web Audio context if possible.
  if (this._isWebAudioSupported()) {
    this.context = new webkitAudioContext();
    // Manage a list of all registered synths.
    this.synths = {};
  }
}

AudioSynthManager.prototype.registerSynth = function(name, synthClass) {
  if (this._isWebAudioSupported()) {
    this.synths[name] = new synthClass(this.context);
  }
};

AudioSynthManager.prototype.playMessage = function(message) {
  if (this._isWebAudioSupported()) {
    // Get synth name from the message.
    var synth = this.synths[message.synthName];
    // Defer to the synth to handle the message.
    synth.playMessage(message);
  }
};

AudioSynthManager.prototype._isWebAudioSupported = function() {
  return !!window.webkitAudioContext;
};
