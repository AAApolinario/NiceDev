(function (jQuery) {
    jQuery.oneAgent = (function(connection) {
        var self = this;
        self.oneAgentAPI = connection.OneAgentWebAPI;
        self.isInitialized = false;
        self.bindedEvents = {};
        self.currentAgentSessionID;
        self.currentConnectionID;
        self.basepath = '';

        //-------------------------------------------------------------------------------
        // Auxiliary methods
        //-------------------------------------------------------------------------------

        function _appendResponder(responder, name, task, apiResponder) {
            task.done(function(data) {
                console.log('<<<', name);

                if (apiResponder && apiResponder.success) {
                    try {
                        apiResponder.success(data);
                    } catch(e) {
                        console.warn('... (', name, ') api callback err: ', e.message);
                    }
                }

                if (responder && responder.success) {
                    try {
                        responder.success(data);
                    } catch(e) {
                        console.warn('... (', name, ') callback err: ', e.message);
                    }
                }

                //Handle special error: agent not logged in
                if (data && !data.Succeeded && 'Agent not logged in' === data.Error) {
                    dispatchLocalEvent('onNotAuthorizedResponseError', { 'request': name, 'response': data, 'failled': true });
                }

                dispatchLocalEvent('onOperationEnded', { 'request': name, 'response': data, 'failled': false });
            });

            task.fail(function(data) {
                console.error('<<<(ERROR)', name, ': ', data);

                if (apiResponder && apiResponder.error) {
                    try {
                        apiResponder.error(data);
                    } catch(e) {
                        console.warn('... (', name, ') api callback err: ', e.message);
                    }
                }

                if (responder && responder.error) {
                    try {
                        responder.error(data);
                    } catch(e) {
                        console.warn('... (', name, ') callback err: ', e.message);
                    }
                }

                //Handle special error: agent not logged in
                if (data && 'Agent not logged in' === data.Error) {
                    dispatchLocalEvent('onNotAuthorizedResponseError', { 'request': name, 'response': data, 'failled': true });
                }

                dispatchLocalEvent('onOperationEnded', { 'request': name, 'response': data, 'failled': true });
            });
        }

        function _startOperation(name) {
            if (!self.isInitialized) {
                console.log('>>>', name, ' error: API not initialized');
                throw new Error('API not initialized');
            }
            console.log('>>>', name);

            dispatchLocalEvent('onOperationStarted', { 'request': name });
        }

        function _restoreUserSession(data) {
            if (data && data.Succeeded && data.UserSession) {
                var userSession = data.UserSession;

                if (userSession.CurrentAgentSession) {
                    self.currentAgentSessionID = userSession.CurrentAgentSession.AgentSessionID;

                    console.log('... restored agentSessionID to ', self.currentAgentSessionID);
                }
            }
        }

        //-------------------------------------------------------------------------------
        // Operations
        //-------------------------------------------------------------------------------

        function setPath(path) {
            self.basepath = path;
        }

        function setInstance(instanceName) {
            var instance = instanceName.toLowerCase();
            self.oneAgentAPI.state.instanceName = instance;
        }

        function initialize(instanceName, sessionID) {
            if (self.isInitialized) {
                throw new Error('Already initialized...');
            }

            self.isInitialized = true;
            self.oneAgentAPI.state.sessionID = sessionID;
            self.oneAgentAPI.state.instanceName = instanceName;

            bindEvent('onAgentSessionCreate', function(data) {
                self.currentAgentSessionID = data.Session.AgentSessionID;
            }).bindEvent('onAgentSessionTerminate', function(data) {
                self.currentAgentSessionID = -1;
                console.log("#################### TERMINATE #######################");
            }).bindEvent('onAgentLogin', function(data) {
                self.currentConnectionID = getConnectionID();
            }).bindEvent('onNewMasterConnection', function(data) {
                self.currentConnectionID = data.ConnectionID;
            });

            return $.oneAgent;
        }

        function bindEvent(ev, cb) {
            var evName = '' + ev;

            try {
                var evList = self.bindedEvents[evName];

                if (!cb) {
                    cb = function(data) {
                        //  If we don't provide a callback for the event, this dummy function 
                        //is used instead (useful to debug)            
                        console.log('... ', evName, ' handler not implemented');
                    };
                }

                if (!evList) {
                    evList = [];
                    self.bindedEvents[evName] = evList;

                    self.oneAgentAPI.client[evName] = function(data) {
                        console.log('%%%', evName, ' ', data);

                        for (var i = 0; i < evList.length; i++) {
                            var _cb = evList[i];

                            try {
                                _cb(data);

                            } catch(e) {
                                console.error('-> ERROR ON EV ', evName, ' - ', data);
                                console.error('-> ERROR ON CB ', _cb);
                                console.error('... callback[', i, '] err: ', e);
                            }
                        }

                    };
                }

                evList.push(cb);
            } catch(e) {
                console.error('bind to event <', evName, '> failled: ', e);
            }

            return $.oneAgent;
        }

        function dispatchLocalEvent(ev, data) {
            var evName = '' + ev;
            try {
                var cb = self.oneAgentAPI.client[evName];
                if (cb) {
                    console.log('dispatching local ev:', evName, ' ...');
                    cb(data);
                }
            } catch(e) {
                console.error(' ...dispatchLocalEvent ', evName, ' err: ', e);
            }
        }

        //-------------------------------------------------------------------------------
        // HeartBeat
        //-------------------------------------------------------------------------------

        function heartBeat(responder) {
            _startOperation('heartBeat');
            _appendResponder(responder, 'heartBeat',
                self.oneAgentAPI.server.heartBeat());
        }

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        function getIsMaster() {
            return self.currentConnectionID == getConnectionID();
        }

        function getConnectionID() {
            return self.oneAgentAPI.connection.id;
        }

        function getCurrentSessionID() {
            return self.currentAgentSessionID;
        }

        function getIsInitialized() {
            return self.isInitialized;
        }


        //-------------------------------------------------------------------------------
        // OneAgent operations
        //-------------------------------------------------------------------------------

        function isUserAuthenticated(responder) {
            _startOperation('isUserAuthenticated');
            _appendResponder(responder, 'isUserAuthenticated',
                self.oneAgentAPI.server.isUserAuthenticated());
        }

        function recoverAgentLogin(username, password, mobile, responder) {
            _startOperation('recoverAgentLogin');
            _appendResponder(responder, 'recoverAgentLogin',
                self.oneAgentAPI.server.recoverAgentLogin(username, password, mobile), {
                    success: _restoreUserSession
                });
        }

        function getUserSessionState(responder) {
            _startOperation('getUserSessionState');
            _appendResponder(responder, 'getUserSessionState',
                self.oneAgentAPI.server.getUserSessionState(), {
                    success: _restoreUserSession
                });
        }

        function setMasterConnection(responder) {
            _startOperation('setMasterConnection');
            _appendResponder(responder, 'setMasterConnection',
                self.oneAgentAPI.server.setMasterConnection(), {
                    success: _restoreUserSession
                });
        }

        function checkInstance(instance, responder) {
            _startOperation('checkInstance');
            _appendResponder(responder, 'checkInstance',
                self.oneAgentAPI.server.checkInstance(instance));
        }

        function login(username, password, extension, authenticatedUser, mobile, responder) {
            _startOperation('login');
            _appendResponder(responder, 'login',
                self.oneAgentAPI.server.login(username, password, extension, authenticatedUser, mobile));
        }
        
        function changePassword(oldPassword, newPassword, responder) {
            _startOperation('changePassword');
            _appendResponder(responder, 'changePassword',
                self.oneAgentAPI.server.changePassword(oldPassword, newPassword));
        }
        
        function setExtension(extension, responder) {
            _startOperation('setExtension');
            _appendResponder(responder, 'setExtension',
                self.oneAgentAPI.server.setExtension(extension));
        }

        function requestWrapup(agentSessionID, responder) {
            _startOperation('requestWrapup');
            _appendResponder(responder, 'requestWrapup',
                self.oneAgentAPI.server.requestWrapup(agentSessionID));
        }

        function endWrapup(agentSessionID, responder) {
            _startOperation('endWrapup');
            _appendResponder(responder, 'endWrapup',
                self.oneAgentAPI.server.endWrapup(agentSessionID));
        }

        function logout(responder) {
            _startOperation('logout');
            _appendResponder(responder, 'logout',
                self.oneAgentAPI.server.logout());
        }
        
        function forceLogout(responder) {
            _startOperation('forceLogout');
            _appendResponder(responder, 'forceLogout',
                self.oneAgentAPI.server.forceLogout());
        }

        function dialAudio(toAddress, serviceID, outgoingAddress, responder) {
            _startOperation('dial');
            _appendResponder(responder, 'dial',
                self.oneAgentAPI.server.dial(toAddress, 4201, serviceID ? serviceID : -1, outgoingAddress));
        }

        function dialVideo(toAddress, serviceID, outgoingAddress, responder) {
            _startOperation('dial');
            _appendResponder(responder, 'dial',
                self.oneAgentAPI.server.dial(toAddress, 4202, serviceID ? serviceID : -1, outgoingAddress));
        }

        function dialAudioInSession(toAddress, serviceID, outgoingAddress, responder) {
            _startOperation('agentSessionDial');
            _appendResponder(responder, 'agentSessionDial',
                self.oneAgentAPI.server.agentSessionDial(toAddress, 4201, serviceID ? serviceID : -1, outgoingAddress));
        }

        function dialVideoInSession(toAddress, serviceID, outgoingAddress, responder) {
            _startOperation('agentSessionDial');
            _appendResponder(responder, 'agentSessionDial',
                self.oneAgentAPI.server.agentSessionDial(toAddress, 4202, serviceID ? serviceID : -1, outgoingAddress));
        }

        function redialSession(sessionID, toAddress, mediaTypeID, serviceID, outgoingAddress, responder) {
            _startOperation('agentSessionRedial');
            _appendResponder(responder, 'agentSessionRedial',
                self.oneAgentAPI.server.agentSessionRedial(sessionID, toAddress, mediaTypeID, serviceID ? serviceID : -1, outgoingAddress));
        }

        function blindTransfer(interactionLegID, toAddress, outgoingAddress, responder) {
            _startOperation('blindTransfer');
            _appendResponder(responder, 'blindTransfer',
                self.oneAgentAPI.server.blindTransfer(interactionLegID, toAddress, outgoingAddress));
        }

        function transfer(interactionLegID, responder) {
            _startOperation('transfer');
            _appendResponder(responder, 'transfer',
                self.oneAgentAPI.server.transfer(interactionLegID));
        }

        function hold(interactionLegID, responder) {
            _startOperation('hold');
            _appendResponder(responder, 'hold',
                self.oneAgentAPI.server.hold(interactionLegID));
        }

        function alternate(interactionLegID, responder) {
            _startOperation('alternate');
            _appendResponder(responder, 'alternate',
                self.oneAgentAPI.server.alternate(interactionLegID));
        }

        function conference(interactionLegID, responder) {
            _startOperation('conference');
            _appendResponder(responder, 'conference',
                self.oneAgentAPI.server.conference(interactionLegID));
        }

        function retrieve(interactionLegID, responder) {
            _startOperation('retrieve');
            _appendResponder(responder, 'retrieve',
                self.oneAgentAPI.server.retrieve(interactionLegID));
        }

        function extendAudio(toAddress, outgoingAddress, responder) {
            _startOperation('extend');
            _appendResponder(responder, 'extend',
                self.oneAgentAPI.server.extend(null, toAddress, 4201, outgoingAddress));
        }

        function extendVideo(toAddress, outgoingAddress, responder) {
            _startOperation('extend');
            _appendResponder(responder, 'extend',
                self.oneAgentAPI.server.extend(null, toAddress, 4202, outgoingAddress));
        }

        function hangup(interactionLegID, responder) {
            _startOperation('hangup');
            _appendResponder(responder, 'hangup',
                self.oneAgentAPI.server.hangup(interactionLegID));
        }

        function signIn(serviceID, responder) {
            _startOperation('signIn');
            _appendResponder(responder, 'signIn',
                self.oneAgentAPI.server.signIn(serviceID));
        }

        function signOut(serviceID, responder) {
            _startOperation('signOut');
            _appendResponder(responder, 'signOut',
                self.oneAgentAPI.server.signOut(serviceID));
        }

        function signInAll(responder) {
            _startOperation('signInAll');
            _appendResponder(responder, 'signInAll',
                self.oneAgentAPI.server.signInAll());
        }

        function signOutAll(responder) {
            _startOperation('signOutAll');
            _appendResponder(responder, 'signOutAll',
                self.oneAgentAPI.server.signOutAll());
        }

        function setReadyAll(responder) {
            _startOperation('setReadyAll');
            _appendResponder(responder, 'setReadyAll',
                self.oneAgentAPI.server.setReadyAll());
        }

        function setNotReadyAll(reasonID, responder) {
            _startOperation('setNotReadyAll');
            _appendResponder(responder, 'setNotReadyAll',
                self.oneAgentAPI.server.setNotReadyAll(reasonID));
        }

        function setReady(serviceID, responder) {
            _startOperation('setReady');
            _appendResponder(responder, 'setReady',
                self.oneAgentAPI.server.setReady(serviceID));
        }

        function setNotReady(serviceID, reasonID, responder) {
            _startOperation('setNotReady');
            _appendResponder(responder, 'setNotReady',
                self.oneAgentAPI.server.setNotReady(serviceID, reasonID));
        }

		function registerAppInstanceToken(token, type, responder) {
            _startOperation('registerAppInstanceToken');
            _appendResponder(responder, 'registerAppInstanceToken',
                self.oneAgentAPI.server.registerAppInstanceToken(token, type));
        }
        function terminateSession(agentSessionID, responder) {
            _startOperation('terminateSession');
            _appendResponder(responder, 'terminateSession',
                self.oneAgentAPI.server.terminateSession(agentSessionID));
        }

        function assignService(agentSessionID, serviceID, responder) {
            _startOperation('assignService');
            _appendResponder(responder, 'assignService',
                self.oneAgentAPI.server.assignService(agentSessionID, serviceID ? serviceID : -1));
        }

        function startRecord(interactionLegID, responder) {
            _startOperation('startRecord');
            _appendResponder(responder, 'startRecord',
                self.oneAgentAPI.server.startRecord(interactionLegID));
        }
        
        function stopRecord(interactionLegID, responder) {
            _startOperation('stopRecord');
            _appendResponder(responder, 'stopRecord',
                self.oneAgentAPI.server.stopRecord(interactionLegID));
        }

        function setInteractionLegContext(interactionLegID, data, responder) {
            _startOperation('setInteractionLegContext');
            _appendResponder(responder, 'setInteractionLegContext',
                self.oneAgentAPI.server.setInteractionLegContext(interactionLegID, data));
        }

        function setUserSessionContext(data, responder) {
            _startOperation('setUserSessionContext');
            _appendResponder(responder, 'setUserSessionContext',
                self.oneAgentAPI.server.setUserSessionContext(data));
        }

        function discardContact(agentSessionID, responder) {
            _startOperation('discardContact');
            _appendResponder(responder, 'discardContact',
                self.oneAgentAPI.server.discardContact(agentSessionID));
        }

        function rescheduleContact(agentSessionID, address, rescheduleDate, timeZone, preferredAgent, topPriority, addressTypeID, responder) {
            _startOperation('rescheduleContact');
            _appendResponder(responder, 'rescheduleContact',
                self.oneAgentAPI.server.rescheduleContact(agentSessionID, address, rescheduleDate, timeZone, preferredAgent, topPriority, addressTypeID));
        }

        function timeZoneValidation(date, contactTimeZone, serviceTimeZone, instanceTimeZone, responder) {
            _startOperation('timeZoneValidation');
            _appendResponder(responder, 'timeZoneValidation',
                self.oneAgentAPI.server.timeZoneValidation(date, contactTimeZone, serviceTimeZone, instanceTimeZone));
        }

        function getAgentSessionAddressTypes(agentSessionID, responder) {
            _startOperation('getAgentSessionAddressTypes');
            _appendResponder(responder, 'getAgentSessionAddressTypes',
                self.oneAgentAPI.server.getAgentSessionAddressTypes(agentSessionID));
        }

        function supervisorHelp(agentSessionID, responder) {
            _startOperation('supervisorHelp');
            _appendResponder(responder, 'supervisorHelp',
                self.oneAgentAPI.server.supervisorHelp(agentSessionID, 4200 /*Unknown*/));
        }

        function getBroadcastMessages(pageIndex, pageSize, sentStartDate, sentEndDate, expStartDate, expEndDate, information, warning, critical, expired, notExpired, text, responder) {
            _startOperation('getBroadcastMessages');
            _appendResponder(responder, 'getBroadcastMessages',
                self.oneAgentAPI.server.getBroadcastMessages(pageIndex, pageSize, sentStartDate, sentEndDate, expStartDate, expEndDate, information, warning, critical, expired, notExpired, text));
        }

        function getBusinessOutcomes(serviceID, responder) {
            _startOperation('getBusinessOutcomes');
            _appendResponder(responder, 'getBusinessOutcomes',
                self.oneAgentAPI.server.getBusinessOutcomes(serviceID));
        }

        function setBusinessOutcomes(agentSessionID, businessOutcomeID, responder) {
            _startOperation('setBusinessOutcomes');
            _appendResponder(responder, 'setBusinessOutcomes',
                self.oneAgentAPI.server.setBusinessOutcomes(agentSessionID, businessOutcomeID));
        }

        function screenRecordingRegistered(responder) {
            _startOperation('screenRecordingRegistered');
            _appendResponder(responder, 'screenRecordingRegistered',
                self.oneAgentAPI.server.screenRecordingRegistered());
        }

        function startScreenRecording(sessionID, responder) {
            _startOperation('startScreenRecording');
            _appendResponder(responder, 'startScreenRecording',
                self.oneAgentAPI.server.startScreenRecording(sessionID));
        }

        function stopScreenRecording(sessionID, responder) {
            _startOperation('stopScreenRecording');
            _appendResponder(responder, 'stopScreenRecording',
                self.oneAgentAPI.server.stopScreenRecording(sessionID));
        }

        function newEmail(address, serviceID, responder) {
            _startOperation('newEmail');
            _appendResponder(responder, 'newEmail',
                self.oneAgentAPI.server.newEmail(address, serviceID));
        }

        function accept(interactionLegID, responder) {
            _startOperation('accept');
            _appendResponder(responder, 'accept',
                self.oneAgentAPI.server.accept(interactionLegID));
        }

        function reply(interactionLegID, responder) {
            _startOperation('reply');
            _appendResponder(responder, 'reply',
                self.oneAgentAPI.server.reply(interactionLegID));
        }

        function replyAll(interactionLegID, responder) {
            _startOperation('replyAll');
            _appendResponder(responder, 'replyAll',
                self.oneAgentAPI.server.replyAll(interactionLegID));
        }

        function forward(interactionLegID, responder) {
            _startOperation('forward');
            _appendResponder(responder, 'forward',
                self.oneAgentAPI.server.forward(interactionLegID));
        }

        function transferEmail(interactionLegID, serviceID, responder) {
            _startOperation('transferEmail');
            _appendResponder(responder, 'transferEmail',
                self.oneAgentAPI.server.transferEmail(interactionLegID, serviceID));
        }

        function getShelfList(pageIndex, pageSize, type, comment, categoryID, serviceID, mediaType, contact, responder) {
            _startOperation('getShelfList');
            _appendResponder(responder, 'getShelfList',
                self.oneAgentAPI.server.getShelfList(pageIndex, pageSize, type, comment, categoryID, serviceID, mediaType, contact));
        }

        function getQueueList(pageIndex, pageSize, contact, serviceID, mediaType, responder) {
            _startOperation('getQueueList');
            _appendResponder(responder, 'getQueueList',
                self.oneAgentAPI.server.getQueueList(pageIndex, pageSize, contact, serviceID, mediaType));
        }

        function shelveSession(agentSessionID, comment, categoryID, privateShelf, reminderDate, responder) {
            _startOperation('shelveSession');
            _appendResponder(responder, 'shelveSession',
                self.oneAgentAPI.server.shelveSession(agentSessionID, comment, categoryID, privateShelf, reminderDate));
        }

        function pickup(sessionID, responder) {
            _startOperation('pickup');
            _appendResponder(responder, 'pickup',
                self.oneAgentAPI.server.pickup(sessionID));
        }
        
        function unShelve(sessionID, responder) {
            _startOperation('unShelve');
            _appendResponder(responder, 'unShelve',
                self.oneAgentAPI.server.unShelve(sessionID));
        }

        function enqueue(sessionID, responder) {
            _startOperation('enqueue');
            _appendResponder(responder, 'enqueue',
                self.oneAgentAPI.server.enqueue(sessionID));
        }

        function changeShelf(sessionID, comment, categoryID, privateShelf, reminderDate, responder) {
            _startOperation('changeShelf');
            _appendResponder(responder, 'changeShelf',
                self.oneAgentAPI.server.changeShelf(sessionID, comment, categoryID, privateShelf, reminderDate));
        }

        function pickupNext(mediaType, pickupAudioVideoCalls, responder) {
            _startOperation('pickupNext');
            _appendResponder(responder, 'pickupNext',
                self.oneAgentAPI.server.pickupNext(mediaType, pickupAudioVideoCalls));
        }

        function sendInstantMessage(interactionLegID, message, responder) {
            _startOperation('sendInstantMessage');
            _appendResponder(responder, 'sendInstantMessage',
                self.oneAgentAPI.server.sendInstantMessage(interactionLegID, message));
        }

        function sendStatusInstantMessage(interactionLegID, responder) {
            _startOperation('sendStatusInstantMessage');
            _appendResponder(responder, 'sendStatusInstantMessage',
                self.oneAgentAPI.server.sendStatusInstantMessage(interactionLegID));
        }

        function getInstantMessageHistory(interactionID, interactionLegID, responder) {
            _startOperation('getInstantMessageHistory');
            _appendResponder(responder, 'getInstantMessageHistory',
                self.oneAgentAPI.server.getInstantMessageHistory(interactionID, interactionLegID));
        }
        
        function getTransferServicesList(responder) {
            _startOperation('getTransferServicesList');
            _appendResponder(responder, 'getTransferServicesList',
                self.oneAgentAPI.server.getTransferServicesList());
        }


        function changeEmailProperty(id, property, text) {

            var object = new Object();
            object.type = property;
            object.text = text;

            try {
                $('#conversationMessageFrame' + id)[0].contentWindow.onPropertyChange(JSON.stringify(object));
            } catch (err) {
                $('#conversationMessageFrame' + id)[0].contentWindow.postMessage(JSON.stringify(object), "*");
            }
        }

        function done(interactionLegID, responder) {
            _startOperation('done');
            _appendResponder(responder, 'done',
                self.oneAgentAPI.server.done(interactionLegID));
        }

        function getKeyPerformanceIndicators(responder) {
            _startOperation('getKeyPerformanceIndicators');
            _appendResponder(responder, 'getKeyPerformanceIndicators',
                self.oneAgentAPI.server.getKeyPerformanceIndicators());
        }

        function registerToProxy(toRegister, responder) {
            _startOperation('registerToProxy');
            _appendResponder(responder, 'registerToProxy',
                self.oneAgentAPI.server.registerToProxy(toRegister));
        }

        function sendErrorLogs(error, responder) {
            _startOperation('sendErrorLogs');
            _appendResponder(responder, 'sendErrorLogs',
                self.oneAgentAPI.server.sendErrorLogs(error));
        }

        function utcNow() {
            var now = new Date();
            return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        }

        function getCurrentCallStateHelper(data) {
            if (data && data.UserSession) {
                if (data.UserSession.CurrentCall) {
                    var currentCall = data.UserSession.CurrentCall;
                    var iLegHistory = currentCall.InteractionLegHistory;
                    var callType = currentCall.CallTypeName;
                    var isEstablished = false;
                    var conDate = null;
                    var serviceName = null;
                    var callerNumber = null;
                    var clientServerOffset = 0;
                    var agentSessionID = null;
                    var contact = null;
                    var stateDate = null;
                    var agentState = null;

                    var aSession = data.UserSession.CurrentAgentSession;
                    var scriptUrl = null;
                    if (aSession) {
                        serviceName = aSession.ServiceName;
                        agentSessionID = aSession.AgentSessionID;
                        contact = aSession.Contact;
                        scriptUrl = aSession.ScriptUrl;
                        //agentState = 
                    }

                    if (iLegHistory) {
                        $.each(iLegHistory, function (index, value) {
                            var evName = '' + value.EventName;

                            switch (evName) {
                                case 'CallConnected':
                                    if (isEstablished) {
                                        stateDate = null;
                                    } else {
                                        conDate = new Date(value.UTCOperationDate);
                                        isEstablished = true;
                                    }
                                    break;
                                case 'CallDisconnected':
                                    isEstablished = false;
                                    if (data.Agent.AgentStateName === 'Wrapup') {
                                        stateDate = new Date(value.UTCOperationDate);
                                    } else {
                                        stateDate = null;
                                    }
                                    break;

                                case 'CallHeld':
                                    stateDate = new Date(value.UTCOperationDate);
                                    break;
                            }
                        });
                    }

                    if (callType) {
                        if ('Inbound' === callType) {
                            callerNumber = currentCall.CallerNumber;
                        } else {
                            callerNumber = currentCall.CalledNumber;
                        }

                        if (isEstablished && conDate) {
                            clientServerOffset = utcNow() - new Date(data.UTCOperationDate) - currentCall.ServerTimeOffset;
                        }
                    }

                    return {
                        'InteractionLegID': currentCall.InteractionLegID,
                        'AgentSessionID': agentSessionID,
                        'CallState': currentCall.CallStateName,
                        'CallMode': currentCall.CallModeName,
                        'Contact': contact,
                        'CallType': callType,
                        'IsEstablished': isEstablished,
                        'Call': currentCall,
                        'CanDo': {
                            'Call': currentCall ? currentCall.CanDo : null,
                            'Session': aSession ? aSession.CanDo : null
                        },
                        'CallerNumber': callerNumber,
                        'ServiceName': serviceName,
                        'UTCOperationDate': conDate,
                        'UTCStateDate': stateDate,
                        'ClientServerTimeOffset': clientServerOffset,
                        'ScriptUrl': scriptUrl
                    };
                }
            }

            return null;
        }

        return {
            //Properties
            'getCurrentSessionID': getCurrentSessionID,
            'getConnectionID': getConnectionID,
            'getIsMaster': getIsMaster,
            'getIsInitialized': getIsInitialized,
            'setPath': setPath,

            //Operations
            'setInstance': setInstance,
            'initialize': initialize,
            'bindEvent': bindEvent,
            'dispatchLocalEvent': dispatchLocalEvent,

            //Context information
            'recoverAgentLogin': recoverAgentLogin,
            'setUserSessionContext': setUserSessionContext,
            'setInteractionLegContext': setInteractionLegContext,

            //HeartBeat
            'heartBeat': heartBeat,

            //Helpers
            'utcNow': utcNow,
            'getCurrentCallStateHelper': getCurrentCallStateHelper,

            //OneAgent operations

            'accept': accept,

            'supervisorHelp': supervisorHelp,
            'getAgentSessionAddressTypes': getAgentSessionAddressTypes,
            'discardContact': discardContact,
            'rescheduleContact': rescheduleContact,
            'timeZoneValidation': timeZoneValidation,
            'isUserAuthenticated': isUserAuthenticated,
            'setMasterConnection': setMasterConnection,
            'checkInstance': checkInstance,
            'login': login,
            'changePassword': changePassword,
            'setExtension': setExtension,
            'getUserSessionState': getUserSessionState,
            'requestWrapup': requestWrapup,
            'endWrapup': endWrapup,
            'extendAudio': extendAudio,
            'extendVideo': extendVideo,
            'alternate': alternate,
            'conference': conference,
            'logout': logout,
            'forceLogout': forceLogout,
            'dialAudio': dialAudio,
            'dialVideo': dialVideo,
            'dialAudioInSession': dialAudioInSession,
            'dialVideoInSession': dialVideoInSession,
            'redialSession': redialSession,
            'hold': hold,
            'blindTransfer': blindTransfer,
            'transfer': transfer,
            'retrieve': retrieve,
            'hangup': hangup,
            'signIn': signIn,
            'signOut': signOut,
            'signInAll': signInAll,
            'signOutAll': signOutAll,
            'setReadyAll': setReadyAll,
            'setNotReadyAll': setNotReadyAll,
            'setReady': setReady,
            'setNotReady': setNotReady,
            'terminateSession': terminateSession,
            'assignService': assignService,
            'startRecord': startRecord,
            'stopRecord': stopRecord,
            'getBroadcastMessages': getBroadcastMessages,
            'getBusinessOutcomes': getBusinessOutcomes,
            'setBusinessOutcomes': setBusinessOutcomes,
            'screenRecordingRegistered': screenRecordingRegistered,
            'startScreenRecording': startScreenRecording,
            'stopScreenRecording': stopScreenRecording,
			'registerAppInstanceToken': registerAppInstanceToken,

            //Email and Message Operations

            'newEmail': newEmail,
            'reply': reply,
            'replyAll': replyAll,
            'forward': forward,
            'transferEmail': transferEmail,
            'getTransferServicesList': getTransferServicesList,

            'changeEmailProperty': changeEmailProperty,

            'done': done,

            //PickUp and Shelf

            'getShelfList': getShelfList,
            'getQueueList': getQueueList,
            'shelveSession': shelveSession,
            'pickup': pickup,
            'unShelve': unShelve,
            'enqueue': enqueue,
            'changeShelf': changeShelf,
            'pickupNext': pickupNext,
            
            //IM

            'sendInstantMessage': sendInstantMessage,
            'sendStatusInstantMessage': sendStatusInstantMessage,
            'getInstantMessageHistory': getInstantMessageHistory,

            //KPIs
            'getKeyPerformanceIndicators': getKeyPerformanceIndicators,

            //RegisterToProxy
            'registerToProxy' : registerToProxy,

            //Logs
            'sendErrorLogs': sendErrorLogs


        };
    } (jQuery.connection));
} (window.jQuery));