var synthmgr = null;
var logo = null;

window.addEventListener('load', function() {
  // Setup the synth manager and register all synthesizers with it.
  synthmgr = new AudioSynthManager();
  synthmgr.registerSynth('piano', PianoSynth);

  // Connect to the audio server.
  server = new AudioServer('localhost', 1338);
  server.connect();

  // Listen for messages and relay them to the synth manager.
  server.onMessage(onMessageCallback);

  // Get a handle on the logo.
  logo = document.querySelector('.logo');
});

function onMessageCallback(message) {
  synthmgr.playMessage(message);
  // Make the logo slightly larger temporarily.
  logo.classList.add('big');
  setTimeout(restoreLogoSize, 100);
}

function restoreLogoSize() {
  logo.classList.remove('big');
}
