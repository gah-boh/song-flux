(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.songDispatcher = factory();
    }
}(this, function() {

    function Dispatcher(moduleName) {
        this.id = 'D_' + moduleName;
        this.currentCallbacks = null;

        this._callbacks = new WeakMap();
        this._isPending = {};
        this._isHandled = {};
        this._isDispatching = false;
        this._pendingPayload = null;

        var lastID = 0;
        var callbackPrefix = this.id + '_ID_';

        this.register = function(actionCtor, callback) {
            if(!this._callbacks.has(actionCtor)) {
                this._callbacks.set(actionCtor, {});
            }
            var id = callbackPrefix + (++lastID);
            this._callbacks.get(actionCtor)[id] = callback;
            return id;
        };

        this.unregister = function(action, id) {
            if (!this._callbacks.has(action)) {
                throw new Error('Unregister: action does not exist');
            }
            delete this._callbacks.get(action)[id];
        };

        this.waitFor = function(ids) {
            if (!this._isDispatching) {
                throw new Error('waitFor: Must be invoked when dispatching');
            }
            ids.forEach(function(id, i) {
                if(this._isPending[i]) {
                    if(this._isHandling[i]) {
                        throw new Error('waitFor: detected circular dependency');
                    }
                    return;
                }
                this._invokeCallback(id);
            }, this);
        };

        this.dispatch = function(action) {
            var actionType = action.constructor;
            if (this._isDispatching) {
                throw new Error('Dispatch.dispatch: Cannot dispatch in the middle of a dispatch');
            }
            this._startDispatching(action);
            this.currentCallbacks = this._callbacks.get(actionType);
            try {
                for (var id in this.currentCallbacks) {
                    if(this._isPending[id]) {
                        continue;
                    }
                    this._invokeCallback(id);
                }
            }
            finally {
                this._stopDispatching();
            }
        };

        this.isDispatching = function() {
            return this._isDispatching;
        };

        this._invokeCallback = function(id) {
            this._isPending[id] = true;
            this.currentCallbacks[id](this._pendingPayload);
            this._isHandled[id] = true;
        };

        this._startDispatching = function(payload) {
            for (var id in this.currentCallbacks) {
                this._isPending[id] = false;
                this._isHandled[id] = false;
            }
            this._pendingPayload = payload;
            this._isDispatching = true;
        };

        this._stopDispatching = function() {
            this.currentCallbacks = null;
            this._pendingPayload = null;
            this._isDispatching = false;
        };
        
    }

    var songDispatcher= angular.module('songDispatcher', []);
    songDispatcher.factory('songDispatcherFactory', function() {
        var dispatchers = new WeakMap();

        function createDispatcher(ngModule) {
            var dispatcher = new Dispatcher(ngModule.name);
            dispatchers.set(ngModule, dispatcher);
            return dispatcher;
        }

        return {
            getDispatcher: function(moduleName) {
                var ngModule = angular.module(moduleName);
                return (dispatchers.get(ngModule) || createDispatcher(ngModule));
            }
        };
    });

    return songDispatcher;
}));
