###############################################################################
##
##  Copyright 2011 Tavendo GmbH
##
##  Licensed under the Apache License, Version 2.0 (the "License");
##  you may not use this file except in compliance with the License.
##  You may obtain a copy of the License at
##
##      http://www.apache.org/licenses/LICENSE-2.0
##
##  Unless required by applicable law or agreed to in writing, software
##  distributed under the License is distributed on an "AS IS" BASIS,
##  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
##  See the License for the specific language governing permissions and
##  limitations under the License.
##
###############################################################################

import sys
from twisted.internet import reactor
from twisted.python import log
from autobahn.websocket import WebSocketServerFactory, WebSocketServerProtocol


class BroadcastServerProtocol(WebSocketServerProtocol):

   def onOpen(self):
      self.factory.register(self)

   def onMessage(self, msg, binary):
      if not binary:
         print "received message '%s' from %s" % (msg, self.peerstr)
         self.factory.broadcast(msg)

   def connectionLost(self, reason):
      WebSocketServerProtocol.connectionLost(self, reason)
      self.factory.unregister(self)


class BroadcastServerFactory(WebSocketServerFactory):

   protocol = BroadcastServerProtocol

   def __init__(self, **kwargs):
      WebSocketServerFactory.__init__(self, **kwargs)
      self.clients = []

   def register(self, client):
      if not client in self.clients:
         print "registered client " + client.peerstr
         self.clients.append(client)

   def unregister(self, client):
      if client in self.clients:
         print "unregistered client " + client.peerstr
         self.clients.remove(client)

   def broadcast(self, msg):
      print "broadcasting message '%s' .." % msg
      for c in self.clients:
         print "send to " + c.peerstr
         c.sendMessage(msg)


if __name__ == '__main__':

   log.startLogging(sys.stdout)
   factory = BroadcastServerFactory(url="ws://localhost:1338")#, debug=True)
   reactor.listenTCP(1338, factory)
   reactor.run()


