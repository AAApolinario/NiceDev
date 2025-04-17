let blnsforce = false;
let blnDynamics = true;
var contentTextBoth;
var formdocument;
var jsonfile;

var OptionsChatTransfer;
var TimerTeste;

$(document).ready(function() {
	//Tela inicial
	read_login();
	Initialize();
	cti.init();
	formdocument = document.getElementById("formchat");

	fetch('RemoteConfig.json').then(results => results.json()).then(function(response) {
		jsonfile = response;	
		TransferChatList();
	})
});

var ContactID;
var CallContactID;

var api = new getBettaCTIAPI();
var callconnected = false;
var strpositivacao = '';
var startpositivacao = false;
var startmakecall = false;
var blnscreenpop = false;
var strhtmluui = '';
var intHeight = 520;

var strPause='';
var strPauseReason;
var strDisposition;
var strMatrizTransf;
//Configuration Call Center
var pageOnAccounts;
var OpenCTIOnCall;
var clickToDialEnabled = false;
var currentCreatedTaskId;
var startDate;
var endDate;
var stragentName;
var strreason;
var localPause = false;
var ChatAtivo = false;

//
var reqScreenpopupAccount;
var reqScreenpopupTask;
var reqScreenpopupCase;
var reqScreenpopupLead;
var reqScreenpopupField;
var reqPageOnNoAccounts;
var reqLayoutUUI;
var reqPauseReasons=[];
var reqDestinations=[];
var reqCTIConfigAES;
var reqCTIConfigAESPort;
var reqCTIConfigAESUser;
var reqCTIConfigAESPassword;
var reqCTIConfigCM;
var reqCTIConfigCMName;
var reqCTIConfigWS;
var reqCTIConfigPrefix='';;
var reqOpenCtiOnCall;
var reqSoftphoneHeight;

let strCNPJ = "";
let strContrato = "";
let strDDD = "";
let strconfsenha= "";
let strconfpositivacao= "";
let strProduto = "";
let strToken = "";
let strOrigem = "";
let UCID = "";
let UUI = "";
let strANI = "";

var timer = new easytimer.Timer();
var timerCallback = new easytimer.Timer();
var timerPause = new easytimer.Timer();
var TimerTimeout;


var callback = function(response) {
if (response.success) {
	//console.log('API method call executed successfully! returnValue:', response.returnValue);
} else { 
	console.error('Something went wrong! Errors:', response.errors);
}
};

//init()

class sCTI {
	constructor() {
		var self = this;
		self.searchPromise = new Promise(function (resolve, reject) {});
		var initiated = false;
	}
	
	init() {
		//console.log("cti init >>");
		var self = this;
		self.contactPromise = new Promise(function(resolve, reject) {});
		self.servicePrefixPromise = new Promise(function(resolve, reject) {});
	}

	ScreenPopUp(event)
	{
		//console.log('ScreenPopUp >>', event);
		
		if (blnDynamics)
		{	
			atender(event);

			/*var canceltoken = "cancellationtoken"+ Math.ceil(Math.random() * 100000 + 100000).toString();

			var input = {
                	templateName: "msdyn_chat_incoming_unauthenticated",
                	// unique name of the configured template
                	templateParameters: {
            	},
				// unique random token, to identify the notification during cancelEvent call
                cancellationToken: canceltoken
			}
			Microsoft.CIFramework.notifyEvent(input).then(
							function success(result) {
											atender(event);
											console.log(result);
											// Perform operations
							},
							function (error) {
											console.log(error.message);
											// Handle error conditions
							}
			);
			*/
		}
		if(event.hasOwnProperty('CalledDeviceId'))
		{
			//Volks buscar nas matrizes a Origem
			var VDN = event.CalledDeviceId;
			
		}
		
		UCID = event.UCID;
		var UUI = event.UUI;
		strANI = event.ANI;
		//console.log('ScreenPopUp <<');
	}
}
var cti = new sCTI();	
//

$(".hover-active.pausa-on").on('click',function(){
	PauseReason();
});

$("#TXT_AGENT_EXTENSION").keypress(function(event){
if(event.which == 13)
{
	Login();
}
});

function Initialize(){
	
	$("#main-panel").hide();
	$("#iconCheck").hide();
	$("#SCREEN-PAUSA").hide();
	$("#SCREEN-INCALL").hide();
	$("#SCREEN-TIMERPAUSE").hide();
	//NEW SCREEN CONFIG
	$("#SCREEN-CONFIG").hide();
	$("#div-spam-pause").hide();
	$("#div-out-pause").hide();
	$("#text-espera-on").hide();
	$("#SCREEN_TRANSFER").hide();
	$("#section-confirmar-transfer").hide();
	$("#div-spam-mute").hide();
	$("#div-spam-hold").hide();
	$("#SCREEN-TAB").hide();
	$("#formchat").hide();

	
	$("#frmDados").hide();
	$("#BT_ATENDIMENTO").hide();
	$("#BT_LOGOUT").hide();
	$("#BT_READY").hide();
	$("#BT_PAUSE").hide();
	$("#pausereason").hide();
	$("#BtAnswerCall").hide();
	$("#BtConference").hide();
	$("#BtDial").hide();
	$("#BtHangup").hide();
	$("#BtHold").hide();
	$("#BtRetrieve").hide();
	$("#BtTransfer").hide();
	$("#BtTransferOff").hide();
	$("#BtConferenceOff").hide();
	$("#BtWrapup").hide();
	$('#TXT_AGENT_DISPLAY').val("Deslogado");
	$('#TXT_AGENT_DISPLAY').hide();
	$('#BtPositivacao').hide();
	$("#TXT_AGENT_PASSWORD").hide();
	$("#TXT_AGENT_EXTENSION").hide();
	$("#lbllogin").show();
	$("#BtMute").hide();
	$("#BtUnMute").hide();
	$("#BtMutepoff").hide();

	//show
	//$("#BtDialoff").hide();
	$("#BtDialoff").hide();
	$("#BtDial").hide();
	
	$('#cti-attendance').hide();
	$('#pausa-on').hide();
	$('#pausa-off').hide();
	$('#tempochamada').hide();
	$('#TXT_MESSAGES').hide();
	$('#TXT_AGENT_NAME').val("");
	$('#TXT_AGENT_NAME').hide();
	$("#pausegrp").hide();
	$('#TXT_STATUS').hide();
	
	$("#desligado").hide();
	$("#status_phone").hide();
	$("#toolbar_phone").hide();
	//$("#toolbar_phone").hide();
	$("#status_omni").hide();
	$('#cliente-off').show();
	
	$("#questions_and_answers_off").hide();
	$("#questions_and_answers_on").hide();
	
	stragentName='';
	seltransf='';
	selreason = '';
	
}

