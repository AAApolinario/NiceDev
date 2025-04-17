$(document).ready(function() {
	//Tela inicial
	//criarSessaoPadrao();
	read_login();
	Initialize();
	cti.init();
});

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
var strMatrizTransf;
//Configuration Call Center
var pageOnAccounts;
var OpenCTIOnCall;
var clickToDialEnabled = false;
var currentCreatedTaskId;
var startDate;
var endDate;
var stragentName;

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

var CRC = '78207,78208,78209,78210,78211,78212,78215,78220,78221,78222,78223,47712,47912,47832,43562,47871,47911,47951,43561,47810,47950,47910,47872,40000,41936,46636,1936,6636,8777,41937,1260,1261,1262';
var SAC = '78216,78217,78218,78219,47874,47889,41926,1926,8934';
var ATD = '78201,78202,78203,78204,78205,43560,47710,47790,47830,47870,41925,1925,8778';
var CIS = '47890,44544,4544,8659,5775';
var OUVIDORIA = '78213,47873,42834,2834,8629';
var AUDI = '78214,40000,0000,8883,78250,78251,78252,78253,78254,78255,78256,78257,78258';
var PORSHE = '78241,78242,78243,78244,78245,78246,78247,78248,78249,15123,16123,5123,6123,71601,1601';


//Produto: 1 (Consórcio) ; 2 (CDC) ; 3 (Leasing) ; 4 (Finame) ; 5 (Finame Leasing)
var arrProdutos =[
		{"id":"1","produto":"Consórcio"},
		{"id":"2","produto":"CDC"},
		{"id":"3","produto":"Leasing"},
		{"id":"4","produto":"Finame"},
		{"id":"5","produto":"Finame Leasing"}]
//

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


var callback = function(response) {
if (response.success) {
	//console.log('API method call executed successfully! returnValue:', response.returnValue);
} else { 
	console.error('Something went wrong! Errors:', response.errors);
}
};

let blnsforce = false;

//init()

class SForceLightingCTI {
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
		
		if (blnsforce)
		{
			sforce.opencti.setSoftphonePanelVisibility({visible:true, callback: function() {
				self._init();
			}});
		}
		
