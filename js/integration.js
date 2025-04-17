/*
Salesforce.com Integration Toolkit 26.0
Copyright, 2012, salesforce.com, inc.
All Rights Reserved
 */

window.sforce = window.sforce || {};

sforce.console = (function() {
    var VERSION = '26.0';
    var CALLEE_NAME = 'sfdc-console';
    var txn_id = 0;
    var ON_CALL_END = 'onCallEnd';
    var ADD_EVENT_LISTENER = 'addEventListener';
    var ADD_PUSH_NOTIFICATION_LISTENER = 'addPushNotificationListener';
    var caller;
    var registry;
    
    var postMessageClient = {
        nonce : null,
        sfdcOrigin : null,
        INTEGRATION_API : 'integrationApi/',
        
        usePostMessage : function () {
            // set sfdc frame origin and nonce needed by API calls.
            var params = this.parseUrlQueryString(location.search);
            this.sfdcOrigin = params.sfdcIFrameOrigin;
            this.nonce = params.nonce;
            
            return !!window.postMessage && params.sfdcIFrameOrigin && params.nonce;
        },
        
        initialize : function() {
            if (window.attachEvent) {
                window.attachEvent('onmessage', this.processPostMessage);
            } else {
                window.addEventListener('message', this.processPostMessage, false);
            }
        },
        
        registry : (function() {
            var registry = {};
            return {
                registerFunction:function(funcName, func, scope) {
                    registry[funcName] = {func:func, scope:scope};
                },
        
                getFunction:function(funcName) {
                    return registry[funcName];
                },
        
                removeFunction:function(funcName) {
                  delete registry[funcName];
                }
            };})(),
        
        parser : (function() {
            var BOOLEAN_TYPE = 'b';
            var STRING_TYPE = 's';
            var ARRAY_TYPE = 'a';
            var ARG_DELIM = '&';
            var ARRAY_DELIM = ';';
            var TYPE_DELIM = ':';
            var VAL_DELIM = '=';
            
            function isArray(a) {
                return Object.prototype.toString.apply(a) === '[object Array]';
            }
            
            function flattenArray(arr) {
                var arr_delim = '';
                var arr_str = '';
                for (var i = 0; i < arr.length; i++) {
                    arr_str += arr_delim + encodeURIComponent(arr[i]);
                    arr_delim = ARRAY_DELIM;
                }
                return arr_str;
            }
            
            return {
                parse:function(message) {
                    var query = {};
                    var parts = message.split(ARG_DELIM);
        
                    for(var i = 0; i < parts.length; i++) {
                        var pair = parts[i].split(VAL_DELIM);
                        var value = pair[1].split(TYPE_DELIM);
                        var parsedValue; 
                        if (value[0] === ARRAY_TYPE) {
                            var arr = value[1].split(ARRAY_DELIM);
                            parsedValue = [];
                            for(var j = 0; j < arr.length; j++) {
                                parsedValue[j] = decodeURIComponent(arr[j]);
                            } 
                        } else {
                            parsedValue = decodeURIComponent(value[1]);
                        }
                        if (value[0] === BOOLEAN_TYPE) {
                            parsedValue = parsedValue === 'true';
                        }
                        query[decodeURIComponent(pair[0])] = parsedValue;
                    }
                    return query;
                },
                stringify:function(obj) {
                    var delim = '';
                    var str = '';
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                              var type;
                              if (isArray(obj[key])) {
                                str += delim + encodeURIComponent(key) + VAL_DELIM + ARRAY_TYPE + TYPE_DELIM + flattenArray(obj[key]);
                              } else {
                                type = typeof(obj[key]) === 'boolean' ? BOOLEAN_TYPE : STRING_TYPE;
                                str += delim + encodeURIComponent(key) + VAL_DELIM  + type  + TYPE_DELIM + encodeURIComponent(obj[key]);
                             }
        
                              delim = ARG_DELIM;
                        }
                    }
                    return str;
                }
            };
        })(),
        
        /**
         * send message to sfdc client side using HTML5 postMessages
         */
        doPostMessage: function(event) {
            var id = event.calleeName + '_' +  'proxyFrame' + '_' + event.txn_id;
            
            var argsContext = {};
            if (typeof(event.name) !== 'undefined') argsContext.xdomain_name = event.name;
            if (typeof(event.calleeName) !== 'undefined') argsContext.xdomain_targetFrame = event.calleeName;
            if (typeof(event.txn_id) !== 'undefined') argsContext.xdomain_txnId = event.txn_id;
            if (typeof(event.pathToOriginProxy) !== 'undefined') argsContext.xdomain_pathToOriginProxy = event.pathToOriginProxy;
            if (typeof(event.targetParentFrame) !== 'undefined') argsContext.xdomain_targetParentFrame = event.targetParentFrame;
            argsContext.xdomain_originFrame = window.name;
            argsContext.nonce = this.nonce;
            
            var message = this.parser.stringify(argsContext);
            if (typeof(event.args) !== 'undefined') {
                message += '&' +  this.parser.stringify(event.args);
            }
            
            top.postMessage(this.INTEGRATION_API + message, this.sfdcOrigin);
        },
        
        /**
         * Receives message from sfdc and executes callback
         */
        processPostMessage: function(event) {
            var xdomainArgs = {};
            var targetParentFrame;
            var callRegistry;
            var result;
            
            if (event.origin !== postMessageClient.sfdcOrigin) {
                // Only trust messages coming from SFDC origin
                return;
            }
            
            if (event.data && event.data.indexOf(postMessageClient.INTEGRATION_API) !== 0) {
                return;
            }
            
            // strip off API target
            var message = event.data.replace(postMessageClient.INTEGRATION_API, '');

            // parse message received from sfdc
            result = postMessageClient.parser.parse(message);
            result.args = postMessageClient.parser.parse(result.args);
            
            callRegistry = registry.getFunction(result.name);
            xdomainArgs.frameId = result.originFrame;
            
            if (typeof(callRegistry) !== 'undefined') {
                callRegistry.func.call(callRegistry.scope, result.args, xdomainArgs);
            }
        },
        
        /**
         * Utility method to create a query string object.
         */
        parseUrlQueryString: function(queryString) {
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
    };
            
    /**
     * Initialize cross domain communication using iframe proxy or HTML5 PostMessage.
     * If browser supports PostMessage, use this approach.
     * Else use iframe proxy approach.
     */
    if (postMessageClient.usePostMessage()) {
        // use postMessage framework
        registry = postMessageClient.registry;
        postMessageClient.initialize();
    } else if (window.Sfdc && Sfdc.xdomain) {
        // use iframe proxy
        caller = Sfdc.xdomain.Caller;
        registry = Sfdc.xdomain.CrossDomainApiRegistry;
    } else {
        if (window.console && console.log) {
            console.log('Service Cloud Toolkit API cannot be used with your browser.');
        }
    }

    /**
     * Wrap a callback to remove the callback from the registry and execute the callback
     */
    function wrapCallback(fname, callback, args) {
        if (args.event) {
            var handlers;
            var isGlobalEvent = fname === ADD_EVENT_LISTENER;
            if (fname === ON_CALL_END) {
                // special CTI event handlers
                // if call object id is provided associate event handler with it, otherwise event handler is called for all call object ids
                handlers = [{fn:callback, id:args.callObjectId}];
            } else if (isGlobalEvent) {
                // global event handlers
                handlers = {};
                handlers[args.eventType] = [callback];
            } else {
                // standard event handlers
                handlers = [callback];
            }

            return new (function() {

                // add an event handler, return true if the event type already exists, false otherwise
                // for standard event types, it always return true
                this.add = function(eventHandler, args) {
                    var isExistingEventType = true;
                    if (fname === ON_CALL_END) {
                        handlers.push({fn:eventHandler, id:args.callObjectId});
                    } else if (isGlobalEvent) {
                        if (!handlers[args.eventType]) {
                            isExistingEventType = false;
                            handlers[args.eventType] = [];
                        }
                        handlers[args.eventType].push(eventHandler);
                    } else {
                        handlers.push(eventHandler);
                    }
                    return isExistingEventType;
                };

                // delete an event handler, return true if cross-domain clean-up is needed, false otherwise
                this.del = function(eventHandler, args) {
                    if (isGlobalEvent) {
                        var handlerFns = handlers[args.eventType];
                        var cleanUpOptions = {unregisterFrameForEvent : false, unregisterFrameForEveryEvent : false};

                        if (!handlerFns) {
                            return cleanUpOptions;
                        }

                        for (var i = 0; i < handlerFns.length; i++) {
                            if (handlerFns[i] === eventHandler) {
                                handlerFns.splice(i, 1);
                                break;
                            }
                        }

                        if (handlerFns.length === 0) {
                            // this frame no longer has handlers for this event type
                            cleanUpOptions.unregisterFrameForEvent = true;
                        }

                        for (var eventType in handlers) {
                            if (handlers.hasOwnProperty(eventType)) {
                                if (handlers[eventType].length > 0) {
                                    return cleanUpOptions;
                                }
                            }
                        }

                        // this frame no longer has handlers for any global event
                        cleanUpOptions.unregisterFrameForEveryEvent = true;
                        registry.removeFunction(ADD_EVENT_LISTENER);
                        return cleanUpOptions;
                    }
                    // implicitly return undefined if it's called upon a non-global event handler
                };

                this.call = function(scope, args, xdomainArgs, callback) {
                    if (isGlobalEvent) {
                        var handlerFns = handlers[args.eventType] ? handlers[args.eventType] : [];

                        // no need to pass eventType to the listeners
                        delete args.eventType;
                        for (var i = 0; i < handlerFns.length; i++) {
                            handlerFns[i].call(scope, args, xdomainArgs, callback);
                        }
                    } else {
                        var i=0;
                        while (i<handlers.length) {
                            if (typeof handlers[i].fn === 'function') {
    
                                // skip if id is null or id not equal to call object id
                                if (!!handlers[i].id && handlers[i].id !== args.id) {
                                    continue;
                                }
    
                                handlers[i].fn.call(scope, args, xdomainArgs, callback);
    
                                // remove handler if id equals call object id
                                if (handlers[i].id === args.id) {
                                    handlers.splice(i, 1);
                                    i--;
                                }
                            } else {
                                handlers[i].call(scope, args, xdomainArgs, callback);
                            }
                            i++;
                        }
                    }
                };
            })();
        } else {
            return function(args) {
                registry.removeFunction(fname);
                callback.call(this, args);
            };
        }
    }

    function getPathToOriginProxy() {
        var url = window.location.toString();
        var protocolDelim = "://";
        var domainDelims = ["/", "?", "#"];
        var start = url.indexOf(protocolDelim);
        var protocol = "";
        if (-1 !== start) {
            var parts = url.split(protocolDelim);
            protocol = parts[0] + protocolDelim;
            url = parts[1];
            for(var i = 0; i < domainDelims.length; i++) {
                var end = url.indexOf(domainDelims[i]);
                if (-1 !== end) {
                    url = url.substring(0, end);
                    break;
                }
            }
        }
        return protocol + url;
    }
    
    /**
     * Make a call to the callee domain
     */
    function execute(fname, args, callback) {

        if (typeof(callback) !== 'undefined') {
            var functionName = args.event ? fname : fname + '_' + txn_id;
            if (args.event && registry.getFunction(functionName)) {
                var isExistingEventType = registry.getFunction(functionName).func.add(callback, args);
                if (isExistingEventType) {
                    // since the event type already exists, return right away to avoid an unnecessary x-domain call
                    return;
                } // for global event, do an x-domain call to update the registry
            } else {
                registry.registerFunction(functionName, wrapCallback(functionName, callback, args), this);
            }
        }
        var callContext = {};
        callContext.pathToTargetProxy = caller ? Sfdc.xdomain.sfdcXDomainProxy : '';
        callContext.name = fname;
        callContext.args = args;
        callContext.calleeName = CALLEE_NAME;
        callContext.txn_id = txn_id;
        callContext.pathToOriginProxy = getPathToOriginProxy() + (caller ? '/crossDomainProxy.html' : '');
        txn_id++;
        
        if (postMessageClient.usePostMessage()) {
            postMessageClient.doPostMessage(callContext);
        } else {
            caller.call(callContext);
        }
    }

    /**
     * Encode boolean parameter
     *
     * if true, return string "true"
     * false, return an empty string [represent false value in js]
     */
    function encodeBooleanParam(param) {
        return !!param;
    }

    /**
     * Validate the event type used in Global Event Model. Return true if valid, false otherwise.
     */
    function validateEventType(eventType) {
        return eventType && (typeof eventType === 'string');
    }

    /**
     * Validate the event handler used in Global Event Model. Return true if valid, false otherwise.
     */
    function validateEventHandler(eventHandler) {
        return eventHandler && (typeof eventHandler === 'function');
    }

    return {
        /**
         * Create a Workspace with the given url. If the workspace already exists, navigate it to the url.
         * @param version
         * @param id (optional) id of an existing Workspace
         * @param url url of the Workspace
         * @param activate true to make the Workspace activate, false otherwise
         * @param label String text to put into the Workspace tab
         * @param callback (optional) a callback function to be invoked after the function exits.
         */
        openPrimaryTab: function (id, url, activate, label, callback, name) {
            var args = {};
            if (id) args.id = id;
            if (typeof(url) !== 'undefined') args.url = url;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            if (typeof(label) !== 'undefined') args.label = label;
            if (typeof(name) !== 'undefined') args.name = name;
            args.version = VERSION;
            execute('openPrimaryTab', args, callback);
        },

        /**
         * Open a subtab
         * @param id (optional) id of an existing view
         * @param workspaceId id of an existing workspace
         * @param url
         * @param activate
         * @param label
         * @param name
         */
        openSubtab:function(workspaceId, url, activate, label, id, callback, name) {
            var args = {};
            if (workspaceId) args.workspaceId = workspaceId;
            if (typeof(url) !== 'undefined') args.url = url;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            if (typeof(label) !== 'undefined') args.label = label;
            if (id) args.id = id;
            if (name) args.name = name;
            args.version = VERSION;
            execute('openSubTab', args, callback);
        },
        /**
         * Open a subtab
         * @param id (optional) id of an existing view
         * @param workspaceName name of an existing workspace
         * @param url
         * @param activate
         * @param label
         * @param name
         */
        openSubtabByPrimaryTabName:function(workspaceName, url, activate, label, id, callback, name) {
            var args = {};
            if (workspaceName) args.workspaceName = workspaceName;
            if (typeof(url) !== 'undefined') args.url = url;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            if (typeof(label) !== 'undefined') args.label = label;
            if (id) args.id = id;
            if (name) args.name = name;
            args.version = VERSION;
            execute('openSubtabByWorkSpaceName', args, callback);
        },

        /**
         * Get enclosing tab id of this frame
         */
        getEnclosingTabId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getEnclosingTabId', args, callback);
        },

        /**
         * Get the primary tab id of this subtab
         * @param frameId id of of the current frame
         */
        getEnclosingPrimaryTabId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getEnclosingPrimaryTabId', args, callback);
        },

        /**
         * Gets the primary tab object id of this subtab
         */
        getEnclosingPrimaryTabObjectId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getEnclosingPrimaryTabObjectId', args, callback);
        },
        
        /**
         * Returns the currently opened primary tab ids
         */
        getPrimaryTabIds:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getPrimaryTabIds', args, callback);
        },

        /**
         * Returns the currently opened sub tab ids
         */
        getSubtabIds:function(primaryTabId, callback) {
            var args = {};
            args.version = VERSION;
            if (primaryTabId) {
                args.primaryTabId = primaryTabId;
            }
            execute('getSubtabIds', args, callback);
        },
        
        /**
         * Returns the page info of the entity specified by the tab
         */
        getPageInfo:function(tabId, callback) {
            var args = {};
            args.version = VERSION;
            if (tabId) {
                args.tabId = tabId;
            }
            execute('getPageInfo', args, callback);
        },

        /**
         * Gets the object id of the focused subtab
         */
        getFocusedSubtabObjectId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getFocusedSubtabObjectId', args, callback);
        },

        resetSessionTimeOut:function() {
            var args = {};
            args.version = VERSION;
            execute('resetSessionTimeOut', args);
        },

        /**
         * Sets the tab title of the enclosing tab
         * @param frameId
         * @param label
         * @param tabId
         */
        setTabTitle:function(label, tabId) {
            var args = {};
            args.label = label;
            if (tabId) {
                args.tabId = tabId;
            }
            args.version = VERSION;
            execute('setTabTitle', args);
        },

        /**
         * Closes the tab with the given id. Note that closing the first tab in a primary tab closes the primary tab itself
         * @param id id of the view or workspace to close
         */
        closeTab:function(id) {
            var args = {};
            args.id = id;
            args.version = VERSION;
            execute('closeTab', args);
        },

        /**
         * Return true if this page is a console page
         */
        isInConsole: function() {
            var qs = location.search;
            return !(typeof sforce != "undefined" && sforce.one) &&
                (qs.length != 0 && ((qs.indexOf("?isdtp=") > -1) || (qs.indexOf("&isdtp=") > -1)));
        },

        /**
         * Refreshes the tab with the given id with the last known url. Note that if the frame is cross-domain, our knowledge of the last known
         * url could be very stale. Api users should really be handling their own refreshes
         * @param version
         * @param id id of the view to refresh with last known url
         * @param activate true to activate this tab
         */
        refreshSubtabById: function(id, activate, callback) {
            var args = {};
            if (id)args.id = id;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            args.version = VERSION;
            execute('refreshSubtabById', args, callback);
        },
        /**
         * Refreshes the tab with the given subtab name and its workspace name with the last known url. Note that if the frame is cross-domain, our knowledge of the last known
         * url could be very stale. Api users should really be handling their own refreshes
         * @param version
         * @param name name of the subtab to refresh with last known url
         * @param workspaceName name of the primary tab of the subtab
         * @param activate true to activate this tab
         */
        refreshSubtabByNameAndPrimaryTabName: function(name, workspaceName, activate, callback) {
            var args = {};
            if (name) args.name = name;
            if (workspaceName) args.workspaceName = workspaceName;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            args.version = VERSION;
            execute('refreshSubtabByNameAndWorkspaceName', args, callback);
        },

        /**
         * Refreshes the tab with the given subtab name and its workspace id with the last known url. Note that if the frame is cross-domain, our knowledge of the last known
         * url could be very stale. Api users should really be handling their own refreshes
         * @param version
         * @param name name of the subtab to refresh with last known url
         * @param workspaceId id of the primary tab of the subtab
         * @param activate true to activate this tab
         */
        refreshSubtabByNameAndPrimaryTabId: function(name, workspaceId, activate, callback) {
            var args = {};
            if(name) args.name = name;
            if(workspaceId) args.workspaceId = workspaceId;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            args.version = VERSION;
            execute('refreshSubtabByNameAndWorkspaceId', args, callback);
        },

        /**
         * Refreshes the primary tab with the given id. Note the each tab refresh behavior is the same as refreshSubtab methods
         * @param workspaceId id of the primary tab
         * @param activate true to activate this tab
         */
        refreshPrimaryTabById: function(id, activate, callback) {
            var args = {};
            if(id) args.id = id;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            args.version = VERSION;
            execute('refreshPrimaryTabById', args, callback);
        },

        /**
         * Refreshes the primary tab with the given name. Note the each tab refresh behavior is the same as refreshSubtab methods
         */
        refreshPrimaryTabByName: function(name, activate, callback) {
            var args = {};
            if(name) args.name = name;
            if (typeof(activate) !== 'undefined') args.activate = encodeBooleanParam(activate);
            args.version = VERSION;
            execute('refreshPrimaryTabByName', args, callback);
        },

        /**
         * Activates the tab with the given id
         * @param version
         * @param id id of the view
         */
        focusSubtabById: function(id, callback) {
            var args = {};
            if (id)args.id = id;
            args.version = VERSION;
            execute('focusSubtabById', args, callback);
        },

        /**
         * Activates the tab with the given subtab name and its workspace name
         * @param version
         * @param name name of the subtab
         * @param workspaceName name of the primary tab of the subtab
         */
        focusSubtabByNameAndPrimaryTabName: function(name, workspaceName, callback) {
            var args = {};
            if (name) args.name = name;
            if (workspaceName) args.workspaceName = workspaceName;
            args.version = VERSION;
            execute('focusSubtabByNameAndWorkspaceName', args, callback);
        },

        /**
         * Activates the tab with the given subtab name and its workspace id
         * @param version
         * @param name name of the subtab to refresh with last known url
         * @param workspaceId id of the primary tab of the subtab
         */
        focusSubtabByNameAndPrimaryTabId: function(name, workspaceId, callback) {
            var args = {};
            if(name) args.name = name;
            if(workspaceId) args.workspaceId = workspaceId;
            args.version = VERSION;
            execute('focusSubtabByNameAndWorkspaceId', args, callback);
        },

        /**
         * Activates the primary tab with the given id.
         * @param workspaceId id of the primary tab
         */
        focusPrimaryTabById: function(id, callback) {
            var args = {};
            if(id) args.id = id;
            args.version = VERSION;
            execute('focusPrimaryTabById', args, callback);
        },

        /**
         * Activates the primary tab with the given name.
         */
        focusPrimaryTabByName: function(name, callback) {
            var args = {};
            if(name) args.name = name;
            args.version = VERSION;
            execute('focusPrimaryTabByName', args, callback);
        },

        /**
         * sets myself dirty
         * @param dirtyState to set current tab to dirty, can be true or false
         * @param callback
         * @param subtabId
         */
        setTabUnsavedChanges:function(dirtyState, callback, subtabId) {
            var args = {};
            if (typeof(dirtyState) !== 'undefined') args.isDirty = encodeBooleanParam(dirtyState);
            args.version = VERSION;
            if (subtabId) {
                args.subtabId = subtabId;
            }
            execute('setTabDirty', args, callback);
        },

        /**
         * Register event handler that will be fired when focus changes to a different subtab
         */
        onFocusedSubtab:function(eventHandler) {
            var args = {};
            args.version = VERSION;
            args.event = true;
            execute('onFocusedSubtab', args, eventHandler);
        },

        /**
         * Register event handler that will be fired when focus changes to a different subtab
         */
        onFocusedPrimaryTab:function(eventHandler) {
            var args = {};
            args.version = VERSION;
            args.event = true;
            execute('onFocusedPrimaryTab', args, eventHandler);
        },

        /**
         * Register event handler that will be fired when enclosing tab refreshes
         */
        onEnclosingTabRefresh:function(eventHandler) {
            var args = {};
            args.version = VERSION;
            args.event = true;
            execute('onEnclosingTabRefresh', args, eventHandler);
        },

        /**
         * Console-level API
         */

        /**
         * Get the id of the currently focused primary tab
         */
        getFocusedPrimaryTabId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getFocusedPrimaryTabId', args, callback);
        },

        /**
         * Get the object id of the currently focused primary tab
         */
        getFocusedPrimaryTabObjectId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getFocusedPrimaryTabObjectId', args, callback);
        },

        /**
         * Get the id of the currently focused subtab
         */
        getFocusedSubtabId:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('getFocusedSubtabId', args, callback);
        },

        /**
         * Custom Console Component API
         */

        /**
         * Check if the current page is rendered within a Custom Console Component
         */
        isInCustomConsoleComponent:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('isInCustomConsoleComponent', args, callback);
        },

        /**
         * Set the button text of the Custom Console Component in which the page is rendered
         */
        setCustomConsoleComponentButtonText:function(text, callback) {
            var args = {};
            args.version = VERSION;
            args.text = text;
            execute('setCustomConsoleComponentButtonText', args, callback);
        },

        /**
         * Set the button style of the Custom Console Component in which the page is rendered
         */
        setCustomConsoleComponentButtonStyle:function(style, callback) {
            var args = {};
            args.version = VERSION;
            args.style = style;
            execute('setCustomConsoleComponentButtonStyle', args, callback);
        },

        /**
         * Set the button icon URL of the Custom Console Component in which the page is rendered
         */
        setCustomConsoleComponentButtonIconUrl:function(iconUrl, callback) {
            var args = {};
            args.version = VERSION;
            args.iconUrl = iconUrl;
            execute('setCustomConsoleComponentButtonIconUrl', args, callback);
        },

        /**
         * Set the window visibility of the Custom Console Component in which the page is rendered
         */
        setCustomConsoleComponentWindowVisible:function(visible, callback) {
            var args = {};
            args.version = VERSION;
            args.visible = encodeBooleanParam(visible);
            execute('setCustomConsoleComponentWindowVisible', args, callback);
        },

        /**
         * Know if the Custom Console Component window is visible or not
         */
        isCustomConsoleComponentWindowHidden:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('isCustomConsoleComponentWindowHidden', args, callback);
        },

        /**
         * Register event handler that will be called when the Custom Console Component button is clicked
         */
        onCustomConsoleComponentButtonClicked:function(eventHandler) {
            var args = {};
            args.version = VERSION;
            args.event = true;
            execute('onCustomConsoleComponentButtonClicked', args, eventHandler);
        },

        /**
         * Scroll the button text of the Custom Console Component in a fixed interval
         */
        scrollCustomConsoleComponentButtonText:function(interval, pixelsToScroll, isLeftScrolling, callback) {
            var args = {};
            args.version = VERSION;
            args.interval = interval;
            args.pixelsToScroll = pixelsToScroll;
            args.isLeftScrolling = encodeBooleanParam(isLeftScrolling);
            execute('scrollCustomConsoleComponentButtonText', args, callback);
        },

        /**
         * Cancel the scrolling of Custom Console Component button text
         */
        removeScrollCustomConsoleComponentButtonText:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('removeScrollCustomConsoleComponentButtonText', args, callback);
        },

        /**
         * Blink the button text of the Custom Console Component in a fixed interval
         */
        blinkCustomConsoleComponentButtonText:function(alternateText, interval, callback) {
            var args = {};
            args.version = VERSION;
            args.alternateText = alternateText;
            args.interval = interval;
            execute('blinkCustomConsoleComponentButtonText', args, callback);
        },

        /**
         * Cancel the blinking of Custom Console Component button text
         */
        removeBlinkCustomConsoleComponentButtonText:function(callback) {
            var args = {};
            args.version = VERSION;
            execute('removeBlinkCustomConsoleComponentButtonText', args, callback);
        },

        /**
         * Add a listener for the specified event type
         */
        addEventListener:function(eventType, eventHandler) {
            if (!(validateEventType(eventType) && validateEventHandler(eventHandler))) {
                return;
            }

            var args = {};
            args.version = VERSION;
            args.event = true;
            args.eventType = eventType;
            execute(ADD_EVENT_LISTENER, args, eventHandler);
        },

        /**
         * Remove a listener for the specified event type
         */
        removeEventListener:function(eventType, eventHandler) {
            if (!(validateEventType(eventType) && validateEventHandler(eventHandler))) {
                return;
            }

            var args = {};
            args.version = VERSION;
            args.eventType = eventType;
            var cleanUpOptions = registry.getFunction(ADD_EVENT_LISTENER).func.del(eventHandler, args);
            if (cleanUpOptions) {
                args.unregisterFrameForEvent = cleanUpOptions.unregisterFrameForEvent;
                args.unregisterFrameForEveryEvent = cleanUpOptions.unregisterFrameForEveryEvent;
            }

            if (args.removeFrameFromEvent || args.removeFrameFromEveryEvent) {
                execute('removeEventListener', args);
            }
        },

        /**
         * Fire an event of the specified type
         */
        fireEvent:function(eventType, message, callback) {
            if (!validateEventType(eventType)) {
                return;
            }

            var args = {};
            args.version = VERSION;
            args.eventType = eventType;
            args.message = message;
            execute('fireEvent', args, callback);
        },
        
                
        /**
         * add a listener to a push notification based on given entities
         */          
        addPushNotificationListener:function(entities, callback) {
            var args = {};
            // only allow one listener
            if (registry.getFunction(ADD_PUSH_NOTIFICATION_LISTENER)) {
                if (window.console && console.log) {
                    console.log('There already exists a listener for the push notification on this page');
                }
                return false;
            }
            args.version = VERSION;
            args.entities = entities;
            args.event = true;
            execute(ADD_PUSH_NOTIFICATION_LISTENER, args, callback);
        },

        removePushNotificationListener:function(callback) {
            if (registry.getFunction(ADD_PUSH_NOTIFICATION_LISTENER)) {
                registry.removeFunction(ADD_PUSH_NOTIFICATION_LISTENER);
                var args = {};
                args.version = VERSION;
                execute('removePushNotificationListener', args, callback);
            }
        },
        
        /**
         * CTI Toolkit API
         */
        cti: {
            /**
             * Returns active call object ids in the order in which they arrived.
             */
            getCallObjectIds:function(callback) {
                var args = {};
                args.version = VERSION;
                execute('getCallObjectIds', args, callback);
            },

            /**
             * Returns JSON formatted call attached data of current call, taken from screen pop payload.
             */
            getCallAttachedData:function(callObjectId, callback) {
                var args = {};
                args.version = VERSION;
                args.callObjectId = callObjectId;
                execute('getCallAttachedData', args, callback);
            },

            /**
             * Register event handler that will be fired when a call begins.
             */
            onCallBegin:function(eventHandler) {
                var args = {};
                args.version = VERSION;
                args.event = true;
                execute('onCallBegin', args, eventHandler);
            },

            /**
             * Register event handler that will be fired when a call ends.
             * CallObjectId is optional, and if specified, event handler is removed after it is fired.
             */
            onCallEnd:function(eventHandler, callObjectId) {
                var args = {};
                args.version = VERSION;
                args.callObjectId = callObjectId ? callObjectId : null;
                args.event = true;
                execute('onCallEnd', args, eventHandler);
            },

            /**
             * Sends a CTI message
             */
            sendCTIMessage:function(msg, callback) {
                var args = {};
                args.version = VERSION;
                args.msg = msg;
                execute('sendCTIMessage', args, callback);
            }
        }
    };
})();