api.CSTAErrorCode = function(event){
	//$('#TXT_MESSAGES').val("Login Error");
	//$('#TXT_MESSAGES').show();
	$("#BT_LOGIN").removeClass("slds-button_brand").addClass("slds-button_text-destructive");
	$("#BT_LOGIN").attr("title","Error no Login");
} 

api.OnAgentLogged = function(event){
	$('#TXT_MESSAGES').val("");
	$('#TXT_MESSAGES').hide();
} 


api.onBettaDriverOpen = function(event){
	$("#BT_LOGIN").prop( "disabled", false );
	read_login();
	//ConfigCTI();
} 
api.onBettaDriverClose = function(event){
	
	//Initialize();
	//Logout();
    $("#BT_LOGIN").prop( "disabled", true );
} 
api.onBettaDriverError = function(event){
	var strtype = event;
	console.log(strtype.type);
} 
/*api.OnConnectionCleared = function(event){
	var strtype = event;
	document.getElementById("CallPhoneNumberValue").innerHTML = '';
	sforce.opencti.setSoftphonePanelHeight({heightPX: reqSoftphoneHeight, callback: callback});
	
	$('#call-duration-count').html("00:00:00");
	$("#BT_LOGOUT").prop( "disabled", false );
	//console.log(strtype);
} 
*/
api.OnOriginated = function(event){
	//console.log("OnOriginated >> ",event.type, self.reqPageOnNoAccounts);
	$("#frmDados").show();
	callconnected = true;
	startmakecall = false;
	document.getElementById("CallPhoneNumberValue").innerHTML = event.ANI;
	if (event.UUI) document.getElementById("CallCampaignValue").innerHTML = strhtmluui; //event.UUI;
	
	$('#cti-attendance').show();
	$('#tempochamada').show();
	$('#cliente-off').hide();
	$('#call-duration-count').show();
	timer.start();	

	timer.addEventListener('secondsUpdated', function (e) {
		$('#call-duration-count').html(timer.getTimeValues().toString());
	});
	timer.addEventListener('started', function (e) {
		$('#call-duration-count').html(timer.getTimeValues().toString());
	});	
	
	var input = {
			templateName: "msdyn_betta_template",
			templateParameters: {
			customer: "Contoso"
			//id_interacao: dynamics.id_interacao,
			//id_ticket: dynamics.id_ticket = dynamics.id_ticket,
			//customerName: attachdata.nome_cliente,
			//customerRecordId: attachdata.id_cliente,
			//customerEntityName: attachdata.tipo_cliente == 1 ? "contact" : "account"
			//cb_cliente_on: true // CONTROLE DE ESTADO
		},
		context: {
			sessaobetta: false,
		}
	};

	Microsoft.CIFramework.createSession(input).then(
		function success(sessionId) {focusTicket("msdyn_betta_template"); },
		function (error) {alert(error)}
	);
} 

api.OnIncomingChat = function(event){

	//if (blnscreenpop){
		//IncomingChatEvent(event)
		cti.ScreenPopUp(event);
		blnscreenpop = true;
		ChatAtivo = true;
		//RoomId
		//ContactId
		//Session Nice ?
		//var object = new Object();
		//object.ContactId = event.ContactId;
		//object.RoomId = event.RoomId;
		//iframe_document.contentWindow.postMessage(JSON.stringify(object), '*');
		console.log("ContactId Event",event.ContactID)
		TimerTimeout = parseInt(event.TimerTimeout);
		ContactID = event.ContactID;

	//}
}

api.OnDeliveredChat = function(event){
	

}

api.OnHistoricalChatTranscript = async function(event){
	
	rechamadas = 10;
	for (var i = 0; i < rechamadas; i++) {
		ChatRoomHis = document.getElementById(event.ContactID)
		if(event.historicalchattranscript.length == 0){
			break;
		}
		if (ChatRoomHis != null){
			HistoricalChatTranscript(event);
			break;
		} 
		await aguardarRechamada(1000);
	}
}

api.OnMessageChat = function(event){

	MessageChat(event);
}

api.OnDisconnectedChat = function(event){
	
	ChatAtivo = false;
	try{
		var divContainSessionchat = document.querySelector('.id-'+event.RoomId).classList[0]
		disconnectChat(event, divContainSessionchat);
		
	} catch (e){
		console.log(e);
	}
}
api.OnDelivered = function(event){
	TurnUnavailable()
	startDate = new Date();
	//console.log("OnDelivered >> ",event.type);
	//$("#frmDados").show();
	callconnected = true;
	startmakecall = false;
	localPause = true;
	if(event.hasOwnProperty('ANI'))
	{
		//document.getElementById("CallPhoneNumberValue").innerHTML = event.ANI;
	}
	timer.stop();
	timer.start();	
	$('#call-duration-count').show();
	timer.addEventListener('secondsUpdated', function (e) {
		$('#call-duration-count').html(timer.getTimeValues().toString());
	});
	timer.addEventListener('started', function (e) {
		$('#call-duration-count').html(timer.getTimeValues().toString());
	});
	
	strAniInCall.innerText = event.ANI
	$(screenInFocus).hide();
	$('#SCREEN-INCALL').show();
	screenInFocus = "#SCREEN-INCALL"
	
	if (!blnscreenpop){
		cti.ScreenPopUp(event);
	}
	
	if(event.hasOwnProperty('UUI'))
	{
		//document.getElementById("CallCampaignValue").innerHTML = strhtmluui; //event.UUI;
	}
	console.log("ContactId Event",event.ContactID)
	CallContactID = event.ContactID;

	blnscreenpop = true;
	
	//console.log("OnDelivered << ", blnscreenpop);
	
} 

