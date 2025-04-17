var MainChatContent = document.getElementById('formchat');
var InputFocus = document.querySelector('.box-footer');

var ChatRoom;
var oldChatRoom = null;
var oldFooterRoom;
var FooterRoom;
var oldBoxFooter;
var AllSession;
var CIFsession;
var SendFocus;
var IdChat;
var textarea = null;
var TimerFocus;
var oldTimerRoom;
var timeoutFunction = true;
var timeout = "";

// NEW FUNCTION VERSION CHAT
const chatversion = "1.1.0";

InputFocus.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send-agent").click();
  }
});

function sendchat(ContactID)
{
	var strText = InputFocus.value;
	if (strText && !strText.trim() == false)
	{
		if(strText.includes("\\")){
			strText = strText.replaceAll("\\", "\\\\")
		}
		if(strText.includes("?")){
			strText = strText.replaceAll("?", "%3F")
		}
		console.log("ContactID", ContactID, strText);
		api.sendchat(ContactID,strText);
		InputFocus.value = ("");
		InputFocus.style.height = "auto";
		BoxFooter.style.height = `35px`;
		InputFocus.style.overflowY = 'hidden';
	}
}

function VerifyDiv(event){
	if(document.body.contains(document.querySelector('.id-' + event.RoomId))){
		return true
	} else {
		return false
	}
}

function setVariables(event){
	ChatRoom = formdocument.querySelector('.id-' + event.RoomId);
	FooterRoom = formdocument.querySelector('.footer-' + event.RoomId);
	InputFocus = formdocument.querySelector('.input-' + event.RoomId);
	SendFocus = formdocument.querySelector('.send-' + event.RoomId);
	BoxFooter = formdocument.querySelector('.box-footer-' + event.RoomId);
}

function MultiSessionChat(event, sessionId){
	
	MainChatContent.style.display = "block"
	MainTimer = formdocument.querySelector('.box-header');
	MainChat = formdocument.querySelector('.box-body');
	MainFooter = formdocument.querySelector('.box-footer');

	// Testa se a div já existe
	if(VerifyDiv(event) === true){
		setVariables(event)
		MessageChat(event, ChatRoom)
	} else {
		// Cria Div Footer e Input
		const MainFooterCreate = document.createElement('div');
		MainFooterCreate.setAttribute('class', 'box-footer box-footer-'+ event.RoomId + ` foot-${sessionId}`)
		MainFooterCreate.innerHTML = 
		`<textarea placeholder="Escreva aqui." id="story" class="${'input-' + event.RoomId} ${'input-' + sessionId} form-control" id="input-agent" rows="1" cols="30" style="border: 1px solid black; overflow-y: hidden; border-radius: 5px; resize: none; height: 29px; padding: 7px; margin-left:7px; width: 82%; outline: none; position: absolute; bottom: 12px"></textarea>
		<span class="input-group-btn" style="display: flex;">
		</span>`
		MainFooterCreateButton = document.createElement('div');
		MainFooterCreateButton.innerHTML = 
		`<i class="${'send-' + event.RoomId} fa-solid fa-paper-plane" id="send-agent" style="cursor: pointer; position: absolute; bottom: 16px; right: 23px" onclick="sendchat(ContactID)"></i>`
		MainFooter.appendChild(MainFooterCreate)
		MainFooter.appendChild(MainFooterCreateButton)
		
		// Cria a Div com timer - NEW FUNCTION TIMEOUT
		if(timeoutFunction == true){
			const divTimer = document.createElement('div');
			divTimer.setAttribute('id', 'timer-'+ event.RoomId)
			divTimer.innerHTML = 
			`<h2 class="${'call-count-internal-timeout-' + event.RoomId} ${'timer-' + sessionId}" id="${'call-count-internal-timeout-' + event.RoomId}" style="margin: 0;" >00:00:00</h2>`
			MainTimer.appendChild(divTimer)
		}
		// Cria a Div com o novo RoomId
		const divMainChat = document.createElement('div');
		divMainChat.setAttribute('class', sessionId + ' direct-chat-messages id-' + event.RoomId)
		divMainChat.setAttribute('id', event.ContactID)
		MainChat.appendChild(divMainChat)
		// Chama as funções finais
		setVariables(event)
		
		if(oldChatRoom == null){
			oldChatRoom = ChatRoom;
			oldFooterRoom = FooterRoom;
			oldTimerRoom = TimerFocus;
			oldBoxFooter = BoxFooter;
		}
		if(oldChatRoom != null){
			updateChat()
		}
		if(event.type === "OnMessageChat"){
			MessageChat(event, ChatRoom)
		} else if (event.type === "OnIncomingChat" || event.type === "OnHistoricalChatTranscript"){
			//api.historicalchat(event.ContactID, event.RoomId);
			//HistoricalChatTranscript(event, ChatRoom)
		}
	}
}

