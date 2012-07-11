function AudioServer(host, port) {
  this.host = host;
  this.port = port;

  this.callbacks = {
    connect: null,
    message: null
  };
}

/** Global constants */
AudioServer.clientTypes = {
  PLAYER: 'player',
  INSTRUMENT: 'instrument'
};

/**
 * Establish a connection to the web socket server.
 *
 * @param {Function} callback The function to call when connected.
 */
AudioServer.prototype.connect = function(callback) {
  var url = 'ws://{{host}}:{{port}}/'
        .replace('{{host}}', this.host)
        .replace('{{port}}', this.port);
  var socket = new WebSocket(url);
  this.callbacks.connect = callback;
  socket.onopen = this.onOpen_.bind(this);
  socket.onerror = function() {
    console.log('An error occurred.');
  };
  socket.onclose = function() {
    console.log('Socket closed.');
  };
  this.socket = socket;
};

/**
 * Identify yourself as a type of client.
 *
 * @param {String} clientType One of the AudioServer.clientTypes.* values.
 */
AudioServer.prototype.identify = function(clientType) {
  var identifyInfo = {
    type: 'identify',
    identifier: clientType
  };
  this.sendMessage(identifyInfo);
};

/**
 * Send an message to the clients that are listening.
 *
 * @param {Object} info Send an message with a specific payload.
 */
AudioServer.prototype.sendMessage = function(info) {
  // Only send messages if the socket is connected.
  if (this.isConnected()) {
    // Serialize the info into a JSON object and send it across the wire!
    var json = JSON.stringify(info);
    this.socket.send(json);
  }
};

/**
 * Register a callback for messages coming from other clients.
 *
 * @param {Function} callback The callback that's called when there's a
 * message.
 */
AudioServer.prototype.onMessage = function(callback) {
  this.callbacks.message = callback;
};

/**
 * Check if the socket is connected.
 */
AudioServer.prototype.isConnected = function() {
  return this.socket.readyState == 1;
};

/**
 * Internal callback for messages.
 */
AudioServer.prototype.onMessage_ = function(message) {
  if (this.callbacks.message) {
    var obj = JSON.parse(message.data);
    this.callbacks.message(obj);
  }
};

/**
 * Internal callback for socket opened.
 */
AudioServer.prototype.onOpen_ = function(message) {
  if (this.callbacks.connect) {
    this.callbacks.connect();
  }
  // Setup a message listener.
  this.socket.onmessage = this.onMessage_.bind(this);
};