api.OnEstablished = function(event){
	console.log("OnEstablished ",event);
	//$("#frmDados").show();
	//if (event.ANI) document.getElementById("CallPhoneNumberValue").innerHTML = event.ANI;
	//if (event.UUI) document.getElementById("CallCampaignValue").innerHTML = strhtmluui;//event.UUI;
	callconnected = true;
	//$('#cti-attendance').show();
	//$('#cliente-off').hide();
	//$('#tempochamada').show();

	if(event.hasOwnProperty('Dispositions'))
	{
		$("#seldisposition").empty();
		strDisposition = event.Dispositions;	
		for (i in strDisposition) {
		  $("#seldisposition").append('<button onclick="Disposition(this)" value="'+strDisposition[i].id + '">' + strDisposition[i].disposition + '</button>');
		}
		$("#seldisposition").val('');
	}
}	

api.OnConsultationCall = function(event)
{
	if (startpositivacao == true)
	{
		api.conference();
		startpositivacao = false;
	}
	startmakecall = true;
}

api.OnCallDisconnected = function(event){
	
	$(screenInFocus).hide();
	if(strDisposition != undefined){
		$("#SCREEN-TAB").show();
		screenInFocus = "#SCREEN-TAB"
	} else {
		$("#SCREEN-WELCOME").show();
		screenInFocus = "#SCREEN-WELCOME"
	}
	
	var strtype = event;
	callconnected = false;
	startpositivacao = false;
	localPause = false;
	try {
		var divContainSession = document.querySelector('.voz-' + event.ContactIdDrop).id
		disconnectcall(event, divContainSession);
	} catch (e) {
		console.log(e);
	}
} 		
api.OnConnectionCleared = function(event){
	var strtype = event;
	console.log("OnConnectionCleared << ",strtype.type);
	$('#messages').append($('<li>').text(strtype.type));
	callconnected = false;
	startpositivacao = false;
	if (blnscreenpop)
	{
		cti.UpdateTask(currentCreatedTaskId);
	}
	blnscreenpop = false;	
	timer.stop();
	$('#call-duration-count').html("00:00:00");
	$('#call-duration-count').hide();
	
	let strCNPJ = "";
	let strContrato = "";
	let strDDD = "";
	let strconfsenha= "";
	let strconfpositivacao= "";
	let strProduto = "";
	let strToken = "";
	let strOrigem = "";
	let UCID = "";
	let UUI = "";
	let strANI = "";

	var strtype = event;
}   

