describe('Song Dispatcher', function() {

    var sut;

    beforeEach(module('songDispatcher'));

    describe('factory', function() {

        var moduleA;
        var moduleB;

        describe('getDispatcher', function() {

            beforeEach(function() {
                moduleA = angular.module('moduleA', []);
                moduleB = angular.module('moduleB', []);
            });

            beforeEach(inject(function(songDispatcherFactory) {
                sut = songDispatcherFactory;
            }));

            it('should return a new dispatcher for a module if has not been created', function() {
                var dispatcher = sut.getDispatcher(moduleA.name);
                expect(dispatcher.register).toBeDefined();
            });

            it('should return a dispatcher for a module if it already has been created', function() {
                var firstRequest = sut.getDispatcher(moduleA.name);
                var secondRequest = sut.getDispatcher(moduleA.name);
                expect(firstRequest).toBe(secondRequest);
            });

            it('should return a different dispatcher per module', function() {
                var dispatcherA = sut.getDispatcher(moduleA.name);
                var dispatcherB = sut.getDispatcher(moduleB.name);
                expect(dispatcherA).not.toBe(dispatcherB);
            });

            it('should throw an error if the module does not exist', function() {
                expect(function(){
                    sut.getDispatcher('idonotexist');
                }).toThrowError();
            });

        });

    });

    describe('dispatcher', function() {

        var testModule;

        beforeEach(function() {
            testModule = angular.module('testModule', []);
        });

        beforeEach(inject(function(songDispatcherFactory) {
            sut = songDispatcherFactory.getDispatcher(testModule.name);
        }));

        describe('construction', function() {

            it('should have an id that contains the module name', function() {
                expect(sut.id).toBe('D_testModule');
            });

        });

        describe('register', function() {

            var Action;

            beforeEach(function() {
                Action = function Action() {};
            });

            it('should return an id prefixed by the moduleId', function() {
                var callback = jasmine.createSpy('callback');
                var id = sut.register(Action, callback);
                expect(id).toBe('D_testModule_ID_1');
            });

            it('should return a new id for every registration', function() {
                var callbackOne = jasmine.createSpy('callbackOne');
                var callbackTwo = jasmine.createSpy('callbackTwo');
                var idOne = sut.register(Action, callbackOne);
                var idTwo = sut.register(Action, callbackTwo);
                expect(idOne).toBe('D_testModule_ID_1');
                expect(idTwo).toBe('D_testModule_ID_2');
            });

            xit('should return an unregister function maybe?', function() {
                
            });

        });
    
        describe('dispatch', function() {

            var Action;
            var callback;

            beforeEach(function() {
                Action = function Action() {};
                callback = jasmine.createSpy('callback');

                sut.register(Action, callback);
            });

            it('should call the callback registered for the specific action', function() {
                var action = new Action();
                sut.dispatch(action);
                expect(callback).toHaveBeenCalled();
            });

            it('should set currentCallbacks to object of id', function() {
                spyOn(sut, '_stopDispatching');
                var action = new Action();
                sut.dispatch(action);
                expect(sut.currentCallbacks.D_testModule_ID_1).toBe(callback);
            });


        });

        describe('_stopDispatching', function() {

            it('should set currentCallbacks to null', function() {
                sut.currentCallbacks = {};
                sut._stopDispatching();
                expect(sut.currentCallbacks).toBe(null);
            });

        });

        describe('unregister', function() {
            var Action;
            var callback;
            var registrationId;

            beforeEach(function() {
                Action = function Action() {};
                callback = jasmine.createSpy('callback');

                registrationId = sut.register(Action, callback);
            });

            it('should not call the callback once unregistered', function() {
                sut.unregister(Action, registrationId);
                sut.dispatch(new Action());
                expect(callback).not.toHaveBeenCalled();
            });

        });

    });

});