async function MessageChat(event){
	
	var time = event.TimeStamp.slice(11, -3);
	var ChatRoomMessage = document.querySelector('.id-' + event.RoomId)
	
	if(event.Message === "$Localized:ChatSessionEnded"){
		event.Message = "Chat encerrado!"
	}
	
	if(event.PartyType === "Agent" || event.PartyType === "System"){

		// NEW FUNCTION TIMEOUT
		setTimeout(function() {
			// TIMEOUT START
			if(event.PartyType === "Agent"){
				if(window['Timeout-'+event.RoomId]){
					if(window['Timeout-'+event.RoomId].isRunning() == true ){
						window['Timeout-'+event.RoomId].reset();
					}
					window['Timeout-'+ event.RoomId].start({countdown: true, startValues: {seconds: TimerTimeout}});
				}
			}
		}, 1000);
		
		if(event.Label === ""){
			event.Label = event.PartyType;
		}
		const divAllAgent = document.createElement('div');
		divAllAgent.setAttribute('class', 'direct-chat-msg')
		divAllAgent.innerHTML = 
		`<div class="direct-chat-info clearfix agentTXT">
			<span class="direct-chat-name name-right">${event.Label}</span>
			<span class="times-stamp clock-right">${time}</span>
		</div>

			<div class="direct-chat-text">
				${event.Message}
			</div>`;
		
		rechamadas = 30;
		for (var i = 0; i < rechamadas; i++) {
			ChatRoomMessage = document.querySelector('.id-' + event.RoomId)
			if (ChatRoomMessage != null) break;
			await aguardarRechamada(2000);
		}
		try{
			ChatRoomMessage.appendChild(divAllAgent)
			AddScrool(ChatRoomMessage)
			Microsoft.CIFramework.requestFocusSession(ChatRoomMessage.classList[0], "4");
			var IdChat = ChatRoomMessage;
		}catch(e){
			console.log(e)
		}

	} else if(event.PartyType === "Client"){

		// NEW FUNCTION TIMEOUT
		if(timeoutFunction == true){
			window['Timeout-'+ event.RoomId].stop();
		}

		if(event.Label === ""){
			event.Label = event.PartyType;
		}
		const divAllAgent = document.createElement('div');
		divAllAgent.setAttribute('class', 'direct-chat-msg right')
		divAllAgent.innerHTML = `
		<div class="direct-chat-info clearfix">
			<span class="direct-chat-name name-left">${event.Label}</span>
			<span class="times-stamp clock-left">${time}</span>
		</div>

		<div class="direct-chat-text">
			${event.Message}
		</div>`

		
		rechamadas = 30;
		for (var i = 0; i < rechamadas; i++) {
			ChatRoomMessage = document.querySelector('.id-' + event.RoomId)
			if (ChatRoomMessage != null) break;
			await aguardarRechamada(2000);
		}
		
		try{
			ChatRoomMessage.appendChild(divAllAgent)
			AddScrool(ChatRoomMessage)
			Microsoft.CIFramework.requestFocusSession(ChatRoomMessage.classList[0], "4");
		}catch(e){
			console.log(e)
		}
		
	}
}