api.OnGetAgentState = function(event){

	var strloggedOnState = event.loggedOnState;
	if (strloggedOnState == "True")
	{
		AgentLogged()
		$("#TXT-LOGIN-OFF").hide();
		$("#icon-Xmark").hide();
		
		//$("#TXT_AGENT").hide();
		//$("#TXT_AGENT_PASSWORD").hide();
		//$("#TXT_AGENT_EXTENSION").hide();
		//$("#loginblock").hide();
		//$("#lbllogin").hide();
		//$("#frmDados").show();
		//$("#ICO_AGENT").hide();
		//$("#ICO_PASSWORD").hide();
		//$("#ICO_EXTENSION").hide();
		//TXT_AGENT
		$('#TXT_MESSAGES').val("");
		$('#TXT_MESSAGES').hide();
		isLogin = true;
		//$('#TXT_AGENT_DISPLAY').show();
		//$("#pausegrp").show();
		//$('#FRM_ICON').show();
		//$('#LBL_LOGIN').hide();
		//$("#l-login").hide();
		
		$("#TXT_AGENT").hide();
		$("#TXT_AGENT_PASSWORD").hide();
		$("#TXT_AGENT_EXTENSION").hide();
		$('#TXT_MESSAGES').val("");
		$('#TXT_MESSAGES').hide();
		$('#TXT_STATUS').show();
		isLogin = true;
		$('#TXT_AGENT_DISPLAY').show();
		$("#pausegrp").show();
		//$('#FRM_ICON').show();
		$('#LBL_LOGIN').hide();
		$("#l-login").hide();
		//TXT_AGENT_EXTENSION_DISPLAY
		//$('#TXT_AGENT_EXTENSION_DISPLAY').html("Ramal: "+$('#TXT_AGENT_EXTENSION').val());
		//$('#TXT_AGENT_EXTENSION_DISPLAY').show();
		
		//TXT_AGENT_EXTENSION_DISPLAY
		//$('#TXT_AGENT_EXTENSION_DISPLAY').html("Ramal: "+$('#TXT_AGENT_EXTENSION').val());
		//$('#TXT_AGENT_EXTENSION_DISPLAY').show();
		$("#status_phone").show();
		$("#toolbar_phone").show();
		$("#status_omni").show();
		$('#cliente-off').hide();
		
		//$('#TXT_AGENT_NAME').val("");
		$('#TXT_AGENT_NAME').show();
		//sforce
		//cti.enableClickToDial();
		
	} else
	{
		$(screenInFocus).hide();
		$("#main-tool").show();
		screenInFocus = "#main-tool"
		$("#TXT-LOGIN-OFF").show();
		
		
		$("#TXT_AGENT").show();
		//$("#TXT_AGENT_PASSWORD").show();
		//$("#TXT_AGENT_EXTENSION").hide();
		$('#TXT_AGENT_NAME').val("");
		$("#pausereason").hide();
		$('#TXT_AGENT_DISPLAY').hide();
		$('#TXT_STATUS').hide();
		//TXT_STATUS
		//$('#FRM_ICON').hide();
		$('#LBL_LOGIN').show();
		isLogin = false;
		$("#pausegrp").hide();
		$('#TXT_AGENT_EXTENSION_DISPLAY').hide();
		$("#l-login").show();
			//show
		$("#BT_LOGIN").prop( "disabled", false );
		$("#BT_LOGIN").show();
		Initialize();
		//sforce
		//cti.disableClickToDial();
		return;
	}
	if (stragentName != event.agentName && stragentName.length<1)
	{
		stragentName = event.agentName;
	}
	
	if (stragentName.length>0 && isLogin)
	{
		$('#TXT_AGENT_NAME').val(stragentName);
		//$('#TXT_AGENT_NAME').val($('#TXT_AGENT').val());
		//$('#TXT_AGENT_NAME').title('Login: ' + $('#TXT_AGENT_EXTENSION').val() + ' / ' + $('#TXT_AGENT').val() + " - " + stragentName);
	} else if (isLogin)
	{
		$('#TXT_AGENT_NAME').val($('#TXT_AGENT').val());
		//$('#TXT_AGENT_NAME').title('Login: ' +$('#TXT_AGENT_EXTENSION').val() + ' / ' + $('#TXT_AGENT').val());
	}
	
	var strCanLogin = event.CanLogin;			
	$("#BT_LOGIN").hide();
	if (strCanLogin=="True") 
	{
		$(screenInFocus).hide();
		$("#main-tool").show();
		screenInFocus = "#main-tool"
	} else
	{
		$("#main-tool").hide();
	}		
	var strCanLogout = event.CanLogout;				
	if (strCanLogout=="True") 
	{
		$("#btn-logout-modal").show();
	} else
	{
		$("#btn-logout-modal").hide();
	}

	var strCanReady = event.CanReady;	
	if (strCanReady=="True") 
	{
		$("#BT_READY").show();
	} else
	{
		$("#BT_READY").hide();
	}			
	var strCanPause = event.CanPause;
	if (strCanPause=="True") 
	{
		//$("#BT_PAUSE").show();
		
		//pausereason
		//$("#pausereason").show();
	} else
	{
		//$("#pausereason").hide();
	}			
	var strCanAnswer = event.CanAnswer;	
	if (strCanAnswer=="True") 
	{
		$("#BtAnswerCall").show();
	} else
	{
		$("#BtAnswerCall").hide();
	}				
	var strCanHold = event.CanHold;
	if (strCanHold=="True") 
	{
		if(callconnected == true){
			$("#div-btn-espera").removeClass("BtnAtivado");
			$("#icon-btn-espera").css("color", "#2D9BD5");
			//$("#text-espera-on").hide();
		}	
	} else
	{
		if(callconnected == true){
			$("#div-btn-espera").addClass("BtnAtivado");
			$("#icon-btn-espera").css("color", "white");
			//$("#text-espera-on").show();
		}	
	}						
	var strCanRetrieve = event.CanRetrieve;	
	if (strCanRetrieve=="True") 
	{
		$("#BtRetrieve").show();
		$("#BtRetrieveoff").hide();
	} else
	{
		$("#BtRetrieve").hide();
		$("#BtRetrieveoff").show();
	}		
	//desabilitar
	var strCanHangup = event.CanHangup;	
	if (strCanHangup=="True") 
	{
		//$("#BtHangup").show();
		//$("#BtHangupoff").hide();
		//$("#BtHangup").hide();
		//$("#BtHangupoff").show();
		//$("#BT_ATENDIMENTO").show();
	} else
	{
		//$("#BtHangup").hide();
		//$("#BtHangupoff").show();
		//$("#BT_ATENDIMENTO").hide();
	}			
	var strCanTransfer = event.CanTransfer;	
	if (strCanTransfer=="True") 
	{
		//$("#BtTransfer").show();
		//$("#BtTransferoff").hide();
		
		$("#BT_TRANSFERIR").prop( "disabled", false );
	} else
	{
		$("#BT_TRANSFERIR").prop( "disabled", true );
	}			
	var strCanConference = event.CanConference;	
	if (strCanConference=="True") 
	{
		//$("#BtConference").show();
		//$("#BtConferenceoff").hide();		
		$("#BtConference").hide();
		$("#BtConferenceoff").show();
		
	} else
	{
		$("#BtConference").hide();
		$("#BtConferenceoff").show();
	}				
	var strCanDial = event.CanDial;	
	if (strCanDial=="True") 
	{
		$("#BtDial").show();
		$("#BtDialoff").hide();
	} else
	{
		$("#BtDial").hide();
		$("#BtDialoff").show();
	}			
	var strCanCompleteInteraction = event.CanCompleteInteraction;	
	if (strCanCompleteInteraction=="True") 
	{
		$("#BtWrapup").show();
		$("#BtWrapupoff").hide();
	} else
	{
		$("#BtWrapup").hide();
		$("#BtWrapupoff").show();
	}			

	var strtalkState = event.talkState;
	if (strtalkState=="Idle")
	{
		//document.getElementById("CallPhoneNumberValue").innerHTML = '';
		//document.getElementById("CallCampaignValue").innerHTML = '';
		//$("#frmDados").hide();
		$('#cti-attendance').hide();
		//$('#cliente-off').show();
		$('#call-duration-count').html("00:00:00");
		$('#call-duration-count').hide();
		$("#CallState").text("Livre");
	    timer.stop();
		if (blnscreenpop)
		{
			//cti.UpdateTask(currentCreatedTaskId);
			blnscreenpop = false;
		}	
		timer.stop();
		$('#call-duration-count').html("00:00:00");
		$('#call-duration-count').hide();
		$('#tempochamada').hide();
	}
	if (strtalkState=="OnCall")
	{
		if(document.getElementById("SCREEN-PAUSA").style.display == "block"){
			$(screenInFocus).hide();
			$("#SCREEN-INCALL").show();
			screenInFocus = "#SCREEN-INCALL"
		}
		
		
		$("#frmDados").show();
		$('#cti-attendance').show();
		$('#cliente-off').hide();
		$('#tempochamada').show();
		$("#CallState").text("Ocupado");

		var strCanMute = event.CanMute;	
		if (strCanMute=="False") 
		{
			if(callconnected == true){
				$("#div-btn-mute").removeClass("BtnAtivado");
				$("#icon-btn-mute").css("color", "#2D9BD5");
			}
		} else
		{
			if(callconnected == true){
				$("#div-btn-mute").addClass("BtnAtivado");
				$("#icon-btn-mute").css("color", "white");
			}
		}
	} else
	{
		$("#BtMute").hide();
		$("#BtUnMute").hide();
		$("#BtMuteoff").show();
	}
	
	var strCallState = event.CallState;
	if (strCallState=="alerting")
	{
		api.answer();
	}

	if (strCallState=="connected")
	{
		callconnected = true;
		$("#BT_LOGOUT").prop( "disabled", true );
	} 
	var strCanTransfer = event.CanTransfer;	
	if (strCanTransfer=="True") 
	{
		//$("#BtTransfer").show();
		//$("#BtTransferOff").hide();
		$("#BtTransfer").hide();
		$("#BtTransferOff").show();		
	} else
	{
		$("#BtTransfer").hide();
		$("#BtTransferOff").show();
	}			
	var strCanConference = event.CanConference;	
	if (strCanConference=="True") 
	{
		//$("#BtConference").show();
		//$("#BtConferenceOff").hide();
		$("#BtConference").hide();
		$("#BtConferenceOff").show();		
	} else
	{
		$("#BtConference").hide();
		$("#BtConferenceOff").show();
	}	
	var strworkMode = event.workMode;	
	if (strworkMode=="AfterCallWork") 
	{
		var strselect = $("#seldisposition").val();
		if (!strselect)
		{
			//$("#seldisposition").val('');
			//$('#modalDisposition').modal('show');
		}
	} else
	{
		//$('#modalDisposition').modal('hide');
	}	
	if (strCallState=="")
	{
		callconnected = false;
		$("#BT_LOGOUT").prop( "disabled", false );
	}
	
	if(event.hasOwnProperty('PauseReason'))
	{
		$("#btns-reason").empty();
		strPauseReason = event.PauseReason;	
		for (i in strPauseReason) {
		  $("#btns-reason").append('<button onclick="Pause(this)" class="buttons-pausa" onclick="Pause(this)" value="'+strPauseReason[i].reason + '">' + strPauseReason[i].reason + '</button>');
		  //if (strPauseReason[i].id == event.reasonCode) strPause = strPauseReason[i].reason;
		}
	}
	if(event.hasOwnProperty('MatrizTransf'))
	{
		$("#select-transfer-itau").empty();
		strMatrizTransf = event.MatrizTransf;	
		for (i in strMatrizTransf) {
			if(strMatrizTransf[i].type == "Phone Call" || strMatrizTransf[i].type == "addressBook"){
				$("#select-transfer-itau").append('<option value="'+strMatrizTransf[i].id + '">' + strMatrizTransf[i].destino + '</option>');
			}
		}
		$("#select-transfer-itau").val('');		
	}

	$('#TXT_AGENT_DISPLAY').html(event.agentState);
	//agentNotReady
	var strSpace = '                                      ';
	switch (event.agentState) {
	  case 'agentNotReady':
		VerifyApiPause()
		TurnUnavailable()
		//for (i in strPauseReason) {
		//  if (strPauseReason[i].id == event.reasonCode) strPause = strPauseReason[i].reason;
		//}
		//strPause = 'Pausa ('+event.reasonCode.toLowerCase()+')';
		//$('#TXT_AGENT_DISPLAY').html(strPause);
		//reasonCode
		//reasonCode
		break;
	  case 'agentReady':
		TurnDisponible()
		strPause = 'Disponível';
		$("#selreason").val('');
		//$('#TXT_AGENT_DISPLAY').html('DISPONÍVEL');
		break;
	  case 'agentNull':
	    strPause = 'Deslogado';
		//$('#TXT_AGENT_DISPLAY').html('DESLOGADO');
		break;
	  case 'agentBusy':
		if(ChatAtivo = true && document.getElementById("SCREEN-PAUSA").style.display == "block"){
			$(screenInFocus).hide();
			$("#SCREEN-WELCOME").show();
			screenInFocus = "#SCREEN-WELCOME"
		}
		TurnUnavailable()
		//$('#TXT_AGENT_DISPLAY').html('ATENDIMENTO');
		break;
	  case 'Logoff':
	  	strPause = 'Deslogado';
		//$('#TXT_AGENT_DISPLAY').html('DESLOGADO');
		break;					
	  default:
	    strPause = event.agentState;
		//$('#TXT_AGENT_DISPLAY').html(event.agentState);
	}
	strPause = strPause + strSpace;
	strPause = strPause.substring(0, 26);
	$('#TXT_AGENT_DISPLAY').val(strPause);
}  

