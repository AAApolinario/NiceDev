let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
localStorage.setItem('items', JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem('items'));
var isLogin = false;
//$(document).ready(function() {
	//read_login();

		
	function validate_login(){
		//console.log("validate_login>>");
		localStorage.clear();
		itemsArray = [];
		localStorage.setItem('items', JSON.stringify(itemsArray));
		var auth_user = $('#TXT_AGENT').val().trim();
		//var sip_password = $('#TXT_AGENT_PASSWORD').val().trim();
		//var sip_extension = $('#TXT_AGENT_EXTENSION').val().trim();

		itemsArray.push('{"USER":"' + auth_user + '"}');
		//itemsArray.push('{"PASSWORD":"' + sip_password + '"}');
		//itemsArray.push('{"EXTENSION_NUMBER":"' + sip_extension + '"}');
		itemsArray.push('{"ISLOGIN":"True"}');

		localStorage.setItem('items', JSON.stringify(itemsArray));
	  
		//console.log("validate_login<<");
	};

	function validate_logout(){
		//console.log("validate_logout>>");
		localStorage.clear();
		itemsArray = [];
		localStorage.setItem('items', JSON.stringify(itemsArray));
		var auth_user = $('#TXT_AGENT').val().trim();
		//var sip_password = $('#TXT_AGENT_PASSWORD').val().trim();
		//var sip_extension = $('#TXT_AGENT_EXTENSION').val().trim();

		itemsArray.push('{"USER":"' + auth_user + '"}');
		//itemsArray.push('{"PASSWORD":"' + sip_password + '"}');
		//itemsArray.push('{"EXTENSION_NUMBER":"' + sip_extension + '"}');
		itemsArray.push('{"ISLOGIN":"False"}');
		
		//itemsArray.push(sip_extension);
		localStorage.setItem('items', JSON.stringify(itemsArray));
	  
		//console.log("validate_logout<<");
	};
			
	function read_login(){
		console.log("read_login>>");
		var requiredKeys = ['EXTENSION_NUMBER', 'USER', 'PASSWORD', 'IS_LOGIN'];    
		
				
		data.forEach(item => {
				//console.log("item " + item);
				var result = JSON.parse(item);
				if(result.hasOwnProperty('USER'))
				{
					$('#TXT_AGENT').val(result.USER)
				}
				if(result.hasOwnProperty('PASSWORD'))
				{
					//$('#TXT_AGENT_PASSWORD').val(result.PASSWORD)
				}
				if(result.hasOwnProperty('EXTENSION_NUMBER'))
				{
					//$('#TXT_AGENT_EXTENSION').val(result.EXTENSION_NUMBER)
				}	
				if(result.hasOwnProperty('ISLOGIN'))
				{
					//$('#ISLOGIN').val(result.EXTENSION_NUMBER)
					if (result.ISLOGIN=="True")
					{
						Login();
					}
				}
				
			});

		//console.log("read_login<<");
	};
//});