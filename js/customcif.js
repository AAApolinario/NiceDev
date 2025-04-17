
var mainWindow;

var ambiente ="DEV";
var templateSessaoPadrao = "cb_nice"; 
var templateCreateSession = "cb_nice_sessao"; 
var templateFocusTicket = "cb_nice_sessao"; 
var templatedesligou = "cb_nice_desligou";
var templateausente = "cb_nice_ausente";
var tableName = "new_cb_interacao";
var botao_espera = "s";
var botao_transferencia = "s";
var callback_sac = "s";

if (ambiente=="PRD")
{
	tableName = "cb_interacao";
}

// MEDIA BAR ONLOAD
function init(templateParam) {
	//debugger;
	console.log("CIF "+templateParam);
	mainWindow = window.parent.parent;
	Microsoft.CIFramework.setClickToAct(true);
	Microsoft.CIFramework.addHandler("onSessionClosed", sessaoFechada);
	Microsoft.CIFramework.setWidth(30);
	criarSessaoPadrao(templateParam);
}

// STANDARD SESSION - betta
function criarSessaoPadrao(templateParam) {
	var input = {
		templateName: templateSessaoPadrao,
	templateParameters: { },
	context: {
		sessaobetta: true
		}
	};
	Microsoft.CIFramework.createSession(input).then(
	function success(sessionId) {
	},
	function (error) { }
	);
}

// IF THE MAIN SESSION IS CLOSED, IT WILL REOPEN
function sessaoFechada(paramStr) {
	let params = JSON.parse(paramStr);
	if (params != null && params.context != null)
	if (params.context != null && params.context.sessaobetta) {
		// RESTAURA A BARRA DE MÍDIAS
		criarSessaoPadrao();
	}
}

