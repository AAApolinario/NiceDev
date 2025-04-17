var _BettaCTI_SDK_API;
var BettaCTIWS;
var isInitialize = false;

/**
 * Represents the API Object.
 * @returns {BettaCTISDK} SDK Object to make the requests
 * Version: 2.6
 * Author: Dênis Moreira
 */
function getBettaCTIAPI() {

    _BettaCTI_SDK_API = new BettaCTISDK();

    if (window.addEventListener) {
        addEventListener("message", _BettaCTI_SDK_API.listener, false);
    } else {
        document.attachEvent("onmessage", _BettaCTI_SDK_API.listener);
    }
    return _BettaCTI_SDK_API;
}

/**
 * BettaCTISDK Object 
 * @constructor 
 */
var BettaCTISDK = function () {

    var guid;

    var onBettaCTIOpen;
    var onBettaCTIClose;
    var onBettaCTIError;

    var blnBettaCTIWS = false;

    var onUserSessionState;

    var OnCallback;

    var OnHold;

    var OnTransferCall;

    var OnConsultationCall;

    var OnGetAgentState;

    var OnGetCallInformation;

    var OnEstablished;

    var OnDelivered;

    var OnConnectionCleared;

    var OnCallDisconnected;

    var OnRetrieved;

    var OnTransferred;

    var OnAnswerCall;

    var OnAgentReady;

    var OnAgentNotReady;

    var OnAgentLogged;

    var OnOriginated;

    var OnMakeCall;
	var OnMakecallagent;
	var OnMakecallskill;

    var OnLogout;

    var OnWrapup;

    var OnFailed;

    var OnKeepAlive;

    var OnIncomingChat;
    var OnDeliveredChat;
    var OnHistoricalChatTranscript;
    var OnMessageChat;
    var OnDisconnectedChat;

    var OnGetSkills;
    var OnGetTeamPauseReason;
    var OnGetAddressbook;

    var CSTAErrorCode;



    register();

    //
    //Conexão com Driver de integração Local através de Web Socket

    var loginobj = new Object();

    //-------------------------------------------------------------------------------
    // Public methods
    //-------------------------------------------------------------------------------
    /**
     * Get User Session State
     */
    function getUserSessionState() {

        var object = new Object();
        object.type = "getUserSessionState";
        object.guid = guid;

        sendApiRequest(object);

    }

    function login(username, agentPWD, server) {

        loginobj.type = "login";
        loginobj.guid = guid;

        loginobj.username = username;
        loginobj.agentPWD = agentPWD;
		
        isInitialize = false;
        try {
            if (BettaCTIWS.readyState == 1) {
                isInitialize = true;
            }
        } catch (err) {
            console.log('BettaCTIWS', err.message)
        }

        if (server && isInitialize == false) {
            serverInit(server);
            setTimeout(function () { sendApiRequest(loginobj) }, 3000);
        }
        else {
            sendApiRequest(loginobj);
        }
    }


    function serverInit(server) {
        BettaCTIWS = new WebSocket(server);

        // open a SECURE BettaDriverWS to the Web Socket server
        // When the BettaDriverWS is open
        BettaCTIWS.onopen = function () {
            //console.log('onBettaDriverOpen');
            var result = '{"type":"onBettaDriverOpen"}';
            result = JSON.parse(result);
            _BettaCTI_SDK_API.onBettaDriverOpen(result);
            isInitialize = true;
        };

        // when the BettaDriverWS is closed by the server
        BettaCTIWS.onclose = function () {
            //console.log('onBettaDriverClose');
            blnBettaCTIWS = false;
            isInitialize = false;
            var result = '{"type":"onBettaDriverClose"}';
            result = JSON.parse(result);
            _BettaCTI_SDK_API.onBettaDriverClose(result);
        };

        // Log errors
        BettaCTIWS.onerror = function (e) {
            blnBettaCTIWS = false;
            isInitialize = false;
            //console.log('onBettaDriverError');
            var result = '{"type":"onBettaDriverError"}';
            result = JSON.parse(result);
            _BettaCTI_SDK_API.onBettaDriverError();
        };

        // Log messages from the server
        BettaCTIWS.onmessage = function (e) {
            //console.log('Received ' + e.data);
            listener(e);
            _BettaCTI_SDK_API.onBettaDriverMessage(e);
        };

        BettaCTIWS.addEventListener('error', function (event) {
            console.log('WebSocket error: ', event);
        });
    }

    function logout() {

        var object = new Object();
        object.type = "logout";
        object.guid = guid;

        console.log('Logout');

        sendApiRequest(object);
    }

    function endwrapup() {

        var object = new Object();
        object.type = "endwraup";
        object.guid = guid;

        object.agentSessionID = agentSessionID;

        sendApiRequest(object);
    }

    function makecall(toaddress,skillId,parentContactId) {
		var object = new Object();
        object.type = "makecall";
        object.guid = guid;
        object.toaddress = toaddress;
		object.skillid = skillId;
		object.parentContactid = parentContactId;
        sendApiRequest(object);
    }
	
	function makecallagent(targetagentid,parentcontactid) {
	
		var object = new Object();
        object.type = "makecallagent";
        object.guid = guid;
        object.targetagentid = targetagentid;
		object.parentcontactid = parentcontactid;
        sendApiRequest(object);
    }
	
	function makecallskill(skillid,parentcontactid) {
	
		var object = new Object();
        object.type = "makecallskill";
        object.guid = guid;
        object.skillid = skillid;
		object.parentcontactid = parentcontactid;
        sendApiRequest(object);
    }

    function callbackstart(toaddress) {

        var object = new Object();
        object.type = "callbackstart";
        object.guid = guid;
        object.toaddress = toaddress;
        sendApiRequest(object);
    }

    function callbackcancel(reason) {

        var object = new Object();
        object.type = "callbackcancel";
        object.guid = guid;
        object.reason = reason;
        sendApiRequest(object);
    }
    function hangup() {

        var object = new Object();
        object.type = "hangup";
        object.guid = guid;
        sendApiRequest(object);
    }

    function transfercall(toaddress) {
        var object = new Object();
        object.type = "transfercall";
        object.guid = guid;
        object.toaddress = toaddress;
        sendApiRequest(object);
    }

    function transfer() {
        var object = new Object();
        object.type = "transfercall";
        object.toaddress = "";
        object.guid = guid;
        sendApiRequest(object);
    }

    function hold() {
        var object = new Object();
        object.type = "hold";
        object.guid = guid;
        sendApiRequest(object);
    }

    function conference() {
        var object = new Object();
        object.type = "conference";
        object.guid = guid;

        sendApiRequest(object);
    }

    function retrieve() {
        var object = new Object();
        object.type = "retrieve";
        object.guid = guid;
        sendApiRequest(object);
    }

    function answer() {
        var object = new Object();
        object.type = "answer";
        object.guid = guid;
        sendApiRequest(object);
    }

    function consultationcall(toaddress) {
        var object = new Object();
        object.type = "consultationcall";
        object.guid = guid;
        object.toaddress = toaddress;
        sendApiRequest(object);
    }

    function ready() {
        var object = new Object();
        object.type = "ready";
        object.guid = guid;
        sendApiRequest(object);
    }

    function pause(reasonID) {
        var object = new Object();
        object.type = "pause";
        object.guid = guid;

        object.reasonID = reasonID;

        sendApiRequest(object);
    }

    function acceptchat(ContactId) {
        var object = new Object();
        object.type = "acceptchat";
        object.contactid = ContactId;
        object.guid = guid;
        sendApiRequest(object);
    }

    function sendchat(ContactId, Text) {
        var object = new Object();
        object.type = "sendchat";
        object.contactid = ContactId;
        object.text = Text;
        object.guid = guid;
        sendApiRequest(object);
    }

    function endchat(ContactId, Reason) {
        var object = new Object();
        object.type = "endchat";
        object.contactid = ContactId;
        object.guid = guid;
        object.reason = Reason;
        sendApiRequest(object);
    }

    function historicalchat(ContactId, RoomId) {
        var object = new Object();
        object.type = "historicalchat";
        object.contactid = ContactId;
        object.roomid = RoomId;
        object.guid = guid;
        sendApiRequest(object);
    }

    function transferchatskill(ContactId, targetskillid) {
        var object = new Object();
        object.type = "transferchatskill";
        object.contactid = ContactId;
        object.guid = guid;
        object.targetskillid = targetskillid;
        sendApiRequest(object);
    }


    function mute() {

        var object = new Object();
        object.type = "mute";
        object.guid = guid;
        sendApiRequest(object);
    }

    function unmute() {

        var object = new Object();
        object.type = "unmute";
        object.guid = guid;
        sendApiRequest(object);
    }

    function disposition(CallContactID, DispositionID) {
        var object = new Object();
        object.type = "disposition";
        object.guid = guid;
        object.dispositionid = DispositionID;
        object.contactid = CallContactID;
        sendApiRequest(object);
    }

    function setBusinessOutcomes(ID) {
        var object = new Object();
        object.type = "setBusinessOutcomes";
        object.guid = guid;

        object.serviceID = serviceID;

        sendApiRequest(object);
    }

    function signal(ContactId, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        var object = new Object();
        object.type = "signal";
        object.contactid = ContactId;
        object.guid = guid;
        object.p1 = p1;
        object.p2 = p2;
        object.p3 = p3;
        object.p4 = p4;
        object.p5 = p5;
        object.p6 = p6;
        object.p7 = p7;
        object.p8 = p8;
        object.p9 = p9;
        sendApiRequest(object);
    }

    function ctiacceptconsult(ContactId) {
        var object = new Object();
        object.type = "ctiacceptconsult";
        object.contactid = ContactId;
        object.guid = guid;
        sendApiRequest(object);
    }

    function ctisenddtmf(dtmfSequence) {
        var object = new Object();
        object.type = "ctisenddtmf";
        object.dtmfsequence = dtmfSequence;
        object.guid = guid;
        sendApiRequest(object);
    }

    function getskills() {
        var object = new Object();
        object.type = "getskills";
        object.guid = guid;
        sendApiRequest(object);
    }
	
	function getskills(byagent) {
        var object = new Object();
        object.type = "getskills";
		object.byagent = byagent;
        object.guid = guid;
        sendApiRequest(object);
    }

    function getteampausereason() {
        var object = new Object();
        object.type = "getteampausereason";
        object.guid = guid;
        sendApiRequest(object);
    }

    function getaddressbook() {
        var object = new Object();
        object.type = "getaddressbook";
        object.guid = guid;
        sendApiRequest(object);
    }

    function keepalive() {
        var object = new Object();
        object.type = "keepalive";
        object.guid = guid;
        sendApiRequest(object);
    }

    //-------------------------------------------------------------------------------
    // Auxiliary methods
    //-------------------------------------------------------------------------------

    function register() {

        this.guid = guidGenerator();

        var client = new Object();
        client.type = "newClient";
        client.guid = guid;

        //sendApiRequest(client);

    }

    function guidGenerator() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function listener(event) {

        //console.log("%% BettaCTISDK  listener ", event);
        var strdata = String.raw`${event.data}`;
        strdata = strdata.replaceAll("\\", "\\\\")

        if (/^[\],:{}\s]*$/.test(strdata.toString().replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            var result = JSON.parse(strdata);
            //console.log("%% BettaCTISDK (2) result ", result);
            if (result.guid == guid) {
                //console.log("%% BettaCTISDK  (3) result ", result);
                switch (result.type) {
                    case "OnHold":
                        if (_BettaCTI_SDK_API.OnHold !== undefined)
                            _BettaCTI_SDK_API.OnHold(result);
                        break;
                    case "OnCallDisconnected":
                        if (_BettaCTI_SDK_API.OnCallDisconnected !== undefined)
                            _BettaCTI_SDK_API.OnCallDisconnected(result);
                        break;
                    case "OnConnectionCleared":
                        if (_BettaCTI_SDK_API.OnConnectionCleared !== undefined)
                            _BettaCTI_SDK_API.OnConnectionCleared(result);
                        break;
                    case "OnCallback":
                        if (_BettaCTI_SDK_API.OnCallback !== undefined)
                            _BettaCTI_SDK_API.OnCallback(result);
                        break;
                    case "OnRetrieved":
                        if (_BettaCTI_SDK_API.OnRetrieved !== undefined)
                            _BettaCTI_SDK_API.OnRetrieved(result);
                        break;
                    case "OnTransferred":
                        if (_BettaCTI_SDK_API.OnTransferred !== undefined)
                            _BettaCTI_SDK_API.OnTransferred(result);
                        break;
                    case "OnAnswerCall":
                        if (_BettaCTI_SDK_API.OnAnswerCall !== undefined)
                            _BettaCTI_SDK_API.OnAnswerCall(result);
                        break;
                    case "OnAgentReady":
                        if (_BettaCTI_SDK_API.OnAgentReady !== undefined)
                            _BettaCTI_SDK_API.OnAgentReady(result);
                        break;
                    case "OnAgentLogged":
                        if (_BettaCTI_SDK_API.OnAgentLogged !== undefined)
                            _BettaCTI_SDK_API.OnAgentLogged(result);
                        break;
                    case "OnOriginated":
                        if (_BettaCTI_SDK_API.OnOriginated !== undefined)
                            _BettaCTI_SDK_API.OnOriginated(result);
                        break;
                    case "OnFailed":
                        if (_BettaCTI_SDK_API.OnFailed !== undefined)
                            _BettaCTI_SDK_API.OnFailed(result);
                        break;
                    case "OnTransferCall":
                        if (_BettaCTI_SDK_API.OnTransferCall !== undefined)
                            _BettaCTI_SDK_API.OnTransferCall(result);
                        break;
                    case "OnConsultationCall":
                        if (_BettaCTI_SDK_API.OnConsultationCall !== undefined)
                            _BettaCTI_SDK_API.OnConsultationCall(result);
                        break;
                    case "OnMakeCall":
                        if (_BettaCTI_SDK_API.OnMakeCall !== undefined)
                            _BettaCTI_SDK_API.OnMakeCall(result);
                        break;
                    case "OnEstablished":
                        if (_BettaCTI_SDK_API.OnEstablished !== undefined)
                            _BettaCTI_SDK_API.OnEstablished(result);
                        break;
                    case "OnGetCallInformation":
                        if (_BettaCTI_SDK_API.OnGetCallInformation !== undefined)
                            _BettaCTI_SDK_API.OnGetCallInformation(result);
                        break;
                    case "OnDelivered":
                        if (_BettaCTI_SDK_API.OnDelivered !== undefined)
                            _BettaCTI_SDK_API.OnDelivered(result);
                        break;
                    case "OnLogout":
                        if (_BettaCTI_SDK_API.OnLogout !== undefined)
                            _BettaCTI_SDK_API.OnLogout(result);
                        break;
                    case "OnGetAgentState":
                        if (_BettaCTI_SDK_API.OnGetAgentState !== undefined)
                            _BettaCTI_SDK_API.OnGetAgentState(result);
                        break;
                    case "OnWrapup":
                        if (_BettaCTI_SDK_API.OnWrapup !== undefined)
                            _BettaCTI_SDK_API.OnWrapup(result);
                        break;
                    case "onBettaCTIOpen":
                        if (_BettaCTI_SDK_API.onBettaCTIOpen !== undefined)
                            _BettaCTI_SDK_API.onBettaCTIOpen(result);
                        break;
                    case "onBettaCTIError":
                        if (_BettaCTI_SDK_API.onBettaCTIError !== undefined)
                            _BettaCTI_SDK_API.onBettaCTIError(result);
                        break;
                    case "OnAgentNotReady":
                        if (_BettaCTI_SDK_API.OnAgentNotReady !== undefined)
                            _BettaCTI_SDK_API.OnAgentNotReady(result);
                        break;
                    case "OnKeepAlive":
                        if (_BettaCTI_SDK_API.OnKeepAlive !== undefined)
                            _BettaCTI_SDK_API.OnKeepAlive(result);
                        break;
                    case "OnIncomingChat":
                        if (_BettaCTI_SDK_API.OnIncomingChat !== undefined)
                            _BettaCTI_SDK_API.OnIncomingChat(result);
                        break;
                    case "OnDeliveredChat":
                        if (_BettaCTI_SDK_API.OnDeliveredChat !== undefined)
                            _BettaCTI_SDK_API.OnDeliveredChat(result);
                        break;
                    case "OnHistoricalChatTranscript":
                        if (_BettaCTI_SDK_API.OnHistoricalChatTranscript !== undefined)
                            _BettaCTI_SDK_API.OnHistoricalChatTranscript(result);
                        break;
                    case "OnMessageChat":
                        if (_BettaCTI_SDK_API.OnMessageChat !== undefined)
                            console.log("TESTE RESULT:");
                        console.log(result);
                        _BettaCTI_SDK_API.OnMessageChat(result);
                        break;
                    case "OnDisconnectedChat":
                        if (_BettaCTI_SDK_API.OnDisconnectedChat !== undefined)
                            _BettaCTI_SDK_API.OnDisconnectedChat(result);
                        break;
                    case "OnGetSkills":
                        if (_BettaCTI_SDK_API.OnGetSkills !== undefined)
                            _BettaCTI_SDK_API.OnGetSkills(result);
                        break;
                    case "OnGetTeamPauseReason":
                        if (_BettaCTI_SDK_API.OnGetTeamPauseReason !== undefined)
                            _BettaCTI_SDK_API.OnGetTeamPauseReason(result);
                        break;
                    case "OnGetAddressbook":
                        if (_BettaCTI_SDK_API.OnGetAddressbook !== undefined)
                            _BettaCTI_SDK_API.OnGetAddressbook(result);
                        break;
                    case "CSTAErrorCode":
                        if (_BettaCTI_SDK_API.CSTAErrorCode !== undefined)
                            _BettaCTI_SDK_API.CSTAErrorCode(result);
                        break;
					case "makecallagent":
                        if (_BettaCTI_SDK_API.OnMakecallagent !== undefined)
                            _BettaCTI_SDK_API.OnMakecallagent(result);
                        break;
					case "makecallskill":
                        if (_BettaCTI_SDK_API.OnMakecallskill !== undefined)
                            _BettaCTI_SDK_API.OnMakecallskill(result);
                        break;
                    default:
                        //console.log("%% BettaCTISDK %% listener invalid type:", result.type);
                        break;
                }
            } else {
                console.log("%% BettaCTISDK %% Not for this client");
            }


        }

    }

    function sendApiRequest(object) {

        //console.log("sendApiRequest " + JSON.stringify(object));
        //window.parent.postMessage(JSON.stringify(object), "*");
        try {
            BettaCTIWS.send(JSON.stringify(object));
        }
        catch (err) {
            read_login();
        }
    }

    //-------------------------------------------------------------------------------
    // Available methods
    //-------------------------------------------------------------------------------

    return {
        'login': login,
        'logout': logout,
        'getUserSessionState': getUserSessionState,
        'endwrapup': endwrapup,
        'conference': conference,
        'hold': hold,
        'answer': answer,
        'transfer': transfer,
        'retrieve': retrieve,
        'hangup': hangup,
        'ready': ready,
        'pause': pause,
        'hangup': hangup,
        'makecall': makecall,
        'consultationcall': consultationcall,
        'transfercall': transfercall,
        'transferchatskill': transferchatskill,
        'callbackstart': callbackstart,
        'callbackcancel': callbackcancel,
        'disposition': disposition,
        'mute': mute,
        'unmute': unmute,
        'signal': signal,
        'ctisenddtmf': ctisenddtmf,
        'ctiacceptconsult': ctiacceptconsult,
        'getskills': getskills,
        'getteampausereason': getteampausereason,
        'getaddressbook': getaddressbook,
        'keepalive': keepalive,
        //chat
        'acceptchat': acceptchat,
        'sendchat': sendchat,
        'endchat': endchat,
        'historicalchat': historicalchat,
        //Listener
        'listener': listener,
        //Events
        'onBettaCTIOpen': onBettaCTIOpen,
        'onBettaCTIClose': onBettaCTIClose,
        'onBettaCTIError': onBettaCTIError,
        'onUserSessionState': onUserSessionState,

        'OnCallback': OnCallback,
        'OnHold': OnHold,
        'OnTransferCall': OnTransferCall,
        'OnConsultationCall': OnConsultationCall,
        //'OnGetAgentState':OnGetAgentState,
        'OnGetCallInformation': OnGetCallInformation,
        'OnDelivered': OnDelivered,
        'OnEstablished': OnEstablished,
        'OnConnectionCleared': OnConnectionCleared,
        'OnRetrieved': OnRetrieved,
        'OnTransferred': OnTransferred,
        'OnAnswerCall': OnAnswerCall,
        'OnAgentLogged': OnAgentLogged,
        'OnAgentReady': OnAgentReady,
        'OnAgentNotReady': OnAgentNotReady,
        'CSTAErrorCode': CSTAErrorCode,
        'OnOriginated': OnOriginated,
        'OnFailed': OnFailed,
        'OnMakeCall': OnMakeCall,
        'OnLogout': OnLogout,
        'OnWrapup': OnWrapup,
        'OnKeepAlive': OnKeepAlive,
        'OnCallDisconnected': OnCallDisconnected,
        'OnIncomingChat': OnIncomingChat,
        'OnDeliveredChat': OnDeliveredChat,
        'OnHistoricalChatTranscript': OnHistoricalChatTranscript,
        'OnMessageChat': OnMessageChat,
        'OnDisconnectedChat': OnDisconnectedChat,
        'OnGetSkills': OnGetSkills,
        'OnGetTeamPauseReason': OnGetTeamPauseReason,
        'OnGetAddressbook': OnGetAddressbook,
		'makecallagent': OnMakecallagent,
		'makecallskill': OnMakecallskill,
    };
}