/**
 * Interaction API.
 * Version 25.0
 */
window.sforce = window.sforce || {};

sforce.interaction = (function() {
    var frameOrigin = null;
    var nonce = null;
    var callbacks = {};
    var GET_CALL_CENTER_SETTINGS = 'getCallCenterSettings';
    var GET_PAGE_INFO = 'getPageInfo';
    var SET_SOFTPHONE_HEIGHT = 'setSoftphoneHeight';
    var SET_SOFTPHONE_WIDTH = 'setSoftphoneWidth';
    var IS_IN_CONSOLE = 'isInConsole';
    var SCREEN_POP = 'screenPop';
    var SEARCH_AND_SCREEN_POP = 'searchAndScreenPop';
    var ENABLE_CLICK_TO_DIAL = 'enableClickToDial';
    var DISABLE_CLICK_TO_DIAL = 'disableClickToDial';
    var RUN_APEX_QUERY = 'runApex';
    var SAVE_LOG = 'saveLog';
    var SET_VISIBLE = 'setVisible';
    var IS_VISIBLE = 'isVisible';
    var listeners = {onClickToDial:'onClickToDial', onFocus:'onFocus'};
    var methodId = 0;
    
    /**
     * Process messages received from SFDC by executing callbacks, if any.
     * The event object contains the following fields:
     *      method: the API method that was called.
     *      result: result returned from the call.
     *      error: an error message if any errors were encountered.
     */
     function processPostMessage(event) {
        var params;
        try {
            if (event.origin !== frameOrigin) {
                // Only trust messages from the adapter frame
                return;
            }
            
            params = parseUrlQueryString(event.data);
            
            // convert string true/false to boolean for methods that needs to return boolean values.
            if (params && (params.result === 'true' || params.result === 'false')) {
                params.result = params.result === 'true';
            }
            
            // execute callbacks registered for the method called
            for (var methodName in callbacks) {
                if (callbacks.hasOwnProperty(methodName)) {
                    if (params.method === methodName) {
                        for (var i in callbacks[methodName]) {
                            callbacks[methodName][i](params);
                        }
                        if (!listeners[methodName]) {
                            delete callbacks[methodName];
                        }
                    }
                }
            }
        } catch(e) {
            //TODO notify user that processing post message failed
        }
    }
    
    /**
     * Makes an API call to SFDC domain.
     */
    function doPostMessage(params, callback) {
        if (callback) {
            if (listeners[params.method]) {
                if (callbacks[params.method]) {
                    callbacks[params.method].push(callback);
                } else {
                    callbacks[params.method] = [callback];
                }
            } else {
                // API methods that are not listeners needs an ID in case they are call multiple times in an async manner.
                params.method += '_' + methodId;
                callbacks[params.method] = [callback];
                methodId++;
            }
        }
        
        // add nonce to params
        params.nonce = nonce;
        
        if(frameOrigin) {
            window.parent.postMessage(buildQueryString(params), frameOrigin);
        }
    }

    /**
     * Utility method to create a query string object.
     */
    function parseUrlQueryString(queryString) {
        var params = {};
        if (typeof queryString !== 'string') {
            return params;
        }
        
        if (queryString.charAt(0) === '?') {
            queryString = queryString.slice(1);
        }
        
        if (queryString.length === 0) {
            return params;
        }
        
        var pairs = queryString.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            params[pair[0]] = !!pair[1] ? decodeURIComponent(pair[1]) : null;
        }
        
        return params;
    }
    
    /**
     * Utility method to build a query string from key/value object.
     */
    function buildQueryString(params) {
        var qs = '';
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                qs += key + '=' + encodeURIComponent(params[key]) + '&';
            }
        }
        qs = qs.length > 0 ? qs.substr(0, qs.length-1) : qs;
        return qs;
    }
    
    return {
        
        /**
         * Initializes API to listen for responses from SFDC.
         */
        initialize : function() {
            // set sfdc frame origin and nonce needed to call API methods
            var params = parseUrlQueryString(location.search);
            
            // stop initialize if sfdcIFrameOrigin or nonce is missing
            if (!params['sfdcIFrameOrigin'] || !params['nonce']) {
                return;
            }
            
            frameOrigin = params['sfdcIFrameOrigin'];
            nonce = params['nonce'];
            
            // attach postMessage event to handler
            if (window.attachEvent) {
                window.attachEvent('onmessage', processPostMessage);
            } else {
                window.addEventListener('message', processPostMessage, false);
            }
        },
        
        /**
         * Returns true if is in console, false otherwise
         */
        isInConsole : function (callback) {
             doPostMessage({method:IS_IN_CONSOLE}, callback);    
        },
        
        /**
         * Screen pops to targetUrl and returns true if screen pop method was successfully called, false otherwise.
         */
        screenPop : function (targetUrl, callback) {
            doPostMessage({method:SCREEN_POP, targetUrl:targetUrl}, callback);
        },
        
        searchAndScreenPop : function (searchParams, queryParams, callType, callback) {
            doPostMessage({method:SEARCH_AND_SCREEN_POP, searchParams:searchParams, queryParams:queryParams, callType:callType}, callback);    
        },
        
        /**
         * Returns the current page info parameters: page Url, object Id (if applicable), object Name (if applicable), object (if applicable) as a JSON String.
         */
        getPageInfo : function (callback) {
            doPostMessage({method:GET_PAGE_INFO}, callback);
        },
        
        /**
         * Registers a callback to be fired when the page gets focused.
         * When the callback is fired, it returns the current page info parameters: page Url, entity Id (if applicable), entity Name (if applicable) as a JSON String.
         */
        onFocus : function (callback) {
            doPostMessage({method:listeners.onFocus}, callback);  
        },
        
        /**
         * Save object to database and return true if object was saved successfully, false otherwise.
         * objectName is the API name of an object
         * saveParams is a query string representing a key-value pair of object fields to save.
         * Example:
         *      // to save a new record
         *      sforce.interaction.saveLog('Account', 'Name=Acme&Phone=4152125555', callback);
         *      // to update a new record
         *      sforce.interaction.saveLog('Account', 'Id=001D000000J6qIX&Name=UpdatedAcmeName', callback);
         */
        saveLog : function(objectName, saveParams, callback) {
            doPostMessage({method:SAVE_LOG, objectName:objectName, saveParams:encodeURIComponent(saveParams)}, callback);
        },
        
        /**
         * Runs an Apex method from a class with supplied parameters.
         */
        runApex : function(apexClass, methodName, methodParams, callback) {
            doPostMessage({method:RUN_APEX_QUERY, apexClass:apexClass, methodName:methodName, methodParams:methodParams}, callback);
        },
        
        /**
         * Returns true if widget was successfully shown or hidden, false otherwise.
         * Parameter value must be a boolean.
         * Parameter callback must be a function.
         * If false is returned, an error message is also returned.
         */
        setVisible : function (value, callback) {
            doPostMessage({method:SET_VISIBLE, value:value}, callback);
        },
        
        /**
         * Returns true if widget is visible, false otherwise.
         */
        isVisible : function (callback) {
            doPostMessage({method:IS_VISIBLE}, callback);
        },

        cti: {
            /**
             * Gets Call Center Settings.
             */
            getCallCenterSettings : function (callback) {
                doPostMessage({method:GET_CALL_CENTER_SETTINGS}, callback);
            },
            
            /**
             * Sets softphone height. Height must be greater or equal than zero 
             */
            setSoftphoneHeight : function (height, callback) {
                doPostMessage({method:SET_SOFTPHONE_HEIGHT, height:height}, callback);
            },
            
            /**
             * Sets softphone width. Width must be greater or equal than zero.
             */
            setSoftphoneWidth : function (width, callback) {
                doPostMessage({method:SET_SOFTPHONE_WIDTH, width:width}, callback);
            },
            
            /**
             * Enables click to dial.
             */
            enableClickToDial : function (callback) {
                doPostMessage({method:ENABLE_CLICK_TO_DIAL}, callback);
            },
            
            /**
             * Disables click to dial.
             */
            disableClickToDial : function (callback) {
                doPostMessage({method:DISABLE_CLICK_TO_DIAL}, callback);
            },
            
            /**
             * Registers callback to be fired when user clicks to dial.
             */
            onClickToDial : function (callback) {
                doPostMessage({method:listeners.onClickToDial}, callback);
            }
        }
    };
})();

sforce.interaction.initialize();