// CALL WHEN INTERACTION IS RECEIVED
async function atender(event)
{
	//Transação Chat
	console.log('UUI >> ',event.UUI);

	var strTipo = '1';
	if (event.type == 'OnIncomingChat')
	{
		api.acceptchat(event.ContactID);
		strTipo = '2';
	}
	var dynamics = {id_interacao: null, id_ticket: null };
	var strID;
	var strFullname;
	var strFinalcartao;
	var strBandeira;
	var strVariante;
	var strProgramid;
	var strAutenticado;
	var strchannelkey;
	var strTag;
	var strIdProduto;
	var strmsglink;
	var strTipoProduto;
	var strJson = "";
	var UUIClean;
	var strtransferbtn;
	var stresperabtn;

	if (event.UUI)
	{
		
		UUIClean = event.UUI.replaceAll("'","\"");
		var arrayUUI = UUIClean.split('|');
		//var arrayUUI = event.UUI.split('|');
		for (var intUUI = 0; intUUI < arrayUUI.length; intUUI++) 
		{
			var arrayValues = arrayUUI[intUUI].split(':');
			//if (arrayValues[0]=="U_CLIENT_ID") strID = arrayValues[1];
			//if (arrayValues[0]=="U_NOME_CLIENTE") strFullname = arrayValues[1];
			//if (arrayValues[0]=="U_FINAL_CARTAO") strFinalcartao = arrayValues[1];
			//if (arrayValues[0]=="U_BANDEIRA") strBandeira = arrayValues[1];
			//if (arrayValues[0]=="U_VARIANTE") strVariante = arrayValues[1];
			//if (arrayValues[0]=="U_PROGRAM_ID") strProgramid = arrayValues[1];
			//if (arrayValues[0]=="U_AUTENTICADO") strAutenticado = arrayValues[1];
			//if (arrayValues[0]=="U_CHANNEL_KEY") strchannelkey = arrayValues[1];
			//if (arrayValues[0]=="U_TAG") strTag = arrayValues[1];
			// Tratamento do MsgLink
			if (arrayValues[0]=="msglink" && arrayValues.length >2) 
			{
				strmsglink = arrayValues[1]+":"+arrayValues[2];
			}
			// Tratamento de Json
			if (arrayValues[0]=="U_JSON" && arrayValues.length >2) 
			{
				for(var i=1; i<arrayValues.length; i++){
					if(i == 1){
						strJson = arrayValues[i];
					}
					if(i != 1){
						strJson = strJson+":"+arrayValues[i];
					}
				}
			}
			if (arrayValues[0]=="tipo_produto") strTipoProduto = arrayValues[1];
			if (arrayValues[0]=="U_NOME_PROJETO") strTipoProduto = arrayValues[1];
			if (arrayValues[0]=="ID_PROJETO") strTipoProduto = arrayValues[1];
			
			if (arrayValues[0] === "botao_espera") {
				botao_espera = arrayValues[1];
				$('#BT_ESPERA')[0].style.display = botao_espera !== "n" ? "block" : "none";
			}

			if (arrayValues[0] === "botao_transferencia") {
				botao_transferencia = arrayValues[1];
				$('#BT_TRANSFERIR')[0].style.display = botao_transferencia !== "n" ? "block" : "none";
			}

			if (arrayValues[0] === "CALLBACKSAC") {
				callback_sac = arrayValues[1];
				$('#BT_PESQUISA')[0].disabled = callback_sac === "n";
			}
		}
	}
	var jsoncompleto = JSON.stringify(strJson);
	
	var attachdata = {
		connid: event.ContactID,
		id_interacao: null,
		id_ticket: null,
		id_cliente: strID,
		nome_cliente: strFullname,
		tipo_cliente: '1',
		produto: strchannelkey,
		id_produto: strIdProduto,
		pl_tipo: strTipo,
		tags: strTag,
		agente: $('#TXT_AGENT').val(),
		autenticado: strAutenticado,
		programid: strProgramid,
		bandeira: strBandeira,
		variante: strVariante,
		finalcartao: strFinalcartao,
		msglink: strmsglink,
		tipo_produto: strTipoProduto
	};

	await criarInteracaoTicket(attachdata).then((retorno) => {
		dynamics.id_interacao = retorno.id_interacao;
		dynamics.id_ticket = retorno.id_ticket;
		console.log('dynamics',dynamics);
		//
		var input = {
			templateName: templateCreateSession,
			templateParameters: {
				id_interacao: dynamics.id_interacao,
				id_ticket: dynamics.id_ticket,
				customerName: attachdata.nome_cliente,
				customerRecordId: attachdata.id_cliente,
				customerEntityName: attachdata.tipo_cliente == "1" ? "contact" : "account",
				cb_cliente_on: true // CONTROLE DE ESTADO
			},
			context: {
				sessaobetta: false,
			}
		};
		
		if(VerifyDiv(event) === false){
			Microsoft.CIFramework.createSession(input).then(
				function success(sessionId) {
					console.log('Session created',sessionId);
					if (event.type == 'OnIncomingChat'){
						MultiSessionChat(event, sessionId)
						// !! NEW FUNCTION TIMEOUT
						createTimerChat(event)
					} else if(event.type == 'OnDelivered'){
						ArmazenaSessionVoz(event, sessionId)
					}
				},
				function (error) {console.log(error)}
			)
		}
	}
	)
}

// Atualiza Ticket's após Queda/Inatividade -- Recebe ID Interação e Id Sessão como Parametros
async function MotivarQueda(idInteracao, sessaoId) {
	let tab = {
		templateName: "cb_tela_encerrar",
		templateTag: "cb_tela_encerrar",
		templateParameters: {
			cb_data: encodeURI(JSON.stringify({
				Contexto: {
					SessãoId: sessaoId,
					idInteracao: idInteracao
				}
			}))
		},
		isFocused: true
	};

	Microsoft.CIFramework.createTab(tab).then(
		function sucess(result) { },
		function (error) { });
}
	
