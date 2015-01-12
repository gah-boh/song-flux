var songFluxOAction = angular.module('songFluxOAction', ['songFlux']);

createAction.$inject = ['$delegate'];
function createAction($delegate) {
    $delegate.createAction = function(Action, dispatcherModuleName) {
        var dispatcher = this.getDispatcher(dispatcherModuleName);
        var ActionFactory = function ActionFactory(args) {
            this.dispatcher = dispatcher;
            Action.apply(this, args);
        };
        var dispatchFn = Action.prototype.dispatch || function() { this.dispatcher.dispatch(this); };

        ActionFactory.prototype = Object.create(Action.prototype);
        angular.extend(ActionFactory.prototype, {dispatch: dispatchFn});

        return function() {
            return new ActionFactory(arguments);
        };
    };
    return $delegate;
}

config.$inject = ['$provide'];
function config($provide) {
    $provide.decorator('songFactory', createAction);
}

songFluxOAction.config(config);

module.exports = songFluxOAction;

