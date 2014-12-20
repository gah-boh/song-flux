(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular'));
    } else {
        root.returnExports = factory(root.b);
    }
}(this, function (angular) {
    var songDispatcher= angular.module('song-dispatcher', []);
    songDispatcher.factory('song-dispatcher-factory', function() {
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

    return songDispatcher;
}));