// CREATE AN INTERACTION AND A TICKET
async function criarInteracaoTicket(attachdata) {

	// TOKEN via AZURE APP REGISTRATION
	var token = "";
	let rechamadas = 20;
	let milissecundos = 2000;
			
	var retorno = {
        id_interacao: null,
        id_ticket: null
	};

	var datacb;
	if (ambiente=="DEV")
	{
		datacb = {
			"new_cb_id_externo": attachdata.connid,
			"new_cb_pl_tipo": attachdata.pl_tipo,// VOZ (PADRÃO)
			"new_cb_st_id_cliente": attachdata.id_cliente,
			"new_cb_pl_tipo_cliente": attachdata.tipo_cliente,
			"new_cb_st_produto": attachdata.produto,
			"new_cb_st_id_produto": attachdata.id_produto,
			"new_cb_mst_tags": attachdata.tags,
			"new_cb_st_agente": attachdata.agente,
			"new_cb_st_autenticado": attachdata.autenticado,
			"new_name": attachdata.nome_cliente,

			"statuscode": 1
		}
	} else
	{
		datacb = {
			"cb_id_externo": attachdata.connid,
			"cb_pl_tipo": attachdata.pl_tipo,// VOZ (PADRÃO)
			"cb_st_id_cliente": attachdata.id_cliente,
			"cb_pl_tipo_cliente": attachdata.tipo_cliente,
			"cb_st_produto": attachdata.produto,
			"cb_st_id_produto": attachdata.id_produto,
			"cb_mst_tags": attachdata.tags,
			"cb_st_agente": attachdata.agente,
			"cb_st_autenticado": attachdata.autenticado,
			"cb_st_nome": attachdata.nome_cliente,
			"cb_st_id_programa": attachdata.programid,
			"cb_st_digitos_cartao": attachdata.finalcartao,
			"cb_st_variante": attachdata.variante,
			"cb_st_bandeira": attachdata.bandeira,
			"cb_st_url": attachdata.msglink,
			"cb_st_tipo_produto": attachdata.tipo_produto,
			"statuscode": 121430000
		}
	}

	var jsonData = JSON.stringify(datacb);
	//FF
	try {
		await Microsoft.CIFramework.createRecord(tableName, jsonData).then(
			function success(result) {
				// ID INTERAÇÃO
				retorno.id_interacao = JSON.parse(result).id;
				console.log("id_interacao", retorno.id_interacao);
			},
			function (error) {
				// TO-DO...
				console.log("createRecord error", error);
			}
		);
		/*
		//Valida se retornou interação
		if (retorno.id_interacao == null) {
			
			for (var i = 0; i < rechamadas; i++) {
				// Busca pelo ContactId e recupera o id interação / id_ticket(Se ja existir);
				Microsoft.CIFramework.searchAndOpenRecords(tableName, "$filter=cb_id_externo eq '"+ attachdata.connid +"'&$select=cb_interacaoid&$expand=cb_cb_interacao_incident_interacao_originadoraid($select=incidentid)&$top=1", true).
					then(
						function success(result) {
							interacao = JSON.parse(result);
							if (interacao[0] != null)
								retorno.id_interacao = interacao[0].cb_interacaoid
							// ID TICKET
							if (interacao[0] != null && interacao[0].cb_cb_interacao_incident_interacao_originadoraid[0] != null)
								retorno.id_ticket = interacao[0].cb_cb_interacao_incident_interacao_originadoraid[0].incidentid;
						},
						function (error) {
							console.log("searchAndOpenRecords" + attachdata.connid + " error", error);
						}
					);
				if (retorno.id_interacao != null) break;
				await aguardarRechamada(milissecundos);
			}
		}
					
		if (retorno.id_ticket == null) {
			//Recupera idTicket;
			for (var j = 0; j < rechamadas; j++) {

				await aguardarRechamada(milissecundos);

				await Microsoft.CIFramework.retrieveRecord(tableName, retorno.id_interacao, "?$select=cb_protocolo_interacao&$expand=cb_cb_interacao_incident_interacao_originadoraid($select=incidentid)").then(
					function success(result) {
						interacao = JSON.parse(result);

						// ID TICKET
						if (interacao.cb_cb_interacao_incident_interacao_originadoraid[0] != null)
							retorno.id_ticket = interacao.cb_cb_interacao_incident_interacao_originadoraid[0].incidentid;
					},
					function (error) {
						// TO DO TRATAR EXCESSÕES					
						throw error;
					}
				);
				console.log("Rechamada" + j);
				if (retorno.id_ticket != null) break;
			}
		} // fim if id_ticket
		*/
	} catch (err) {
		// TO DO  caso de erro na criação, o que fazer?
		mainWindow.Xrm.Utility.closeProgressIndicator();
		alert(err);
		throw err;
	}
	return retorno;
}

