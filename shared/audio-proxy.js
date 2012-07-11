function AudioProxy() {
  this.server = new AudioServer('192.168.1.80', 1338);
  this.server.connect();
  this.synthManager = null;
}

/**
 * Sends a message to the synth.
 */
AudioProxy.prototype.sendMessage = function(message) {
  if (this._isWebAudioSupported()) {
    // If there's Web Audio API support, use the local synth.
    this.synthManager.playMessage(message);
  } else {
    // If there's no support, send message to the audio server.
    if (this.server.isConnected()) {
      this.server.sendMessage(message);
    } else {
      alert('No web audio support, and no audio server found!');
    }
  }
};

AudioProxy.prototype.setSynthManager = function(synthManager) {
  this.synthManager = synthManager;
};

/**
 * Shows a dialog to pick the host and port of the audio server to stream to.
 */
AudioProxy.prototype.showServerDialog = function() {
};

AudioProxy.prototype._isWebAudioSupported = function() {
  return !!window.webkitAudioContext;
};
