(function (jQuery) {
	jQuery.oneAgent.salesforce = (function (connection) {
		var self = this;

		//-------------------------------------------------------------------------------
		// Auxiliary methods
		//-------------------------------------------------------------------------------

		function _start(request) {
			console.log('>>>', request, ' === ', $.oneAgent);
			$.oneAgent.dispatchLocalEvent('onOperationStarted', { 'request': request });
		}

		function _success(responder, request, data) {
			console.log('<<<', request);

			if (responder && responder.success) {
				try {
					data = data || {}
					data.Succeeded = true;
					responder.success(data);
				} catch (e) {
					console.log('... callback err: ', e)
				}
			}

			$.oneAgent.dispatchLocalEvent('onOperationEnded', { 'request': request, 'failled': false, 'response': data });
		}

		function _error(responder, request, message) {
			console.log('<<<(ERROR)', request, ': ', message);

			if (responder && responder.error) {
				try {
					responder.error({ 'Succeeded': false, 'Error': message });
				} catch (e) {
					console.log('... callback err: ', e)
				}
			}

			$.oneAgent.dispatchLocalEvent('onOperationEnded', { 'request': request, 'failled': true, 'error': message });
		}

		//-------------------------------------------------------------------------------

		function screenPop(url, responder) {
			var requestName = 'salesforce.interaction.screenPop';
			_start(requestName);
			if (typeof (sforce) === 'undefined') {
				_error(responder, requestName, 'SalesForce API Unavailable');
				return;
			}
			sforce.interaction.screenPop(url, function (response) {
				if (response.error) {
					_error(responder, requestName, response.error);
				} else {
					_success(responder, requestName, {'Result' : response.result });
				}
			});
		}

		function searchAndScreenPop(searchParams, queryParams, callType, responder) {
			var requestName = 'salesforce.interaction.searchAndScreenPop';
			_start(requestName);
			if (typeof (sforce) === 'undefined') {
				_error(responder, requestName, 'SalesForce API Unavailable');
				return;
			}
			sforce.interaction.searchAndScreenPop(searchParams, queryParams, callType, function (response) {
				if (response.error) {
					_error(responder, requestName, response.error);
				} else {
					var results = JSON.parse(response.result);
					_success(responder, requestName, { 'Result': results });
				}
			});
		}

		function getPageInfo(responder) {
			var requestName = 'salesforce.interaction.getPageInfo';
			_start(requestName);
			if (typeof (sforce) === 'undefined') {
				_error(responder, requestName, 'SalesForce API Unavailable');
				return;
			}
			sforce.interaction.getPageInfo(function (response) {
				if (response.error) {
					_error(responder, requestName, response.error);
				} else {
					var results = JSON.parse(response.result);
					_success(responder, requestName, { 'Result': results });
				}
			});
		}

		function saveLog(object, saveParams, responder) {
			var requestName = 'salesforce.interaction.saveLog';
			_start(requestName);
			if (typeof (sforce) === 'undefined') {
				_error(responder, requestName, 'SalesForce API Unavailable');
				return;
			}
			sforce.interaction.saveLog(object, saveParams, function (response) {
				if (response.error) {
					_error(responder, requestName, response.error);
				} else {
					_success(responder, requestName, { 'Result': response.result });
				}
			});
		}

		return {
			'screenPop': screenPop,
			'searchAndScreenPop': searchAndScreenPop,
			'getPageInfo': getPageInfo,
			'saveLog': saveLog
		}
	} (jQuery.connection));
} (window.jQuery));