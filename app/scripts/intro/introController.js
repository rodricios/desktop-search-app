(function () {
    'use strict';
    angular.module('app')
        .controller('introController', ['introService', '$q', '$mdDialog', 
        function(introService, $q, $mdDialog) {
            var self = this;
            self.default = '/Documents';
        }
    ]);    
})