api.OnCallback = function(event){
	//INPUT_CALLBACK
	//$('#TXT_AGENT').val()
	$('#INPUT_CALLBACK').val(strANI);
	$('#modalCallBack').modal('show');
	
	timerCallback.stop();
	timerCallback.start({countdown: true, startValues: {seconds: 10}});
	//$('#call-duration-count').show();
	timerCallback.addEventListener('secondsUpdated', function (e) {
		$('#call-duration-count-callback').html(timerCallback.getTimeValues().toString());
	});
	timerCallback.addEventListener('started', function (e) {
		$('#call-duration-count-callback').html(timerCallback.getTimeValues().toString());
	});
	timerCallback.addEventListener('targetAchieved', function (e) {
		//$('#countdownExample .values').html('KABOOM!!');
		$('#modalCallBack').modal('hide');
		api.callbackcancel('')
	});
}

function ToMakeCall()
{
	var select = document.getElementById("seltransf");
	//var select = document.getElementById("seltransf");
	//document.getElementById("seltransf").value = '';
	//$("#frmDados").hide();
	//$("#seltransf").val('');
}

function CancelMakeCall()
{
	$("#frmDados").show();
}

function colocarEmEspera()
{
	api.hold();
}

function sairDeEspera()
{
	api.retrieve();
}			
function Log(logger, level, text) {
	console.log(level + " - " + logger + " - " + text);		 
}
function ConfigCTI()
{
	//console.log("ConfigCTI >>");	
	var objConfig = new Object();
	objConfig.type = 'configcti';
	objConfig.aesip = reqCTIConfigAES;
	objConfig.aesport = reqCTIConfigAESPort;
	objConfig.aeslogin = reqCTIConfigAESUser;
	objConfig.aespassword = reqCTIConfigAESPassword;
	objConfig.cm = reqCTIConfigCM;
	objConfig.cm_name = reqCTIConfigCMName;
	objConfig.server = reqCTIConfigWS;
	
	objConfig.PauseReasons = reqPauseReasons;
	objConfig.MatrizTransf = reqDestinations;
	objConfig.ProductKey = 'gKKufyCWHLQ4yEfZ/95tPaqUgUrdPBmT81Sp4uVJ57qciuHNamdFuFB/IyOW/RimLOzWmnGbudwvWFivIMiQqg==';

	objConfig.CallbackActive = 'False';
	objConfig.CallbackShortcall = '10';
	objConfig.CallbackAutomatic = 'False';
	objConfig.CallbackTimeOut = '30';
	objConfig.CallbackPrefix = '00';
	objConfig.CallbackTries = '4';
	
	api.configcti(objConfig, objConfig.server);
	//console.log("ConfigCTI <<");
	
}
function Login() {	  
	//NEW FUNCTION  
	loadingOverlay.style.display = 'block';
	//
	$('#TXT_MESSAGES').val("");
	//$('#TXT_MESSAGES').show();
	
	//cti.SetStatus('0N56g000000GsIA');
	//ConfigCTI();
	//
	var object = new Object();
	object.type = "login";
	//object.extension = $('#TXT_AGENT_EXTENSION').val();
	object.agent = $('#TXT_AGENT').val();
	object.password = $('#TXT_AGENT_PASSWORD').val();
	if (!reqCTIConfigWS)
	{
		reqCTIConfigWS='wss://ctigw.c2x.com.br/NiceDEV/bettacti.svc?Instance=nice';
	}
	object.server= reqCTIConfigWS;
	api.login(object.agent, object.password, object.server)
	
	validate_login();
	
	//cti.saveLog(object);
	
}


