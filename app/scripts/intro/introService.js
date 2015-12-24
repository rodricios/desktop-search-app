(function () {
    'use strict';
    
    angular.module('app')
        .service('introService', ['$q', IntroService]);
    
    function IntroService($q) {
        return {
            savePaths: savePaths
        };
        
        function savePaths(paths) {
            console.log("introService.savePaths",paths);
        }
    }
})();