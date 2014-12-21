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

    function Dispatcher() {
        var _lastID = 1;
        var _prefix = 'ID_';

        this._callbacks = {};
        this._isPending = {};
        this._isHandled = {};
        this._isDispatching = false;
        this._pendingPayload = null;

        this.register = function(callback) {
            var id = _prefix + _lastID++;
            this._callbacks[id] = callback;
            return id;
        };

        this.unregister = function(id) {
            if (!this._callbacks.hasOwnProperty(id)) {
                throw new Error('Unregister: id does not exist');
            }
            delete this._callbacks[id];
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

        this.dispatch = function(payload) {
            if (this._isDispatching) {
                throw new Error('Dispatch.dispatch: Cannot dispatch in the middle of a dispatch');
            }
            this._startDispatching(payload);
            try {
                for (var id in this._callbacks) {
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
            this._callbacks[id](this._pendingPayload);
            this._isHandled[id] = true;
        };

        this._startDispatching = function(payload) {
            for (var id in this._callbacks) {
                this._isPending[id] = false;
                this._isHandled[id] = false;
            }
            this._pendingPayload = payload;
            this._isDispatching = true;
        };

        this._stopDispatching = function() {
            this._pendingPayload = null;
            this._isDispatching = false;
        };
        
    }

    var songDispatcher= angular.module('songDispatcher', []);
    songDispatcher.factory('songDispatcherFactory', function() {
        var dispatchers = new WeakMap();

        function createDispatcher(ngModule) {
            var dispatcher = new Dispatcher();
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

