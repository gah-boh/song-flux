;(function() {
    angular.module('song-dispatcher', [])
    .factory('song-dispatcher-factory', function() {
        var dispatchers = new WeakMap();

        function createDispatcher(ngModule) {
        }

        return {
            getDispatcher: function(moduleName) {
                var ngModule = angular.module(moduleName);
                return (dispatchers.get(ngModule) || createDispatcher(ngModule));
            }
        };
    });
}());

