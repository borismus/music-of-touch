window.addEventListener('load', function() {
  // Create the theremin.
  theremin = new Theremin();

  // Setup the audio channel (either local or remote).
  var proxy = new AudioProxy();

  // Setup the synth manager and register it with the proxy.
  var synthmgr = new AudioSynthManager();
  synthmgr.registerSynth('theremin', ThereminSynth);
  proxy.setSynthManager(synthmgr);

  // Hook up theremin to make sounds.
  theremin.onOrientationChange(function(data) {
    data.synthName = 'theremin';
    proxy.sendMessage(data);
  });
});
