var Datastore = require('nedb'), 
    db = new Datastore({filename: '../../database', autoload: true});

var sift = {};
sift.db = db;

window.sift = sift;

(function () {
    'use strict';
    
    var _templateBase = './scripts';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate'
        //'ui.filters'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: _templateBase + '/intro/intro.html' ,
                controller: 'introController'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);
})();