		/*
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.LOGIN_SUCCESS,
            function (result) {
                //console.log('LOGIN_SUCCESS : ', result);
                //alert(result.workItemId);
            });
			
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.STATUS_CHANGED,
            function (result) {
                //console.log('STATUS_CHANGED : ', result);
                //alert(result.workItemId);
            });	
			
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.LOGOUT,
            function (result) {
                //console.log('STATUS_CHANGED : ', result);
                //alert(result.workItemId);
            });	
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.WORK_ASSIGNED,
            function (result) {
                //console.log('STATUS_CHANGED : ', result);
                //alert(result.workItemId);
            });	
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.WORK_ACCEPTED,
            function (result) {
                //console.log('WORK_ACCEPTED : ', result);
                //alert(result.workItemId);
            });	
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.WORK_DECLINED,
            function (result) {
                //console.log('WORK_DECLINED : ', result);
                //alert(result.workItemId);
            });	
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.WORK_CLOSED,
            function (result) {
                //console.log('WORK_CLOSED : ', result);
                //alert(result.workItemId);
            });	
		sforce.console.addEventListener(
            sforce.console.ConsoleEvent.PRESENCE.WORKLOAD_CHANGED,
            function (result) {
                //console.log('WORKLOAD_CHANGED : ', result);
                //alert(result.workItemId);
            });		
		*/			
	}
		
	enableClickToDial() {

		var self = this;
		self.clickToDialEnabled = true;

		var callback = function(response) {
			if (response.success) {
				//console.log('SFORCE', 'API method call executed successfully! returnValue:', response.returnValue);

			} else { 
				console.error('SFORCE', 'Something went wrong! Errors:', response.errors);
			} 
		};

		sforce.opencti.enableClickToDial({callback: callback});
		
		sforce.opencti.onClickToDial({listener: function(payload) {
				//console.log('SFORCE', 'sforce.opencti.onClickToDial: ' + payload.number, reqCTIConfigPrefix);
				if (payload.objectType != "Task")
					self.clickToDialObject = payload.recordId;
				if (self.OpenCTIOnCall == "true")
					self.show();
				
				var strdial = payload.number;
				strdial = strdial.replace("+", ""); 				
				strdial = strdial.replace("55", ""); 
				//strdial = strdial.replace("11", ""); //local
				strdial = strdial.replace(" ", "");
				strdial = strdial.replace("(", "");
				strdial = strdial.replace(")", "");
				strdial = strdial.replace("-", "");
				
				api.makecall(reqCTIConfigPrefix + strdial);
			}
		});
	}
		
	
	disableClickToDial() {
		self.clickToDialEnabled = false;

		var callback = function(response) {
			if (response.success) {
				//console.log('SFORCE', 'API method call executed successfully! returnValue:', response.returnValue);

			} else { 
				console.error('SFORCE', 'Something went wrong! Errors:', response.errors);
			} 
		};

		sforce.opencti.disableClickToDial({callback: callback});
	}
	
	_init() {
		var self = this;
		//console.log("Config (1)");
		//if (self.initiated) return;
		self.initiated = true;
		if (self.OpenCTIOnCall == "true")
			self.show();
		
		var callback = function(response) {
			if (response.success) {
				//console.log("Config (2)");
				reqPageOnNoAccounts = response.returnValue["/reqScreenpopupOptions/reqPageOnNoAccounts"];
				OpenCTIOnCall = response.returnValue["/reqCTIConfig/reqOpenCtiOnCall"];
				reqScreenpopupAccount=response.returnValue["/reqScreenpopupOptions/reqScreenpopupAccount"];
				reqScreenpopupTask=response.returnValue["/reqScreenpopupOptions/reqScreenpopupTask"];
				reqScreenpopupCase=response.returnValue["/reqScreenpopupOptions/reqScreenpopupCase"];
				reqScreenpopupLead=response.returnValue["/reqScreenpopupOptions/reqScreenpopupLead"];
				reqScreenpopupField=response.returnValue["/reqScreenpopupOptions/reqScreenpopupField"];
				reqLayoutUUI=response.returnValue["/reqScreenpopupOptions/reqLayoutUUI"];
				//console.log("Config (3)");
				var intcont = 0;
				
				for (intcont = 0; intcont < 10; intcont++) {
					window["reqPauseReason"+intcont] = new Object();
					window["reqPauseReason"+intcont].reason = response.returnValue["/reqPauseReasons/reqPauseReason"+intcont];
					window["reqPauseReason"+intcont].id = intcont;
					if (window["reqPauseReason"+intcont].reason)
					{
						reqPauseReasons.push(window["reqPauseReason"+intcont]);
						//console.log(window["reqPauseReason"+intcont]);
					}
				}

				var arrayOfVDN;
				var tempvdn='';
				for (intcont = 0; intcont < 13; intcont++) {
					window["reqDestination"+intcont] = new Object();
					tempvdn = response.returnValue["/reqDestionations/reqDestination"+intcont];
					if (tempvdn)
					{
						arrayOfVDN = tempvdn.split('|');
						if (arrayOfVDN.length>=0)
						{
							window["reqDestination"+intcont].id = arrayOfVDN[0];
							window["reqDestination"+intcont].destino = arrayOfVDN[1];
							reqDestinations.push(window["reqDestination"+intcont]);
						}
					}
				}
				reqCTIConfigAES=response.returnValue["/reqCTIConfig/reqCTIConfigAES"];
				reqCTIConfigAESPort=response.returnValue["/reqCTIConfig/reqCTIConfigAESPort"];
				reqCTIConfigAESUser=response.returnValue["/reqCTIConfig/reqCTIConfigAESUser"];
				reqCTIConfigAESPassword=response.returnValue["/reqCTIConfig/reqCTIConfigAESPassword"];
				reqCTIConfigCM=response.returnValue["/reqCTIConfig/reqCTIConfigCM"];
				reqCTIConfigCMName=response.returnValue["/reqCTIConfig/reqCTIConfigCMName"];
				reqCTIConfigWS=response.returnValue["/reqCTIConfig/reqCTIConfigWS"];
				var strprefix = response.returnValue["/reqCTIConfig/reqCTIConfigPrefix"];
				if (strprefix)
				{
					reqCTIConfigPrefix=response.returnValue["/reqCTIConfig/reqCTIConfigPrefix"];
				}
				reqSoftphoneHeight=response.returnValue["/reqGeneralInfo/reqSoftphoneHeight"];
				//
			
			} 
			else 
			{ 
				console.error('Something went wrong! Errors:', response.errors);
			} 
		};
		
		sforce.opencti.getCallCenterSettings({callback: callback});
		
		var callback = function(response) {
		 };
		sforce.opencti.setSoftphonePanelLabel({label: "Betta",callback: callback});	
		sforce.opencti.setSoftphonePanelIcon({key:"incoming_call", callback: callback});

	}
	
	SetStatus(statusId) {
            sforce.console.presence.setServicePresenceStatus(statusId, function(result) {
                if (result.success) {
                    console.log('Set status successful');
                    console.log('Current statusId is: ' + result.statusId);
                    console.log('Channel list attached to this status is: ' + result.channels); //printout in console for lists
                } else {
                    console.error('Set status failed');
                }
           });
	}
	
	ScreenPopUp(event)
	{
		console.log('ScreenPopUp >>', event);
		
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
		
		if (sforce)
		{
			if(event.hasOwnProperty('UserData'))
			{
				//console.log('UserData: ' + event.UserData);
				sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL, params : 
				{entityName: "Task", 
				defaultFieldValues: 
				{								
					Description: 'Session:' + event.UserData.dados.Session + ' ContactId:'+event.UserData.dados.ContactId
				}
				}, callback: callback });
				return;
			}
		}
		if(event.hasOwnProperty('CalledDeviceId'))
		{
			//Volks buscar nas matrizes a Origem
			var VDN = event.CalledDeviceId;
			
			let foundVDN = CRC.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'CRC';
			}
			foundVDN = SAC.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'SAC';
			}
			foundVDN = ATD.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'ATD';
			}
			foundVDN = CIS.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'CIS';
			}	
			foundVDN = OUVIDORIA.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'OUVIDORIA';
			}		
			foundVDN = AUDI.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'AUDI';
			}	
			foundVDN = PORSHE.indexOf(VDN);
			if (foundVDN>=0)
			{
				strOrigem = 'PORSHE';
			}				
		}
		
		UCID = event.UCID;
		var UUI = event.UUI;
		strANI = event.ANI;
		var AccountId='';
		var AccountIdPhone='';
		//var arrayOfStrings = UUI.split('|');
		var foundTask = false;
		var strloc;
		//reqLayoutUUI
		//reqScreenpopupField
		var CaseId;
		var TaskId;
		var LeadId
	
		//UUI Posicional
		/*
				if (reqLayoutUUI && reqScreenpopupField)
			{
				var arrayLayout = reqLayoutUUI.split(';');
				console.log(arrayLayout);
				var arrayLayout2;
				var inttam =0;
				var intpos = 0;
				for (var intUUI = 0; intUUI < arrayLayout.length; intUUI++) 
				{
					var strLayout2;
					strLayout2 = arrayLayout[intUUI].split('|');
					//console.log(strLayout2);
					if (strLayout2.length>0)
					{
						if (strLayout2[0]==reqScreenpopupField)
						{
							//console.log(strLayout2[1],reqScreenpopupField);
							strloc = strLayout2[1];
							intpos = inttam;						
						} else
						{
							inttam += parseInt(strLayout2[1],10);
						}
						
					}
				}
				
				if (UUI.length>parseInt(strloc,10))
				{
					AccountId = UUI.substr(intpos,parseInt(strloc,10));
				}
				console.log(AccountId, inttam, intpos, strloc)
			}

		*/
		
		if (reqLayoutUUI && reqScreenpopupField)
			{
				try {
					var arrayLayout = reqLayoutUUI.split('|');
					//console.log(arrayLayout);
					var inttam =0;
					var intpos = 0;
					/*
					for (var intUUI = 0; intUUI < arrayLayout.length; intUUI++) 
					{
						if (arrayLayout[intUUI]==reqScreenpopupField)
						{
							//console.log(arrayLayout[intUUI],reqScreenpopupField);
							intpos = intUUI;						
						}
					}
					*/
					//
					var arrayUUI = UUI.split(';');
					
					/*if (arrayUUI.length>0)
					{
						//AccountId = UUI.substr(intpos,parseInt(strloc,10));
						strCNPJ = arrayUUI[intpos];
						
					}*/
					
					strhtmluui = '<table>';
				
					if (strOrigem !== '')
					{
						strhtmluui +='<tr><td>' + 'Origem' + '</td>';
						strhtmluui +='<td>' + strOrigem + '</td></tr>';
					}
					
					for (var intUUI = 0; intUUI < arrayLayout.length; intUUI++) 
					{
						var strvalue = arrayUUI[intUUI];
						if (intUUI==0)
						{
							for (i in arrProdutos) {
							  if (arrProdutos[i].id == strvalue) 
							  {
								  strvalue = arrProdutos[i].produto;
								  strProduto = arrProdutos[i].id;
							  }
							}
						}	
						else if (arrayLayout[intUUI] == "ddd") {
							strDDD = strvalue;
	                        strhtmluui += '<tr><td>DDD</td>';
	                        if (strvalue == 0) {
	                            //COLOR = BLUE
	                            strhtmluui += '<td style="background-color: #2a6cac; color: white;">' + "Não validado" + '</td></tr>';
	                        } else if (strvalue == 1) {
	                            //COLOR = GREEN
	                            strhtmluui += '<td style="background-color: #32ac2a; color: white;">' + "Igual" + '</td></tr>';
	                        } else {
	                            //COLOR = YELLOW
	                            strhtmluui += '<td style="background-color: #FCF80F; color: black;">' + "Diferente" + '</td></tr>';
	                        }
	                    } 
						else if (arrayLayout[intUUI] == "senha") {
							strconfsenha = strvalue;							
	                    } 

						else if (arrayLayout[intUUI] == "positivado")
						{
							strconfpositivacao = strvalue;
						}
						else if (arrayLayout[intUUI] == "contrato")
						{
							strContrato = strvalue;
						}
						else if (arrayLayout[intUUI] == "token")
						{
							strToken = strvalue;
						}
					    else if (arrayLayout[intUUI] == "cpf_cnpj")
						{
							strCNPJ = strvalue;
						}
	                    else {
	                        strhtmluui += '<tr><td>' + arrayLayout[intUUI] + '</td>';
	                        strhtmluui += '<td>' + strvalue + '</td></tr>';
	                    }
					}
					//Regras para considerar se a identificação foi positiva na URA
					if (strconfsenha == 1)
					{
						strhtmluui += '<tr><td>Identificação</td>';
						if (strconfpositivacao == 2)
						{
							strhtmluui += '<td style="background-color: #32ac2a; color: white;">' + "Positiva" + '</td></tr>';
						} else 
						{
							strhtmluui += '<td style="background-color: #ac2a2a; color: white;">' + "Negativa" + '</td></tr>';
						}
					} else if (strconfsenha == 2)
					{
						strhtmluui += '<tr><td>Identificação</td>';
						strhtmluui += '<td style="background-color: #32ac2a; color: white;">' + "Positiva" + '</td></tr>';
					} else if(strconfsenha)
					{
						strhtmluui += '<tr><td>Identificação</td>';
						strhtmluui += '<td style="background-color: #ac2a2a; color: white;">' + "Negativa" + '</td></tr>';
					}
					
					strhtmluui += '</table>';
				}
				catch
				{
					console.log('Error', reqLayoutUUI, reqScreenpopupField, UUI);
				}
				//console.log(strCNPJ);
			}
			
			//
			if (strhtmluui)
			{
				document.getElementById("CallCampaignValue").innerHTML = strhtmluui;
			}
			//return;
		//
		/*
		self.searchPromise = new Promise(function (resolve, reject) {
			sforce.opencti.screenPop({
			type: sforce.opencti.SCREENPOP_TYPE.FLOW,
			params: {flowDevName: "CTI",
				 flowArgs: [
							   {"name": "cpfCnpj", "type": "String", "value": strCNPJ},
							   {"name": "contractCode", "type": "String", "value": strContrato},
							   {"name": "senhaValidada", "type": "String", "value": strconfsenha},
							   {"name": "positivacao", "type": "String", "value": strconfpositivacao},
							   {"name": "produto", "type": "String", "value": strProduto},
							   {"name": "token", "type": "String", "value": strToken},
							   {"name": "vdn", "type": "String", "value": strOrigem},
							   {"name": "identificadorLigacao", "type": "String", "value": UCID},
							   {"name": "numeroTelefoneOrigem", "type": "String", "value": strANI}
						   ]}
			});
		});
		*/
		
		/*
		//
		self.searchPromise = new Promise(function (resolve, reject) {
			sforce.opencti.searchAndScreenPop({ 
				searchParams : strCNPJ,
				queryParams : '', 
				callType : sforce.opencti.CALL_TYPE.INBOUND,  
				deferred: true, 
				defaultFieldValues: { CpfCnpj__c : strCNPJ },
				callback : function(response) {
					if (response.success) {
						//console.log('SFORCE - ScreenPopUp - CNPJ', 'sforce.opencti.searchAndScreenPop: API method call executed successfully! response:', response);
						var obj = response.returnValue;
						var x = 0;
						var strid = '';
						var blnfoundaccount = false;
						try {
						for(var i in obj){
							var key = i;
							var val = obj[i];
							if (val.RecordType=='Account')
							{
						   		strid = val.Id;
						   		blnfoundaccount = true;
						   		//console.log('CpfCnpj__c Id',strid);	
							}
						    }
						} catch
						{
							//
						}
						AccountIdPhone = strid;		
						if (blnfoundaccount)
						{					
							foundTask = true;
							//console.log('SFORCE - ScreenPopUp - AccountId by CPF_CNPJ',AccountIdPhone);
							resolve(response);
						//
							if (reqScreenpopupAccount=='Y')
							{
								//AccountIdPhone para value.WhatId
								sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: AccountIdPhone}});
							}
							//
							if (reqScreenpopupCase=='Y')
							{
								//Criar Protocolo
								var value = {
									"entityApiName": "Protocolo__c",
									"Conta__c": AccountIdPhone,
									"Contrato__c": ContractID,
									"TipoProtocolo__c": "1° Nível",
									"Origem__c": "Centro de Atendimento",
									"Canal__c": "Telefone",
									"Status__c": "Aberto"
								};
								//
								//Insert Case
								var value = {
									"entityApiName": "Case",
									"Priority": "Medium",
									"Status": "New",
									"AccountId": AccountIdPhone,
									"SuppliedPhone":strANI
								};
												
								sforce.opencti.saveLog({
									value: value,
									callback: function(response) {
										if (response.success) {
											//console.log('API method call executed successfully! returnValue:', response.returnValue);
											//Case 
											sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
											//Insert Task associada ao Case.
											if (reqScreenpopupTask=='Y')
											{
												CaseId = response.returnValue.recordId;
												var value = {
													"entityApiName": "Task",
													"CallObject": UCID,
													"Subject": "Chamada: " + strANI + " (" + startDate.toLocaleString() + ")",
													"Priority": "Normal",
													"Status": "Open",
													"TaskSubtype": "Call",
													"WhatId": CaseId
												};
												
												sforce.opencti.saveLog({
												value: value,
												callback: 						
													function (response) {
														if (response.success) {
															//console.log('Task executed successfully (1)! returnValue:', response.returnValue.recordId);
															currentCreatedTaskId = response.returnValue.recordId;
														}	
													}
												});
											}
										} 
										else 
										{ 
											console.error('Something went wrong! Errors:', response.errors);
										}
									}
								});

							}

							//
						} else if (reqScreenpopupAccount=='Y')
						{
							sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.URL, params: { url: reqPageOnNoAccounts} });
						}

					} else { 
						console.error('SFORCE CNPJ', 'sforce.opencti.searchAndScreenPop: Something went wrong! Errors:', response);
						reject(response);
					} 
				}  
			});
		});
		*/
		
		//
		// Localiza o cliente pelo telefone:
		/*
		self.searchPromise = new Promise(function (resolve, reject) {
			sforce.opencti.searchAndScreenPop({ 
				searchParams : strANI,
				queryParams : '', 
				callType : sforce.opencti.CALL_TYPE.INBOUND,  
				deferred: true, 
				defaultFieldValues: { Phone : strANI },
				callback : function(response) {
					if (response.success) {
						console.log('SFORCE - ScreenPopUp', 'sforce.opencti.searchAndScreenPop: API method call executed successfully! response:', response);
						var obj = response.returnValue;
						var x = 0;
						var strid = '';
						for(var i in obj){
							var key = i;
							var val = obj[i];
							var stridtmp;
							for(var j in val){
								var sub_key = j;
								var sub_val = val[j];
								if (sub_key=='Id') stridtmp = sub_val;
								if (sub_key=='RecordType' && sub_val =='Account' )
								{
								  strid = stridtmp;
								  //console.log('Account Id',strid);					  
								}
								//console.table('sub_key : ' + sub_key, sub_val)
							}
						}
						AccountIdPhone = strid;	
						if (AccountIdPhone.length>0)
						{					
							foundTask = true;
							console.log('SFORCE - ScreenPopUp - AccountId by phone',AccountIdPhone);
							resolve(response);
						//
							if (reqScreenpopupAccount=='Y')
							{
								//AccountIdPhone para value.WhatId
								sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: AccountIdPhone}});
							}
						} else if (reqScreenpopupAccount=='Y')
						{
							sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.URL, params: { url: reqPageOnNoAccounts} });
						}

					} else { 
						console.error('SFORCE', 'sforce.opencti.searchAndScreenPop: Something went wrong! Errors:', response);
						reject(response);
					} 
				}  
			});
		});
		*/
		//setTimeout(function(){var i=0},1000);
		if (sforce)
		{
			self.searchPromise = new Promise(function (resolve, reject) {
				var value = {
					"entityApiName": "Task",
					//"CallDisposition": "",
					"CallObject": UCID,
					"Subject": "Chamada: " + strANI + " (" + startDate.toLocaleString() + ")",
					"Priority": "Normal",
					"Status": "Open",
					//"CallType": callType,
					//"Type": "Call",
					"TaskSubtype": "Call"
				};
				//Localizar o cliente:
				
				//
				//if (arrayOfStrings.length>=0)
				//{

					//AccountId = arrayOfStrings[0];
				
				if (AccountId.length>0)
				{
					value.WhatId = AccountId;
				} 
				else	
				{
					value.WhatId = AccountIdPhone;
					AccountId = AccountIdPhone;
				}
				//} 
				//else
				//{
				//	value.WhatId = AccountIdPhone;
				//}
				
				//Se Task = 'Y'
				if (reqScreenpopupTask=='Y' && reqScreenpopupCase!='Y')
				{
					sforce.opencti.saveLog({
						value: value,
						callback: function (response) {
							if (response.success) {
								//sforce.opencti.refreshView();
								if (reqScreenpopupAccount=='Y')
								{
									//AccountIdPhone para value.WhatId
									sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: value.WhatId}});
								} else
								{
									sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
								}							
								//sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
								//console.log('API method call executed successfully (1)! returnValue:', response.returnValue.recordId);
								//api.acrsendtag(response.returnValue.recordId);
								currentCreatedTaskId = response.returnValue.recordId;
								//$("#status_phone4").prepend('<td id="status_account"><span class="btn-ReviewAccount" data-accountid="' + '0013h000004oZwxAAE' +'" style="color: #5780c7;cursor: pointer;font-weight: bold; font-size: 13px;">' + 'Burlington Textiles Corp of America' + '</span></td>');
								//$("#status_account").remove();
								//???
							} else {
								//Cliente não localizado na URA.
								//console.error('Something went wrong! Errors:', response.errors);
								var obj = response.errors;
								if (obj.length>0)
								{
									if (obj[0].details.fieldErrors.WhatId.length>0)
									{
										value.WhatId="";
										//console.log('AccountIdPhone',AccountIdPhone);
										//if (AccountIdPhone) 
										//{
										//	value.WhatId=AccountIdPhone;
										//	console.log('AccountIdPhone',AccountIdPhone);
										//}
										
										sforce.opencti.searchAndScreenPop({ 
											searchParams : strANI,
											queryParams : '', 
											callType : sforce.opencti.CALL_TYPE.INBOUND,  
											deferred: true, 
											defaultFieldValues: { Phone : strANI },
											callback : function(response) {
												if (response.success) {
													//console.log('SFORCE - ScreenPopUp', 'sforce.opencti.searchAndScreenPop: API method call executed successfully! response:', response);
													var obj = response.returnValue;
													var x = 0;
													var strid;
													for(var i in obj){
														var key = i;
														var val = obj[i];
														var stridtmp;
														for(var j in val){
															var sub_key = j;
															var sub_val = val[j];
															if (sub_key=='Id') stridtmp = sub_val;
															if (sub_key=='RecordType' && sub_val =='Account' )
															{
															  strid = stridtmp;
															  //console.log('Account Id',strid);					  
															}
															//console.table('sub_key : ' + sub_key, sub_val)
														}
													}	
													//if (strid)
													AccountIdPhone = strid;
													foundTask = true;
													//console.log('SFORCE - ScreenPopUp - AccountId by phone',AccountIdPhone);
													//resolve(response);
													
													value.WhatId=AccountIdPhone;
													sforce.opencti.saveLog({
														value: value,
														callback: function (response) {
															if (response.success) {
																//sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
																if (reqScreenpopupAccount=='Y')
																{
																	//console.log('reqScreenpopupAccount (1)',reqScreenpopupAccount);
																	if (AccountIdPhone)
																	{
																		sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: AccountIdPhone}});
																	} else
																	{
																		//console.log('reqScreenpopupAccount (1.2)',reqScreenpopupAccount, reqPageOnNoAccounts);
																		sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.URL, params: { url: reqPageOnNoAccounts} });
																	}
																} else
																{
																	sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
																}
																//console.log('API method call executed successfully (2)! returnValue:', response.returnValue.recordId);
																//api.acrsendtag(response.returnValue.recordId);
																currentCreatedTaskId = response.returnValue.recordId;
															}
															else
															{
																//console.error('Something went wrong! Errors:', response.errors);
																var obj = response.errors;
																if (obj.length>0)
																{
																	if (obj[0].details.fieldErrors.WhatId.length>0)
																	{
																		//Insere Task sem cliente associado
																		value.WhatId="";
																		sforce.opencti.saveLog({
																			value: value,
																			callback: function (response) {
																				if (response.success) {
																					sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
																					//console.log('API method call executed successfully (3)! returnValue:', response.returnValue.recordId);
																					api.acrsendtag(response.returnValue.recordId);
																					currentCreatedTaskId = response.returnValue.recordId;
																				}
																			}
																		});
																	}
																}
																		
																//Account no Found
																if (reqScreenpopupAccount=='Y')
																{
																	//console.log('reqScreenpopupAccount (1)',reqScreenpopupAccount);
																	sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.URL, params: { url: reqPageOnNoAccounts} });
																}
											
															}
														}
													});											

												} else { 
													console.error('SFORCE', 'sforce.opencti.searchAndScreenPop: Something went wrong! Errors:', response);
													//reject(response);
													value.WhatId="";
													sforce.opencti.saveLog({
														value: value,
														callback: function (response) {
															if (response.success) {
																sforce.opencti.screenPop({type: sforce.opencti.SCREENPOP_TYPE.SOBJECT, params: { recordId: response.returnValue.recordId}});
																//console.log('API method call executed successfully (3)! returnValue:', response.returnValue.recordId);
																api.acrsendtag(response.returnValue.recordId);
																currentCreatedTaskId = response.returnValue.recordId;
															}
														}
													});
													
													if (reqScreenpopupAccount=='Y')
													{
														//console.log('reqScreenpopupAccount (2)',reqScreenpopupAccount);
														sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.URL, params: { url: reqPageOnNoAccounts} });
													}										
												} 
											}  
										});								
									}
								}					
							}
						}
					});
				}
			});
		}
		//console.log('ScreenPopUp <<');
	}
	UpdateTask(currentUpdateTaskId)
	{
		//Se Task = 'Y'
		if (reqScreenpopupTask=='Y')
		{
			var self = this;
			self.endDate = new Date();
			var duration = ((self.endDate - startDate) / 1000)
			//console.log("UpdateTask", currentUpdateTaskId);
			sforce.opencti.saveLog({
				value: { "Id" : currentUpdateTaskId, "CallDurationInSeconds" : duration, "Status": "Completed"},
				callback: function (response) {
					if (response.success) {
						sforce.opencti.refreshView();
						//console.log('API method call executed successfully! returnValue:', response.returnValue);
					} else {
						sforce.opencti.refreshView();
						console.error('Something went wrong! Errors:', response.errors);
					}
				}
			})
		}
	}
	
    //saveLog(log) {      
    //     sforce.opencti.saveLog({value:{Id:"00T5B00000Ev4iAUAR", CallDurationInSeconds:"10"}, callback:callback});
    //}
}
//
//
//TXT_MESSAGES
//tempochamada
//pausa-on
//var driverCallDuration;
//var onlyDriverHour = driverCallDuration.substring(11,13);
//ar onlyDriverMinutes = driverCallDuration.substring(14,16);
//ar onlyDriverSeconds = driverCallDuration.substring(17,19);
/*
var currentDate = new Date();
var currentHour = currentDate.getHours();
var currentMinutes = currentDate.getMinutes();
var currentSeconds = currentDate.getSeconds();

var finalHour = currentHour - onlyDriverHour ;
var finalMinutes = currentMinutes - onlyDriverMinutes;
var finalSeconds = currentSeconds - onlyDriverSeconds;

//var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var timer = new easytimer.Timer();
//timer.start({startValues: {hours: finalHour, minutes: finalMinutes, seconds: finalSeconds}});
timer.start({startValues: {hours: currentHour, minutes: finalMinutes, seconds: finalSeconds}});
timer.addEventListener('started', function (e) {
$('#call-duration-count').html(timer.getTimeValues().toString());
});
*/

