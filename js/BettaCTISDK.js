var _BettaCTI_SDK_API;
var BettaCTIWS;
var isInitialize = false;

/**
 * Represents the API Object.
 * @returns {BettaCTISDK} SDK Object to make the requests
 * Version: 2.1
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
	
	var OnRetrieved;
	
	var OnTransferred;
	
	var OnAnswerCall;
	
	var OnAgentReady;
	
	var OnAgentNotReady;
	
	var OnAgentLogged;
	
	var OnOriginated;
	
	var OnMakeCall;
	
	var OnLogout;
	
	var OnWrapup;
	
	var OnFailed;
	
	var OnKeepAlive;
	
	var CSTAErrorCode;
	
	
	
	register();
	
	//
	//Conexão com Driver de integração Local através de Web Socket
	//serverInit('wss://ctigateway.c2x.com.br/bettactiweb/bettacti.svc?Instance=avaya');
	
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

    function login(agentID, agentPWD, extension, server, instance) {
	
        loginobj.type = "login";
        loginobj.guid = guid;
        loginobj.agentID = agentID;
        loginobj.agentPWD = agentPWD;
        loginobj.extension = extension;
		loginobj.instance = instance;
		
		if (server.length>0 && isInitialize ==false)
		{
			serverInit(server);
			setTimeout(function(){sendApiRequest(loginobj)},3000);
		} 
		else
		{
			sendApiRequest(loginobj);
		}
    }

	function serverInit(server)
	{
		BettaCTIWS = new WebSocket(server);
		
		// open a SECURE BettaDriverWS to the Web Socket server
		// When the BettaDriverWS is open
		BettaCTIWS.onopen = function () {
			console.log('onBettaDriverOpen');
			if (!blnBettaCTIWS)
			{
				//console.log('OnLogin');
				//sendApiRequest(loginobj);
				
			}
			var result = '{"type":"onBettaDriverOpen"}';
			result = JSON.parse(result);
			_BettaCTI_SDK_API.onBettaDriverOpen(result);
			isInitialize = true;
		};

		
		
		// when the BettaDriverWS is closed by the server
		BettaCTIWS.onclose = function () {
			console.log('onBettaDriverClose');
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
			console.log('onBettaDriverError');
			var result = '{"type":"onBettaDriverError"}';
			result = JSON.parse(result);
			_BettaCTI_SDK_API.onBettaDriverError();
		};

		// Log messages from the server
		BettaCTIWS.onmessage = function (e) {
			console.log('Received ' + e.data);
			listener(e);
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

    function makecall(toaddress) {
	
		var object = new Object();
        object.type = "makecall";
        object.guid = guid;
        object.toaddress = toaddress;
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

    function setBusinessOutcomes(ID) {
        var object = new Object();
        object.type = "setBusinessOutcomes";
        object.guid = guid;

        object.serviceID = serviceID;

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
		var strdata = event.data;

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
                    case "CSTAErrorCode":
                        if (_BettaCTI_SDK_API.CSTAErrorCode !== undefined)
                            _BettaCTI_SDK_API.CSTAErrorCode(result);
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
		BettaCTIWS.send(JSON.stringify(object));
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
		'answer':answer,
        'transfer': transfer,
        'retrieve': retrieve,
        'hangup': hangup,
        'ready': ready,
        'pause': pause,
		'hangup': hangup,
		'makecall':makecall,
		'consultationcall':consultationcall,
		'transfercall':transfercall,
		'callbackstart':callbackstart,
		'callbackcancel':callbackcancel,		
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
		'OnGetAgentState':OnGetAgentState,
		'OnGetCallInformation':OnGetCallInformation,
		'OnDelivered':OnDelivered,
		'OnEstablished':OnEstablished,
		'OnConnectionCleared':OnConnectionCleared,
		'OnRetrieved':OnRetrieved,
		'OnTransferred':OnTransferred,
		'OnAnswerCall':OnAnswerCall,
		'OnAgentLogged':OnAgentLogged,
		'OnAgentReady':OnAgentReady,
		'OnAgentNotReady':OnAgentNotReady,
		'CSTAErrorCode':CSTAErrorCode,
		'OnOriginated':OnOriginated,
		'OnFailed':OnFailed,
		'OnMakeCall':OnMakeCall,
		'OnLogout':OnLogout,
		'OnWrapup': OnWrapup,
		'OnKeepAlive': OnKeepAlive,
    };
}