//Aguardar para rechamar
async function aguardarRechamada(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
		
async function retrieveRecord(id_interacao)
{
	var retorno = {
        id_interacao: null,
        id_ticket: null
	};
	
	await Microsoft.CIFramework.retrieveRecord(tableName, id_interacao, "?$select=cb_protocolo_interacao&$expand=cb_cb_interacao_incident_interacao_originadoraid($select=incidentid)").then(
	function success(result) {
		let interacao = JSON.parse(result);
		// ID TICKET
		retorno.id_ticket = interacao.cb_cb_interacao_incident_interacao_originadoraid[0].incidentid;
		console.log("id_ticket", retorno.id_ticket);
		},
		function (error) {
			// TO-DO...
		}
	);
	
	return retorno.id_ticket;
}

function disconnectcall(event, sessionId) {

	sessaoId = sessionId;
	//console.log(sessionId)
	var context = {"cb_cliente_on": false };
	// SEARCH THE SESSION (IT WILL BE MORE COMPLEX WHEN IMPLEMENTING THE CHAT)
		// DEFINES THAT THE CLIENT IS OFF (LEFT)
	Microsoft.CIFramework.updateContext(context, sessionId).then(
		function success(result) {
				
			//save the interaction id
			let id = result.id_interacao;
			console.log("updateContext",result);

			// SEARCH THE TABLES
			Microsoft.CIFramework.getTabs().then(
				(tabs) => {

					// START AT 1 TO SKIP ANCHOR
					for (let index = 1; index < tabs.length; index++) {
						const tab = tabs[index];
						Microsoft.CIFramework.closeTab(tab);
					}
				})

			if (event.type == 'OnCallDisconnected'){
				var input = {
					templateName: templatedesligou,
					templateParameters: {}
				}
			}
			var input = {
				templateName: templatedesligou,
				templateParameters: {}
			}
			// NOTIFICA ENCERRAMENTO
			Microsoft.CIFramework.notifyEvent(input).then(
				function success(result, sessionId) {
	
					MotivarQueda(id, sessaoId);
			
			},
				function (error) {
					console.log(error);

				});
		},
		function (error) {
		}
	);
}

function chatOff(evento) {

	var context = {"cb_cliente_on": false };

	// SEARCH THE SESSION (IT WILL BE MORE COMPLEX WHEN IMPLEMENTING THE CHAT)
	Microsoft.CIFramework.getFocusedSession().then((sessionId) => {

	// DEFINES THAT THE CLIENT IS OFF (LEFT)
	Microsoft.CIFramework.updateContext(context, sessionId).then(
		function success(result) {

			// SEARCH THE TABLES
			Microsoft.CIFramework.getTabs().then(
				(tabs) => {

					// START AT 1 TO SKIP ANCHOR
					for (let index = 1; index < tabs.length; index++) {
						const tab = tabs[index];
						Microsoft.CIFramework.closeTab(tab);
					}
				})

			var input = {
				templateName: templateausente,
				templateParameters: {}
			}
			// NOTIFY CLOSURE
			Microsoft.CIFramework.notifyEvent(input);
				},
				function (error) {
			}
		);
	});
	
}
// FOCUS ON THE TICKET TAB
function focusTicket(templateName) {
		Microsoft.CIFramework.getTabs(templateName).then(
			function (result) {
				Microsoft.CIFramework.focusTab(result).then(
					function (result) {
					},
					function (error) {
					});
			},
			function (error) {
			});
}

function IniciaUraAutenticadora(UraAtiva){
	Microsoft.CIFramework.raiseEvent("envio_ura_autenticadora");
	UraTrue = UraAtiva;
}

function EncerraUraAutenticadora(){
	Microsoft.CIFramework.raiseEvent("retorno_ura_autenticadora");
	UraTrue = false;
}