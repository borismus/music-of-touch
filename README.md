# Your mobile browser, a musical instrument

Mobile browsers that implement the Web Audio API use the native playback
(**case 1**). Those that don't fall back to an Audio server, and send
messages to a Web Audio capable desktop browser over a web socket (**case 2**).

![Architecture diagram.](http://i.imgur.com/lTmiI.png)

# State of the art

At the time of writing, no mobile browsers support the Web Audio API.

# Directory guide

`/instruments`: Musical instruments with separated touch-enabled UI and
Web Audio API synthesizer components.

`/player`: The component responsible for playback if there's no Web
Audio support in the mobile browser (case 2).

`/shared`: JavaScript shared between the player and instruments.

`/server`: A python-based web socket server that accepts messages and
re-broadcasts them to all connected clients.

# Contributor guide

Need more musical instruments. Get creative!

1. Clone repository
2. Add a new directory in `instruments/`
3. Create a README.md in there
4. Develop your instrument, ensuring that your audio playback component
   is clearly separated from your instrument's UI.
5. Once you are ready, register your synth with the player in `/player`.
6. Test thoroughly and submit a pull request.
