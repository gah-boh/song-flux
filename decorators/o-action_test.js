describe('O Action createAction', function() {
    var TestAction;
    var createdAction;

    var testModule;
    var dispatcherMock;

    beforeEach(module('songFluxOAction'));

    beforeEach(function() {
        testModule = angular.module('testModule', []);
    });

    beforeEach(inject(function(songFactory) {
        sut = songFactory;
        dispatcherMock = jasmine.createSpyObj('dispatcherMock', ['dispatch']);
        spyOn(sut, 'getDispatcher').and.returnValue(dispatcherMock);
    }));

    beforeEach(function() {
        TestAction = function TestAction(aProp) {
            this.aProp = aProp;
        };
        TestAction.prototype.customMethod = jasmine.createSpy('customMethod');

        createdAction = sut.createAction(TestAction, 'testModule');
    });

    it('should return a factory function for the action', function() {
        var result = createdAction();
        expect(result instanceof TestAction).toBe(true);
    });

    it('should create an instance of the action with the same constructor', function() {
        var result = createdAction();
        expect(result.constructor).toBe(TestAction);
    });

    it('should have a dispatcher property on the created instance', function() {
        var result = createdAction();
        expect(result.dispatcher).toBe(dispatcherMock);
    });

    it('should have kept the actions constructor function logic', function() {
        var result = createdAction('testProp');
        expect(result.aProp).toBe('testProp');
    });

    it('should have a dispatch method from the base action', function() {
        var result = createdAction();
        expect(result.dispatch).toBeDefined();
    });

    it('dispatch should call the instances dispatcher', function() {
        var result = createdAction();
        result.dispatch();
        expect(dispatcherMock.dispatch).toHaveBeenCalledWith(result);
    });

    it('should allow to change the dispatcher', function() {
        var result = createdAction();
        var otherDispatcher = jasmine.createSpyObj('otherDispatcher', ['dispatch']);
        result.dispatcher = otherDispatcher;
        result.dispatch();
        expect(otherDispatcher.dispatch).toHaveBeenCalled();
        expect(dispatcherMock.dispatch).not.toHaveBeenCalled();
    });

    it('should call the custom dispatch function if supplied', function() {
        var newActionDispatch = jasmine.createSpy('NewAction.dispatch');
        function NewAction() {}
        NewAction.prototype.dispatch = newActionDispatch;
        var action = sut.createAction(NewAction, 'testModule');
        action().dispatch();
        expect(newActionDispatch).toHaveBeenCalled();
    });

    it('should add methods from the custom action prototype', function() {
        var result = createdAction();
        result.customMethod();
        expect(TestAction.prototype.customMethod).toHaveBeenCalled();
    });

});
