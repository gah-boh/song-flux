function Dispatcher(moduleName) {
    this.id = 'D_' + moduleName;
    this._currentCallbacks = null;

    this._callbacks = new WeakMap();
    this._deregistrations = {};
    this._isPending = {};
    this._isHandled = {};
    this._isDispatching = false;
    this._pendingAction = null;

    var lastID = 0;

    this.register = function(actionCtor, callback) {
        if(!this._callbacks.has(actionCtor)) {
            this._callbacks.set(actionCtor, {});
        }

        var callbackPrefix = this.id+'_'+actionCtor.name+'_';
        var id = callbackPrefix+(++lastID);
        this._callbacks.get(actionCtor)[id] = callback;

        this._deregistrations[id] = (function() {
            if (!this._callbacks.has(actionCtor)) {
                throw new Error('Unregister: action does not exist');
            }
            delete this._callbacks.get(actionCtor)[id];
        }).bind(this);

        return id;
    };

    this.unregister = function(id) {
        this._deregistrations[id]();
        delete this._deregistrations[id];
    };

    this.waitFor = function(ids) {
        if (!this._isDispatching) {
            throw new Error('waitFor: Must be invoked when dispatching');
        }
        ids.forEach(function(id, i) {
            if(this._isPending[i]) {
                if(!this._isHandled[i]) {
                    throw new Error('waitFor: detected circular dependency');
                }
                return;
            }
            this._invokeCallback(id);
        }, this);
    };

    this.dispatch = function(action) {
        if (this._isDispatching) {
            throw new Error('Dispatch.dispatch: Cannot dispatch in the middle of a dispatch');
        }
        this._startDispatching(action);
        try {
            for (var id in this._currentCallbacks) {
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
        this._currentCallbacks[id](this._pendingAction);
        this._isHandled[id] = true;
    };

    this._startDispatching = function(action) {
        this._currentCallbacks = this._callbacks.get(action.constructor);
        for (var id in this._currentCallbacks) {
            this._isPending[id] = false;
            this._isHandled[id] = false;
        }
        this._pendingAction = action;
        this._isDispatching = true;
    };

    this._stopDispatching = function() {
        this._currentCallbacks = null;
        this._pendingAction = null;
        this._isDispatching = false;
    };
    
}

var songFlux= angular.module('songFlux', []);
songFlux.factory('songFactory', function() {
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

module.exports = songFlux;

