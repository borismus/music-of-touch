window.addEventListener('load', function() {
  // Create the piano keyboard.
  var keyboard = new PianoKeyboard();

  // Setup the audio channel (either local or remote).
  var proxy = new AudioProxy();

  // Setup the synth manager and register it with the proxy.
  var synthmgr = new AudioSynthManager();
  synthmgr.registerSynth('piano', PianoSynth);
  proxy.setSynthManager(synthmgr);

  // Hook up keyboard to make sounds.
  keyboard.onKey(function(data) {
    console.log('key pressed', data.pitch);
    proxy.sendMessage({
      synthName: 'piano',
      pitch: data.pitch
    });
  });
});
