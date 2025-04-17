(function (jQuery) {
	jQuery.oneAgent.contacts = (function (connection) {
		var self = this;
		self.oneAgentAPI = connection.OneAgentWebAPI;
		self.currentTaskID = null;
		self.lastTaskID = null;

		//-------------------------------------------------------------------------------
		// Auxiliary methods
		//-------------------------------------------------------------------------------
		function _appendResponder(responder, name, task) {
			task.done(function (data) {
				console.log('<<<', name);

				if (responder && responder.success) {
					try {
						responder.success(data);
					} catch (e) {
						console.log('... callback err: ', e)
					}
				}
			});

			task.fail(function (data) {
				console.log('<<<(ERROR)', name, ': ', data);

				if (responder && responder.error) {
					try {
						responder.error(data);
					} catch (e) {
						console.log('... callback err: ', e)
					}
				}
			});
		}

		function _startOperation(name) {
			if (!jQuery.oneAgent.getIsInitialized()) {
				console.log('>>>', name, ' error: API not initialized');
				throw new Error('API not initialized');
			}
			console.log('>>>', name);
		}

		//-------------------------------------------------------------------------------
		// AddressBook operations
		//-------------------------------------------------------------------------------

		function initialize() {
			console.log('>>> INIT oneAgent.contacts');

			jQuery.oneAgent.bindEvent('onSearchResult', function (data) {
				if (data) {
					if (belongsToCurrentSearch(data)) {
						if (data.LastResult) {
							console.log('oneAgent.contacts.search <', self.currentTaskID, '> ended');
							self.currentTaskID = null;
						}
					} else {
						console.log('oneAgent.contacts.search result unexpected: <', data.TaskID, '> - current search id: <', self.currentTaskID, '>');
					}
				}
			});

			console.log('<<< INIT oneAgent.contacts');

			return jQuery.oneAgent;
		}

		function search(text, searchCriteria) {
			_startOperation('searchContacts');
			cancelSearch();
			_appendResponder({
				success: function (data) {
					self.currentTaskID = data;
					self.lastTaskID = data;
					console.log('currentTaskID:', self.currentTaskID);
				}
			}, 'searchContacts', self.oneAgentAPI.server.searchContacts(text, searchCriteria));
		}

		function cancelSearch() {
			if (self.currentTaskID) {
				_startOperation('cancelSearch');
				_appendResponder(null, 'cancelSearch',
                self.oneAgentAPI.server.cancelSearch(self.currentTaskID));
				self.currentTaskID = null;
			} else {
				console.log('... nothing to cancel');
			}
		}

		function belongsToCurrentSearch(result) {
			if (result && result.TaskID === self.lastTaskID) {
				return true;
			}
			return false;
		}

		return {
			//AddressBook operations
			'search': search,
			'cancelSearch': cancelSearch,
			'initialize': initialize,
			'belongsToCurrentSearch': belongsToCurrentSearch
		}
	} (jQuery.connection));
} (window.jQuery));