function HistoricalChatTranscript(event)
{
	
	if (event.historicalchattranscript)
	{
		let x = event.historicalchattranscript.length;
		for (var passo = 0; passo < x; passo++) {

			ChatRoomHistorical = document.getElementById(event.ContactID)
			var time = event.historicalchattranscript[passo].TimeStamp.slice(0, -3);
			var txtMessage = event.historicalchattranscript[passo].Message;
			var userType = event.historicalchattranscript[passo].PartyType;
			
			if(txtMessage == "$Localized:ChatSessionEnded" || txtMessage == "$Localized:AgentLeftChat"){
				continue;
			}

			if(userType === "System"){
				continue;
			}
			
			if(userType === "Agent"){

				const divAllAgent = document.createElement('div');
				divAllAgent.setAttribute('class', 'direct-chat-msg')
				divAllAgent.innerHTML = 
				`<div class="direct-chat-info clearfix agentTXT">
					<span class="direct-chat-name name-right">${userType}</span>
					<span class="times-stamp clock-right">${time}</span>
				</div>
		
					<div class="direct-chat-text">
						${txtMessage}
					</div>`;
		
				try{
					ChatRoomHistorical.appendChild(divAllAgent)
				}	catch(e){
					console.log(e);
				}
				AddScrool(ChatRoomHistorical)
		
			} else if(userType === "Client"){
		
				const divAllAgent = document.createElement('div');
				divAllAgent.setAttribute('class', 'direct-chat-msg right')
				divAllAgent.innerHTML = `
				<div class="direct-chat-info clearfix">
					<span class="direct-chat-name name-left">${userType}</span>
					<span class="times-stamp clock-left">${time}</span>
				</div>
		
				<div class="direct-chat-text">
					${txtMessage}
				</div>`
		
				try{
					ChatRoomHistorical.appendChild(divAllAgent)
				}	catch(e){
					console.log(e);
				}
				AddScrool(ChatRoomHistorical)
			}
		}
	}
}

function AddScrool(chatID){
	try{
		chatID.scrollTop += 300;
	} catch(e){
		console.log(e);
	}
}

function disconnectChat(event, sessionId){
	let nodeDiv = document.querySelector('.id-' + event.RoomId);
	let DeleteTimerChat = document.querySelector('.call-count-internal-timeout-'+event.RoomId);
	let DeleteBooxFooter = document.querySelector('.box-footer-'+ event.RoomId);

    var DeleteLocations = []
    DeleteLocations[0] = nodeDiv;
    DeleteLocations[1] = DeleteBooxFooter;
	DeleteLocations[2] = DeleteTimerChat;

    for(i = 0; i < DeleteLocations.length; i++){
        if(DeleteLocations[i].parentNode){
            try{
                DeleteLocations[i].parentNode.removeChild(DeleteLocations[i]);
            } catch(err){
                console.log(err)
            }
        }
    }
	InputFocus.value = "";
	$("#formchat").hide();
	disconnectcall(event, sessionId);
}

function encerraChat(){
	timeout = "";
	api.endchat(ContactID)
}

function RecuperaSession(){
    Microsoft.CIFramework.getFocusedSession().then(
	function success(result) {
	//console.log(result);
	ChatRoom = document.querySelector(`.${result}`);
	FooterRoom = document.querySelector(`.ftr-${result}`);
	InputFocus = document.querySelector(`.input-${result}`);
	TimerFocus = document.querySelector(`.timer-${result}`);
	BoxFooter = document.querySelector(`.foot-${result}`);
		if(result === "session-id-1"){
			MainChatContent.style.display = "none"
			$("#MAIN").show();
		}
		if(result != "session-id-1" && ChatRoom != null){
			MainChatContent.style.display = "block"
			ContactID = ChatRoom.id
			$("#MAIN").hide();
		}
		if(ChatRoom == null){
			MainChatContent.style.display = "none"
			$("#MAIN").show();
		}
		updateChat();
	},
	function (error) {
		console.log(error.message);
	});
}
setInterval(RecuperaSession, 1000);