/*function Login(agent, password, extension, server) {	    

	var object = new Object();
	object.type = "login";
	object.extension = extension;
	object.agent = agent;
	object.password = password;
	object.server= server;
	api.login(object.agent, object.password,object.extension, object.server)
	//validate_login();
	//cti.saveLog(object);
}
*/

function Logout() {	    

	$("#modal-janela").hide();
	$('#TXT_MESSAGES').hide();
	$('#TXT_AGENT_NAME').val("");
	stragentName='';
	//$("#BtDialoff").hide();
	$("#BtDial").hide();
	$("#BtTransfer").hide();
	$("#BtTransferOff").hide();
	$("#BtConference").hide();
	$("#BtConferenceOff").hide();
	$("#BT_LOGIN").removeClass("slds-button_text-destructive").addClass("slds-button_brand");
	$("#BT_LOGIN").removeAttr( "title" );
	$("#lbllogin").show();
	
	TurnUnavailable()
	api.logout();
	validate_logout();
}

function Ready() {	
	api.ready();
}

function Pause(ReasonPause) {	
	//strreason = $("#btns-reason").val();
	//console.log(strreason.value)
	strreason = ReasonPause.value
	if (strreason ==100) //ready
	{
		api.ready();
	} else	
	{
		api.pause(strreason);
	}
	//data-dismiss="modal"
	//$('#modalPause').modal('hide');
	//$("#pausereason").hide();
}

function Disposition(strdisposition) {	    
	api.disposition(CallContactID, strdisposition.value);
	ResetAgent()
}

function MatrizTranf() {	    
	//$('#modalMakeCall').modal('hide');
	//$("#frmDados").show();
	var toaddress = document.getElementById("select-transfer-itau");
	
	//if (callconnected == true)
	//{
	//	api.consultationcall(toaddress.value);
	//} 
	//else
	//{
		api.transfercall(toaddress.value);
	//}
	$("#select-transfer-itau").val('');
	$(screenInFocus).hide();
	$("#SCREEN-WELCOME").show();
	screenInFocus = "#SCREEN-WELCOME"
}

function PauseReason()
{
	//document.getElementById("selreason").value = '';
	//$("#pausereason").show();
}

function CreateModalDiv(id, e) {
	var divPause = document.getElementById(id);
	if (!divPause) {
		divPause = document.createElement("div");
		divPause.id = id;
		divPause.className = "PanelModal";
		divPause.style.left = e.clientX + "px";
		divPause.style.top = e.clientY + "px";
		document.body.appendChild(divPause);

		//Add a div to disable click on interface
		var divPauseOverlay = document.createElement("div");
		divPauseOverlay.id = id + "_OVERLAY";
		divPauseOverlay.className = "PanelModalOverlay";
		divPauseOverlay.innerHTML = "&nbsp;";
		document.body.appendChild(divPauseOverlay);
	} else {
		divPause.innerHTML = "";
	}
}

function ClosePauseDiv(e) {
	var overlaydiv = document.getElementById("DIV_PAUSE_OVERLAY");
	if (overlaydiv) overlaydiv.parentNode.removeChild(overlaydiv);

	var pausediv = document.getElementById("DIV_PAUSE");
	if (pausediv) pausediv.parentNode.removeChild(pausediv);
}

function CloseCampaignDiv(e) {
	var overlaydiv = document.getElementById("DIV_CAMPAIGN_OVERLAY");
	if (overlaydiv) overlaydiv.parentNode.removeChild(overlaydiv);

	var maindiv = document.getElementById("DIV_CAMPAIGN");
	if (maindiv) maindiv.parentNode.removeChild(maindiv);
}

function CloseCallDiv(e) {
	var overlaydiv = document.getElementById("DIV_CALL_OVERLAY");
	if (overlaydiv) overlaydiv.parentNode.removeChild(overlaydiv);

	var maindiv = document.getElementById("DIV_CALL");
	if (maindiv) maindiv.parentNode.removeChild(maindiv);
}

function CloseStatusDiv() {
	var overlaydiv = document.getElementById("DIV_STATUS_OVERLAY");
	if (overlaydiv) overlaydiv.parentNode.removeChild(overlaydiv);

	var maindiv = document.getElementById("DIV_STATUS");
	if (maindiv) maindiv.parentNode.removeChild(maindiv);
}			

