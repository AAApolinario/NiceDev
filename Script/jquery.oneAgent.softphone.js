(function (jQuery) {

    if (!jQuery.oneAgent) jQuery.oneAgent = new Object();

    jQuery.oneAgent.softphone = (function () {
        var self = this;
        self.connection = null;
        self.extension = null;
        self.domain = null;
        self.hold = false;
        self.collab_tunnel_media = false;
        self.sequenceNumber = 0;
        self.source = 0;
        self.sequenceRTP = 0;
        self.streamSend = [];
        self.streamSendLock = false;

        //-------------------------------------------------------------------------------
        // OneAgent Softphone operations
        //-------------------------------------------------------------------------------


        function openWebSocket(url, tunnel_media) {

            self.collab_tunnel_media = tunnel_media;
            self.connection = new WebSocket(url);
            self.connection.binaryType = "arraybuffer";
            console.info('#SOFTPHONE ---> WebSocket - Sent connection request');

            self.connection.onopen = function() {
                dispatchEvent('softphoneOpen', null);
                console.info('#SOFTPHONE <--- WebSocket - Connection open! - ' + getSocketStateName(connection.readyState));
            };

            self.connection.onclose = function() {
                dispatchEvent('softphoneClose', null);
                console.info('#SOFTPHONE <--- WebSocket - Connection closed - ' + getSocketStateName(connection.readyState));
            };

            self.connection.onerror = function (error) {
                jQuery.oneAgent.sendErrorLogs("WebSocketError detected - Closed");
                console.error('#SOFTPHONE <--- WebSocket - Error detected: ', error);
            };

            self.connection.onmessage = function(event) {
                messageReceived(event.data);
            };
            
            return connection;

        }

        function closeWebSocket() {
            console.info('#SOFTPHONE ---> WebSocket - Sent connection close request');
            connection.close();
        }

        function registerExtension(extension, domain, sdp) {
            sendConnect(extension, domain, sdp);
        }

        function makeCall(number, sdp) {
            sendStart(number, sdp, false);
        }
        function makeFakeCall(sdp) {
            sendStart('', sdp, true);
        }

        function heartbeat() {
            sendHeartbeat();
        }
        
        function ackCall(sdp, callID) {
            respondStart(sdp, callID);
        }
        
        function acceptCall(sdp, callID) {
            finalStart(sdp, callID);
        }
        
        function completeCall(callID) {
            messageComplete(callID);
        }
        
        function hangupCall() {
            messageShutdown();
        }

        function sendIM(callID, message, status) {
            messageIM(callID, message, status);
        }

        //For audioWebSocket
        function sendAudioWebSocket(stream, codec, sample) {

            if (self.sequenceNumber == 0) {
                self.source = Math.floor((Math.random() * 4294967295) + 1);
            }

            if (connection.readyState == 1) {
                var data = new Object();
                data.stream = stream;
                data.codec = codec;
                data.sample = sample;
                self.streamSend.push(data);
                if (!self.streamSendLock) {
                    while (self.streamSend.length) {
                        self.streamSendLock = true;

                        var object = self.streamSend.shift();

                        var streamAux = object.stream;
                        var streamCodec = object.codec;
                        var streamSample = object.sample;

                        if (streamCodec == 101) {
                            var dtmfPack = dtmfRTP(streamAux, self.sequenceNumber, self.source);
                            self.sequenceNumber = self.sequenceNumber + 11;
                            for (var i = 0; i < 11; i++) {
                                var dtmfStream = dtmfPack[i].buffer;
                                connection.send(dtmfStream);
                            }
                        } else {
                            var streamSendAux = WebAudioToAudio(streamAux, streamSample, streamCodec);

                            if (streamSendAux != null) {
                                var streamSend = new Uint8Array(streamSendAux, 0, 160);
                                var newStream = rtpPack(streamSend, streamCodec, self.sequenceNumber, self.source);
                                self.sequenceNumber++;
                                connection.send(newStream);
                            }
                        }
                        
                    }
                    self.streamSendLock = false;
                }
            }

        }

        //-------------------------------------------------------------------------------
        // Message parcing methods
        //-------------------------------------------------------------------------------

        function messageReceived(event) {

            if (event instanceof ArrayBuffer) {
                var packet = rtpUnpack(event);
                dispatchEvent('softphoneMessage', 'rtp', packet);
            } else {
                var message = JSON.parse(event);

                switch (message.control.type) {
                    case 'request':
                        switch (message.header.action) {
                            case 'start':
                                message.payload.sdp = message.payload.sdp.replace(new RegExp(" udp ", 'g'), " UDP ");
                                console.info('#SOFTPHONE <--- JsonRTC - START - REQUEST', message);
                                dispatchEvent('softphoneMessage', 'offer', message);
                                break;
                            default:
                                console.info('#SOFTPHONE <--- JsonRTC - UNKNOWN - REQUEST');
                                break;
                        }
                        break;
                    case 'response':
                        switch (message.header.action) {
                            case 'start':
                                switch (message.control.message_state) {
                                    case "Final":
                                        console.info('#SOFTPHONE <--- JsonRTC - FINAL START - RESPONSE', message);
                                        dispatchEvent('softphoneMessage', 'answer', message);
                                        break;
                                    default:
                                        console.info('#SOFTPHONE <--- JsonRTC - START - RESPONSE', message);
                                        break;
                                }
                                break;
                            case 'connect':
                                dispatchEvent('softphoneMessage', 'connected', null);
                                console.info('#SOFTPHONE <--- JsonRTC - CONNECT - RESPONSE', message);
                                break;
                            case 'heartbeat':
                                dispatchEvent('softphoneHeartbeat', 'response', null);
                                console.info('#SOFTPHONE <--- JsonRTC - HEARTBEAT - RESPONSE', message);
                                break;
                            default:
                                console.info('#SOFTPHONE <--- JsonRTC - UNKNOWN - RESPONSE', message);
                                break;
                        }
                        break;
                    case 'message':
                        switch (message.header.action) {
                            case 'im':
                                dispatchEvent('softphoneMessage', 'im', message);
                                console.info('#SOFTPHONE <--- JsonRTC - IM - MESSAGE', message);
                                break;
                            case 'complete':
                                dispatchEvent('softphoneMessage', 'complete', message);
                                console.info('#SOFTPHONE <--- JsonRTC - COMPLETE - MESSAGE', message);
                                break;
                            case 'shutdown':
                                dispatchEvent('softphoneMessage', 'bye', message);
                                console.info('#SOFTPHONE <--- JsonRTC - SHUTDOWN - MESSAGE', message);
                                break;
                            default:
                                console.info('#SOFTPHONE <--- JsonRTC - UNKNOWN - MESSAGE', message);
                                break;
                        }
                        break;
                    case 'error':
                        dispatchEvent('softphoneMessage', 'error', message);
                        console.error('#SOFTPHONE <--- JsonRTC - ERROR ' + message.control.error_code, message);
                        break;
                    default:
                        console.warn('#SOFTPHONE <--- JsonRTC - UNKNOWN');
                        break;
                }
            }

        }

        //-------------------------------------------------------------------------------
        // Auxiliary methods
        //-------------------------------------------------------------------------------

        function sendConnect(extension, domain, sdp) {

            self.extension = extension;
            self.domain = domain;

            var object = new Object();
            object.control = new Object();
            object.control.type = 'request';
            object.control.sequence = sequenceRTP;
            object.control.version = '1.0';
            object.header = new Object();
            object.header.action = 'connect';
            object.header.initator = extension + '@' + domain;
            object.payload = new Object();
            object.payload.sdp = sdp;
            object.payload.type = "connect";

            console.info('#SOFTPHONE ---> JsonRTC - CONNECT - REQUEST', object);

            connection.send(JSON.stringify(object));
        }

        function sendStart(number, sdp, checkTunneling) {
            var object = new Object();
            object.control = new Object();
            object.control.type = 'request';
            object.control.sequence = self.sequenceNumber;
            object.control.tunneling_detection = checkTunneling;
            object.header = new Object();
            object.header.action = 'start';
            object.header.initator = self.extension + '@' + self.domain;
            object.header.target = number + '@' + self.domain;
            object.header.collab_tunnel_media = self.collab_tunnel_media;
            object.payload = new Object();
            object.payload.sdp = sdp.sdp;
            object.payload.type = sdp.type;

            console.info('#SOFTPHONE ---> JsonRTC - START - REQUEST', object);

            connection.send(JSON.stringify(object));
        }

        function sendHeartbeat() {

            var object = new Object();
            object.control = new Object();
            object.control.type = 'request';
            object.control.sequence = self.sequenceNumber;
            object.header = new Object();
            object.header.action = 'heartbeat';

            console.info('#SOFTPHONE ---> JsonRTC - HEARTBEAT', object);

            connection.send(JSON.stringify(object));
        }

        function finalStart(sdp, callID) {

            var object = new Object();
            object.control = new Object();
            object.control.type = 'response';
            object.control.sequence = '2';
            object.control.correlation_id = "c2";
            object.control.subsession_id = "c2";
            object.control.session_id = callID;
            object.control.message_state = "Final";
            object.header = new Object();
            object.header.action = 'start';
            object.payload = new Object();
            object.payload.sdp = sdp.sdp.replace(new RegExp(" UDP ", 'g'), " udp ");
            object.payload.type = sdp.type;

            console.info('#SOFTPHONE ---> JsonRTC - FINAL START - RESPONSE', object);

            connection.send(JSON.stringify(object));
        }

        function respondStart(sdp, callID) {

            //var message = JSON.parse(start);

            var object = new Object();
            object.control = new Object();
            object.control.type = 'response';
            object.control.sequence = '2';
            object.control.correlation_id = "c2";
            object.control.subsession_id = "c2";
            object.control.session_id = callID;
            object.header = new Object();
            object.header.action = 'start';
            object.payload = new Object();
            object.payload.sdp = sdp.sdp;
            object.payload.type = sdp.type;

            console.info('#SOFTPHONE ---> JsonRTC - START - RESPONSE', object);

            connection.send(JSON.stringify(object));
        }

        function messageComplete(callID) {

            var object = new Object();
            object.control = new Object();
            object.control.type = 'message';
            object.control.sequence = '4';
            object.control.subsession_id = 'c2';
            object.control.session_id = callID;
            object.header = new Object();
            object.header.action = 'complete';
            object.payload = new Object();

            console.info('#SOFTPHONE ---> JsonRTC - COMPLETE - MESSAGE', object);

            connection.send(JSON.stringify(object));
        }

        function messageShutdown() {

            var object = new Object();
            object.control = new Object();
            object.control.type = 'message';
            object.control.sequence = '4';
            object.control.subsession_id = 'c2';
            object.header = new Object();
            object.header.action = 'shutdown';
            object.payload = new Object();

            console.info('#SOFTPHONE ---> JsonRTC - SHUTDOWN - MESSAGE', object);

            connection.send(JSON.stringify(object));
        }

        function messageError(callID, code) {

            var object = new Object();
            object.control = new Object();
            object.control.type = 'error';
            object.control.sequence = '4';
            object.control.subsession_id = 'c2';
            object.control.session_id = callID;
            object.control.error_code = code;

            console.error('#SOFTPHONE ---> JsonRTC - ERROR - MESSAGE', object);

            connection.send(JSON.stringify(object));
        }

        function messageIM(callID, message, status) {
            var object = new Object();
            object.control = new Object();
            object.control.type = 'message';
            object.control.sequence = '4';
            object.control.subsession_id = 'c2';
            object.control.session_id = callID;
            object.header = new Object();
            object.header.action = 'im';
            object.im = new Object();
            object.im.message = message;
            object.im.status = status;

            console.info('#SOFTPHONE ---> JsonRTC - IM - MESSAGE', object);

            connection.send(JSON.stringify(object));
        }

        function getSocketStateName(state) {
            var strSocketState = "";

            if (state == 0) {
                strSocketState = "Connecting";
            } else if (state == 1) {
                strSocketState = "Open";
            } else if (state == 2) {
                strSocketState = "Closing";
            } else if (state == 3) {
                strSocketState = "Closed";
            }

            return strSocketState;
        }


        function dispatchEvent(name, type, data) {

            $.event.trigger({
                type: name,
                customType: type,
                JsonRTC: data,
                time: new Date()
            });

        }

        return {
            'openWebSocket': openWebSocket,     //Open WebSocket
            'closeWebSocket': closeWebSocket,   //Close WebSocket
            'sendAudioWebSocket': sendAudioWebSocket, //Send audio via socket
            'registerExtension': registerExtension,
            'makeCall': makeCall,               //Make call
            'makeFakeCall': makeFakeCall,               //Make fake call to check tunneling
            'ackCall': ackCall,           //Send SDP to the requested call
            'acceptCall': acceptCall,           //Accept Call
            'hangupCall': hangupCall,           //Hangup
            'completeCall': completeCall,        //Dispatch when local and remote are connected
            'messageError': messageError,        
            'heartbeat': heartbeat,              //Sends an heartbeat to SipConnector so that firewalls don't close the connection
            'sendIM': sendIM
        };
    }(jQuery));
}(window.jQuery));