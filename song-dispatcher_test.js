describe('Song Dispatcher', function() {

    var sut;
    var moduleA;
    var moduleB;

    beforeEach(module('songDispatcher'));

    beforeEach(function() {
        moduleA = angular.module('moduleA', []);
        moduleB = angular.module('moduleB', []);
    });

    beforeEach(inject(function(songDispatcherFactory) {
        sut = songDispatcherFactory;
    }));

    describe('getDispatcher', function() {

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