function OnMakeCallClick(e) {

	CreateModalDiv("DIV_CALL", e);
	var divCampaign = document.getElementById("DIV_CALL");

	var table = document.createElement("table");
	table.style.width = "100%";
	table.style.paddingBottom = "2px";
	var tr = table.insertRow(-1);
	var td = tr.insertCell(-1);
	td.colSpan = 2; td.innerHTML = "Manual call";
	td.className = "TdTitle";

	var tr = table.insertRow(-1);
	var td = tr.insertCell(-1); td.innerHTML = "Phone&nbsp;:&nbsp;";
	td.colSpan = 2; td.style.textAlign = "center";
	var input = document.createElement("input");
	input.type = "text";
	input.className= "form-control";
	input.style.width = "120px";
	input.id = "INPUT_CALL";
	td.appendChild(input);

	var tr = table.insertRow(-1);
	var td = tr.insertCell(-1); td.innerHTML = "Campaign&nbsp;:&nbsp;";
	td.colSpan = 2; td.style.textAlign = "center";

	/**** FILL THE SELECT WITH ALL MANUAL CAMPAIGNS ***/
	var select = document.createElement("select");
	select.style.width = "120px";
	select.id = "SELECT_CALL";

	td.appendChild(select);

	var tr = table.insertRow(-1);
	var td = tr.insertCell(-1); td.style.textAlign = "center";
	var btCall = document.createElement("button");
	//modificado
	btCall.innerHTML="<span class='glyphicon glyphicon-earphone' aria-hidden='true'></span> Call";
	btCall.className="btn btn-success";
	btCall.onclick = MakeCall;
	td.appendChild(btCall);
	var td = tr.insertCell(-1); td.style.textAlign = "center";
	var btCancel = document.createElement("button");
	//modificado
	btCancel.className="btn btn-danger";
	btCancel.innerHTML = "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Cancel";
	btCancel.onclick = CloseCallDiv;
	td.appendChild(btCancel);

	divCampaign.appendChild(table);
}

function MakeCall(e) {

	var toaddress = document.getElementById("INPUT_CALL").value;
	if (callconnected == true)
	{
		api.consultationcall(toaddress);
	} 
	else
	{
		api.makecall(toaddress);
	}
		
}

$(document).on('click', '.btn-ReviewAccount', function () {
	var accountid = $(this).data("accountid");
	sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: accountid}});
});
			
function OnAnswerCall() {
	
	//api.answer();
}
function OnMuteClick(e) {

	api.mute();
}
function OnUnMuteClick(e) {

	api.unmute();
}
function OnHangupClick(e) {

	api.hangup();
}
function OnHoldClick(e) {
	
	api.hold();
	
}
function OnRetrieveClick(e) {
	
	api.retrieve();
	
}			
function OnTransferClick(e) {
	
	api.transfer();
	
}
function OnConferenceClick(e) {
	
	api.conference();
	
}	

function OnWrapupClick(e) {
	
	api.ready();
	
}			

function PopulateSubStatus(e) {
	//Get the current status selected
	var mainSelect = document.getElementById("SELECT_STATUS_CODE");
	var statusCode = parseInt(mainSelect.value, 10);

	//First remove all options from the subSelect
	var subSelect = document.getElementById("SELECT_SUB_STATUS");
	for (var i = subSelect.options.length - 1; i >= 0; i--) {
		subSelect.remove(i);
	}

	//Populate the list only if a status code is selected
	if (statusCode != -1) {
		var session = agentlink.Telephony.GetSession();
		var codes = agentlink.QualificationCodes(session.QualificationGroup);

		for (var i = 0; i < codes.Count; i++) {
			var current = codes.Item(i);

			//Get the item selected
			if (current.Code == statusCode) {
				for (var j = 0; j < current.Details.Count; j++) {
					var currentDetail = current.Details.Item(j);

					var opt = new Option(currentDetail.Code + " -" + currentDetail.Description, currentDetail.Code);
					subSelect.add(opt);
					subSelect.disabled = false;
				}

				if (current.Details.Count == 0) {
					subSelect.disabled = true;
				}
			}
		}
	} else {
		subSelect.disabled = true;
	}
}
/*** NEW FUNCTIONS **/
var strMute = false;
var strEspera = false;
var screenInFocus = "#main-tool";
const inPause = document.getElementById("SCREEN-TIMERPAUSE");
const div_dinamicStatus = document.getElementById("div-dinamicStatus");
const DinamicStatus = document.querySelector('.menu-header');
const btn_dsp_disp =  document.getElementById("btn-dsp-disp");
const divLogar = document.querySelector('.modal-janela');

document.querySelector(".menu-header").addEventListener('click', () => {
    if(divLogar.style.display != 'grid'){
        divLogar.style.display = 'grid'
    } else{
        divLogar.style.display = 'none'
    }
})

timerPause.addEventListener('secondsUpdated', function (e) {
	$('#call-count-internal-timer').html(timerPause.getTimeValues().toString());
	$('.count-out-pause').html(timerPause.getTimeValues().toString());
});
timerPause.addEventListener('started', function (e) {
	$('#call-count-internal-timer').html(timerPause.getTimeValues().toString());
	$('.count-out-pause').html(timerPause.getTimeValues().toString());
});

function MenuPausa(Origem){
    $(screenInFocus).hide();
    $("#SCREEN-PAUSA").show();
	screenInFocus = "#SCREEN-PAUSA"
}

function MenuConfig(){
	getVersion();
    $(screenInFocus).hide();
    $("#SCREEN-CONFIG").show();
	screenInFocus = "#SCREEN-CONFIG"
}

function VerifyApiPause(){
	var validationTimer = timerPause.isRunning()
	
	if(document.getElementById("SCREEN-PAUSA").style.display == "block"){
		if(validationTimer == false ){
			$(screenInFocus).hide();
			$("#SCREEN-TIMERPAUSE").show();
			screenInFocus = "#SCREEN-TIMERPAUSE"
			timerPause.stop();
			timerPause.start();	
		} else{
			timerPause.stop();
			VerifyApiPause()
		}
	} else if(document.getElementById("SCREEN-WELCOME").style.display == "block") {
		timerPause.stop();
		timerPause.start();
		$("#div-welcome").hide();
		$("#div-out-pause").show();
	}
}

