(function () {
    'use strict';
    
    var fs = require('fs');
    
    angular.module('app')
        .service('searchService', ['$q', '$scope', SearchService]);
    
    function SearchService($q, $scope) {
        return {
            savePaths: savePaths
        };
        
        function savePaths(paths) {
            console.log(paths);
        }
    }
})();