function updateChat(){
	// OLD
	if(oldChatRoom != null){
		oldChatRoom.style.display = "none"
	}
	if(oldFooterRoom != null){
		oldFooterRoom.style.display = "none"
	}
	if(oldTimerRoom != null) {
		oldTimerRoom.style.display = "none"
	}
	if(oldBoxFooter != null){
		oldBoxFooter.style.display = "none"
	}
	// NEW
	if(ChatRoom != null){
		ChatRoom.style.display = "block"
	}
	if(FooterRoom != null){
		FooterRoom.style.display = "flex"
	}
	if(TimerFocus != null){
		TimerFocus.style.display = "block"
	}
	if(BoxFooter != null){
		BoxFooter.style.display = "block"
	}
	oldTimerRoom = TimerFocus;
	oldFooterRoom = FooterRoom;
	oldChatRoom = ChatRoom;
	oldBoxFooter = BoxFooter;
	
	// !! NEW FUNCTION DYNAMIC TEXT BOX !!
	textarea = InputFocus;
	if(textarea != null){ 
		textarea.addEventListener("keyup", e=>{
			let scHeight = e.target.scrollHeight;
			let addDivFooter = ( scHeight - 29 ) + 35;
			
			if(addDivFooter > 35 && addDivFooter < 140){
				BoxFooter.style.height = `${addDivFooter}px`;
				InputFocus.style.overflowY = 'hidden';
				textarea.style.height = `${scHeight}px`;
			} else if(addDivFooter == 35){
				BoxFooter.style.height = `35px`;
				InputFocus.style.overflowY = 'hidden';
			} else if(addDivFooter >= 140){
				textarea.style.height = `134px`;
				BoxFooter.style.height = `140px`;
				InputFocus.style.overflowY = 'auto'
			} else {
				textarea.style.height = "auto";
			}
		});
	}	
}

// !! NEW FUNCTION TIMEOUT !!
if(timeoutFunction){
	function createTimerChat(event){
		window['session-'+ event.RoomId] = document.querySelector('.call-count-internal-timeout-'+event.RoomId).classList[1].slice(6)
		window['Timeout-'+ event.RoomId] = new easytimer.Timer();
		window['Timeout-'+ event.RoomId].addEventListener('secondsUpdated', function (e) {
			$(`.call-count-internal-timeout-${event.RoomId}`).html(window['Timeout-'+ event.RoomId].getTimeValues().toString());
		});
		window['Timeout-'+ event.RoomId].addEventListener('targetAchieved', function (e) {
			api.sendchat(event.ContactID,"Contato encerrado por inatividade, mas pode nos chamar sempre que precisar.");
			timeout = "timeout";
			api.endchat(event.ContactID, timeout);
		});
	}
}

// NEW FUNCTION VERSION CHAT
function getVersion(){
	$("#CHAT-VERSION")[0].innerText = chatversion;
}

// NEW FUNCTION DISABLE LOGIN Button
var loginButton = document.querySelector('#BT_LOGIN');
var loadingOverlay = document.querySelector('#loading-overlay');

loginButton.addEventListener('click', function() {
  loadingOverlay.style.display = 'block';
});

// NEW FUNCTION TRANSFER CHAT - ATLAS
const ChatTransfModal =  document.querySelector("dialog")

function OpenModalChat(){
	ChatTransfModal.showModal();
}
function closeModalChat(){
	ChatTransfModal.close();
	$("#select-transfer-chat").val('');
}
function TransferChat(){
	var targetskillid = document.querySelector('#select-transfer-chat').value;
	console.log("ContactId: "+ ContactID +" Trasferido.")
	api.transferchatskill(ContactID, targetskillid);
	ChatTransfModal.close();
	$("#select-transfer-chat").val('');
}

function TransferChatList(){
	const OptionChat = document.querySelector('#select-transfer-chat');
	
	for (let i = 0; i < jsonfile.MatrizTransf.length; i++) {
		var ChatTransferDestino = jsonfile.MatrizTransf[i].destino;
		var ChatTransferId = jsonfile.MatrizTransf[i].id;
		var NewOption = new Option(ChatTransferDestino, ChatTransferId);
		OptionChat.appendChild(NewOption);
	}
}