function OutPause(){
    timerPause.stop();
	Ready();
    if(inPause.style.display === 'block'){
        $(screenInFocus).hide();
        $("#SCREEN-WELCOME").show();
        $("#div-out-pause").hide();
        $("#div-welcome").show();
		$("#div-spam-pause").show();
		screenInFocus = "#SCREEN-WELCOME"
    } else{
        $("#div-out-pause").hide();
        $("#div-welcome").show();
		$("#div-spam-pause").show();
		screenInFocus = "#SCREEN-WELCOME"
    }
}

function Arrowback(div){
    if(div == 'voltar'){
		if(localPause == true){
			$(screenInFocus).hide();
			$("#SCREEN-INCALL").show();
			screenInFocus = "#SCREEN-INCALL"
		} else {
			$("#SCREEN-PAUSA").hide();
			$("#SCREEN-WELCOME").show();
			$("#div-out-pause").hide();
			$("#div-welcome").show();
			screenInFocus = "#SCREEN-WELCOME"
		}
    } else if(div == 'voltarIn'){
		$("#SCREEN-TIMERPAUSE").hide();
		$("#SCREEN-WELCOME").show();
        $("#div-out-pause").show();
        $("#div-welcome").hide();
		screenInFocus = "#SCREEN-WELCOME"
    } else if(div == "voltar-transfer"){
        $("#SCREEN_TRANSFER").hide();
        $("#SCREEN-INCALL").show();
		screenInFocus = "#SCREEN-INCALL"
    } else if(div == "voltar-config"){
        $("#SCREEN-CONFIG").hide();
        $("#SCREEN-WELCOME").show();
		screenInFocus = "#SCREEN-WELCOME"
    }
}

function AgentLogged(){
	if($("#main-panel").is(":hidden")){
		$(screenInFocus).hide();
		$("#main-panel").show();
		$("#SCREEN-WELCOME").show();
		div_dinamicStatus.classList.remove('fa-light');
		div_dinamicStatus.classList.remove('fa-circle-xmark');
		div_dinamicStatus.classList.add('fa-thin');
		div_dinamicStatus.classList.add('fa-circle-check');
		DinamicStatus.style.color = 'green'
		btn_dsp_disp.style.color = 'grey'
		screenInFocus = "#SCREEN-WELCOME"
	}
}

function TurnDisponible(){
	strMute = false;
	strEspera = false;
	timerPause.stop();
	if(document.getElementById("SCREEN-TIMERPAUSE").style.display == "block"){
		$(screenInFocus).hide();
		$("#SCREEN-WELCOME").show();
		screenInFocus = "#SCREEN-WELCOME"
	}
    $("#modal-janela").hide();
	$("#div-out-pause").hide();
    $("#div-welcome").show();
	div_dinamicStatus.classList.remove('fa-light');
	div_dinamicStatus.classList.remove('fa-circle-xmark');
	div_dinamicStatus.classList.add('fa-thin');
	div_dinamicStatus.classList.add('fa-circle-check');
	DinamicStatus.style.color = 'green'
	btn_dsp_disp.style.color = 'grey'
}

function ResetAgent(){
	timerPause.stop();
	$(screenInFocus).hide();
	$("#SCREEN-WELCOME").show();
	screenInFocus = "#SCREEN-WELCOME"
}

function TurnUnavailable(){
    $("#modal-janela").hide();
    div_dinamicStatus.classList.remove('fa-thin');
    div_dinamicStatus.classList.remove('fa-circle-check');
    div_dinamicStatus.classList.add('fa-light');
    div_dinamicStatus.classList.add('fa-circle-xmark');         
    DinamicStatus.style.color = "#b71c1c";
	btn_dsp_disp.style.color = 'green'
}

function CloseWarning(){
	$("#div-spam-pause").hide();
	$("#div-spam-mute").hide();
	$("#div-spam-hold").hide();
}

function InitTransfer(){
    $("#SCREEN-INCALL").hide();
    $("#SCREEN_TRANSFER").show();
	screenInFocus = "#SCREEN_TRANSFER"
}

function StartMute(event){
	if(strMute == false){
		OnMuteClick(event)
		strMute = true;
	} else if(strMute == true){
		OnUnMuteClick(event)
		strMute = false;
		//$("#div-spam-mute").show();
	}
}
  
function StartEspera(){
	if(strEspera == false){
		colocarEmEspera()
		strEspera = true;
	} else if(strEspera == true){
		sairDeEspera()
		strEspera = false;
		//$("#div-spam-hold").show();
	}
}

function ValidateTransfer(){
	$(screenInFocus).hide();
	$("#section-confirmar-transfer").show();
	screenInFocus = "#section-confirmar-transfer"
	let TextInputTransfer;
	for (i in strMatrizTransf) {
		if($("#select-transfer-itau").val() == strMatrizTransf[i].id ){
			TextInputTransfer = strMatrizTransf[i].destino
		} 
	}
	$('#TEXT_TRANSFER').html(`transferir chamada para <br> atendimento <b>${TextInputTransfer}</b>`);
}

function CancelTransfer(){
	$(screenInFocus).hide();
	$("#SCREEN-INCALL").show();
	screenInFocus = "#SCREEN-INCALL"
}

function ArmazenaSessionVoz(event, sessionId){
	const VozRoom = document.querySelector('.voz-sessions');
	
	if(document.body.contains(document.querySelector('.voz-' + event.ContactID))){
		
	} else{
		const divSessionVoice = document.createElement('div');
		divSessionVoice.setAttribute('class', 'voz-' + event.ContactID)
		divSessionVoice.setAttribute('id', sessionId)
		VozRoom.appendChild(divSessionVoice)
	}
}

/*** GENERAL UTILITIES **/
function LZ(x) { return (x < 0 || x > 9 ? "" : "0") + x }
//});