var cti = new SForceLightingCTI();	
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
	$("#lbllogin").show();
	
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
	//$("#desligado").hide();
	//$("#desligado").removeClass('display-none');
	//$('.wait-active').removeClass('display-none');
	//$("#data-footer1").hide();
	//$("#data-footer2").hide();
	//$('#FRM_ICON').hide();
	//
	
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
	/*
	var jsonfile;
	fetch('RemoteConfig.json').then(results => results.json()).then(function(response) {
		jsonfile = response;
		CRC = jsonfile.VDNs.CRC;
		SAC = jsonfile.VDNs.SAC;
		ATD = jsonfile.VDNs.ATD;
		CIS = jsonfile.VDNs.CIS;
		OUVIDORIA = jsonfile.VDNs.OUVIDORIA;
		AUDI = jsonfile.VDNs.AUDI;
		PORSHE = jsonfile.VDNs.PORSHE;
		arrProdutos = jsonfile.PRODUTOS;
	});
	*/
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
	Logout();
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
	if (blnsforce)
	{
		sforce.opencti.setSoftphonePanelHeight({heightPX: intHeight, callback: callback});
	}
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
api.OnDelivered = function(event){
	
	startDate = new Date();
	//console.log("OnDelivered >> ",event.type);
	$("#frmDados").show();
	callconnected = true;
	startmakecall = false;
	if(event.hasOwnProperty('ANI'))
	{
		document.getElementById("CallPhoneNumberValue").innerHTML = event.ANI;
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
	   
	$('#cti-attendance').show();
	$('#tempochamada').show();
	$('#cliente-off').hide();
	
	if (!blnscreenpop){
		cti.ScreenPopUp(event);
	}
	
	if(event.hasOwnProperty('UUI'))
	{
		document.getElementById("CallCampaignValue").innerHTML = strhtmluui; //event.UUI;
	}
	blnscreenpop = true;
	
	//console.log("OnDelivered << ", blnscreenpop);
	
} 

api.OnEstablished = function(event){
	//console.log("OnEstablished << ",event.type);
	$("#frmDados").show();
	if (event.ANI) document.getElementById("CallPhoneNumberValue").innerHTML = event.ANI;
	if (event.UUI) document.getElementById("CallCampaignValue").innerHTML = strhtmluui;//event.UUI;
	callconnected = true;
	$('#cti-attendance').show();
	$('#cliente-off').hide();
	$('#tempochamada').show();

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

api.onCallDisconnected = function(event){
	var strtype = event;
	//console.log("onCallDisconnected << ",strtype.type);
	$('#messages').append($('<li>').text(strtype.type));
	callconnected = false;
	startpositivacao = false;
} 		
api.OnConnectionCleared = function(event){
	var strtype = event;
	//console.log("OnConnectionCleared << ",strtype.type);
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
	document.getElementById("CallPhoneNumberValue").innerHTML = '';
	//sforce.opencti.setSoftphonePanelHeight({heightPX: reqSoftphoneHeight, callback: callback});
	
	//$('#call-duration-count').html("00:00:00");
	//$("#BT_LOGOUT").prop( "disabled", false );
	//console.log(strtype);
	
	//UpdateTask();
	//
	//
}   

api.OnGetAgentState = function(event){

	var strloggedOnState = event.loggedOnState;
	if (strloggedOnState == "True")
	{
		//$("#TXT_AGENT").hide();
		//$("#TXT_AGENT_PASSWORD").hide();
		//$("#TXT_AGENT_EXTENSION").hide();
		$("#loginblock").hide();
		$("#lbllogin").hide();
		$("#frmDados").show();
		//$("#ICO_AGENT").hide();
		//$("#ICO_PASSWORD").hide();
		//$("#ICO_EXTENSION").hide();
		//TXT_AGENT
		$('#TXT_MESSAGES').val("");
		$('#TXT_MESSAGES').hide();
		isLogin = true;
		$('#TXT_AGENT_DISPLAY').show();
		$("#pausegrp").show();
		//$('#FRM_ICON').show();
		$('#LBL_LOGIN').hide();
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
		//$("#l-login").hide();
		//TXT_AGENT_EXTENSION_DISPLAY
		$('#TXT_AGENT_EXTENSION_DISPLAY').html("Ramal: "+$('#TXT_AGENT_EXTENSION').val());
		$('#TXT_AGENT_EXTENSION_DISPLAY').show();
		
		//TXT_AGENT_EXTENSION_DISPLAY
		$('#TXT_AGENT_EXTENSION_DISPLAY').html("Ramal: "+$('#TXT_AGENT_EXTENSION').val());
		$('#TXT_AGENT_EXTENSION_DISPLAY').show();
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
		$("#TXT_AGENT").show();
		$("#TXT_AGENT_PASSWORD").show();
		$("#TXT_AGENT_EXTENSION").show();
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
		//$("#l-login").show();
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
		$('#TXT_AGENT_NAME').val('Login: ' + $('#TXT_AGENT').val() + " - " + stragentName);
		//$('#TXT_AGENT_NAME').title('Login: ' + $('#TXT_AGENT_EXTENSION').val() + ' / ' + $('#TXT_AGENT').val() + " - " + stragentName);
	} else if (isLogin)
	{
		$('#TXT_AGENT_NAME').val('Login: ' + $('#TXT_AGENT').val());
		//$('#TXT_AGENT_NAME').title('Login: ' +$('#TXT_AGENT_EXTENSION').val() + ' / ' + $('#TXT_AGENT').val());
	}
	
	var strCanLogin = event.CanLogin;			
	$("#BT_LOGIN").hide();
	if (strCanLogin=="True") 
	{
		$("#BT_LOGIN").show();
	} else
	{
		$("#BT_LOGIN").hide();
	}		
	var strCanLogout = event.CanLogout;				
	if (strCanLogout=="True") 
	{
		$("#BT_LOGOUT").show();
	} else
	{
		$("#BT_LOGOUT").hide();
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
		$('#pausa-on').show();
		$('#pausa-off').hide();
		//$("#BT_PAUSE").show();
		
		//pausereason
		//$("#pausereason").show();
	} else
	{
		$("#BT_PAUSE").hide();
		$('#pausa-on').hide();
		$('#pausa-off').show();
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
		$("#BtHold").show();
		$("#BtHoldoff").hide();
	} else
	{
		$("#BtHold").hide();
		$("#BtHoldoff").show();
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
		$("#BtHangup").show();
		$("#BtHangupoff").hide();
		//$("#BtHangup").hide();
		//$("#BtHangupoff").show();
		$("#BT_ATENDIMENTO").show();
	} else
	{
		$("#BtHangup").hide();
		$("#BtHangupoff").show();
		$("#BT_ATENDIMENTO").hide();
	}			
	var strCanTransfer = event.CanTransfer;	
	if (strCanTransfer=="True") 
	{
		//$("#BtTransfer").show();
		//$("#BtTransferoff").hide();
		
		$("#BtTransfer").hide();
		$("#BtTransferoff").show();
	} else
	{
		$("#BtTransfer").hide();
		$("#BtTransferoff").show();
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
		document.getElementById("CallPhoneNumberValue").innerHTML = '';
		document.getElementById("CallCampaignValue").innerHTML = '';
		//$("#frmDados").hide();
		$('#cti-attendance').hide();
		//$('#cliente-off').show();
		$('#call-duration-count').html("00:00:00");
		$('#call-duration-count').hide();
		$("#CallState").text("Livre");
	    timer.stop();
		if (blnscreenpop)
		{
			cti.UpdateTask(currentCreatedTaskId);
			blnscreenpop = false;
		}	
		timer.stop();
		$('#call-duration-count').html("00:00:00");
		$('#call-duration-count').hide();
		$('#tempochamada').hide();
	}
	if (strtalkState=="OnCall")
	{
		$("#frmDados").show();
		$('#cti-attendance').show();
		$('#cliente-off').hide();
		$('#tempochamada').show();
		$("#CallState").text("Ocupado");
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
	if (strCallState=="")
	{
		callconnected = false;
		$("#BT_LOGOUT").prop( "disabled", false );
	}
	
	if(event.hasOwnProperty('PauseReason'))
	{
		$("#selreason").empty();
		strPauseReason = event.PauseReason;	
		for (i in strPauseReason) {
		  $("#selreason").append('<option value="'+strPauseReason[i].id + '">' + strPauseReason[i].reason + '</option>');
		  //if (strPauseReason[i].id == event.reasonCode) strPause = strPauseReason[i].reason;
		}
	}
	if(event.hasOwnProperty('MatrizTransf'))
	{
		$("#seltransf").empty();
		strMatrizTransf = event.MatrizTransf;	
		for (i in strMatrizTransf) {
		  $("#seltransf").append('<option value="'+strMatrizTransf[i].id + '">' + strMatrizTransf[i].destino + '</option>');
		}
		$("#seltransf").val('');		
	}
	
	$('#TXT_AGENT_DISPLAY').html(event.agentState);
	//agentNotReady
	var strSpace = '                                      ';
	switch (event.agentState) {
	  case 'agentNotReady':
		for (i in strPauseReason) {
		  if (strPauseReason[i].id == event.reasonCode) strPause = strPauseReason[i].reason;
		}
		strPause = 'Pausa ('+strPause.toLowerCase()+')';
		//$('#TXT_AGENT_DISPLAY').html('PAUSA (' + strPause + ')');
		//reasonCode
		break;
	  case 'agentReady':
		strPause = 'Disponível';
		$("#selreason").val('');
		//$('#TXT_AGENT_DISPLAY').html('DISPONÍVEL');
		break;
	  case 'agentNull':
	    strPause = 'Deslogado';
		//$('#TXT_AGENT_DISPLAY').html('DESLOGADO');
		break;
	  case 'agentBusy':
	  	strPause = 'Atendimento';
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

	$('#TXT_MESSAGES').val("");
	//$('#TXT_MESSAGES').show();
	
	//cti.SetStatus('0N56g000000GsIA');
	//ConfigCTI();
	//
	var object = new Object();
	object.type = "login";
	object.extension = $('#TXT_AGENT_EXTENSION').val();
	object.agent = $('#TXT_AGENT').val();
	object.password = $('#TXT_AGENT_PASSWORD').val();
	if (!reqCTIConfigWS)
	{
		//reqCTIConfigWS='wss://conectorsalesforcevolks.csu.com.br/hml/bettacti.svc?Instance=avaya';
		reqCTIConfigWS='wss://old.c2x.com.br/BettaCTIWeb/bettacti.svc?Instance=avaya';
	}
	object.server= reqCTIConfigWS;
	api.login(object.agent, object.password,object.extension, object.server)
	
	validate_login();
	
	//cti.saveLog(object);
	
}

function fnCallFlow()
{
	self.searchPromise = new Promise(function (resolve, reject) {
	sforce.opencti.screenPop({
		type: sforce.opencti.SCREENPOP_TYPE.FLOW,
		params: {flowDevName: "CTI",
			 flowArgs: [
						   {"name": "cpfCnpj", "type": "String", "value": strCNPJ},
						   {"name": "contractCode", "type": "String", "value": strContrato},
						   {"name": "senhaValidada", "type": "String", "value": strconfsenha},
						   {"name": "positivacao", "type": "String", "value": strconfpositivacao},
						   {"name": "produto", "type": "String", "value": strProduto},
						   {"name": "token", "type": "String", "value": strToken},
						   {"name": "vdn", "type": "String", "value": strOrigem},
						   {"name": "identificadorLigacao", "type": "String", "value": UCID},
						   {"name": "numeroTelefoneOrigem", "type": "String", "value": strANI}
					   ]}
		});
	});
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
	
	api.logout();
	validate_logout();
}

function Ready() {	    

	api.ready();
}

function Pause() {	    

	var strreason = document.getElementById("selreason");
	if (strreason.value==100) //ready
	{
		api.ready();
	} else	
	{
		api.pause(strreason.value);
	}
	
	 //data-dismiss="modal"
	$('#modalPause').modal('hide');

	//$("#pausereason").hide();
}

function MatrizTranf() {	    
	$('#modalMakeCall').modal('hide');
	$("#frmDados").show();
	var toaddress = document.getElementById("seltransf");
	
	if (callconnected == true)
	{
		api.consultationcall(toaddress.value);
	} 
	else
	{
		api.makecall(toaddress.value);
	}
	$("#seltransf").val('');
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

/*** GENERAL UTILITIES **/
function LZ(x) { return (x < 0 || x > 9 ? "" : "0") + x }
//});
