var Datastore = require('nedb');

var sift = {};

sift.pathsDB = new Datastore({filename: '../../paths.db', autoload: true});

sift.textsDB = new Datastore({filename: '../../texts.db', autoload: true});

sift.removeAll = function () {// Remove multiple documents
    sift.pathsDB.remove({}, { multi: true }, function (err, numRemoved) {
        console.log("number of documents deleted:", numRemoved);
    });
    
    sift.textsDB.remove({}, { multi: true }, function (err, numRemoved) {
        console.log("number of documents deleted:", numRemoved);
    });
}

sift.findAll = function () {
    // Find all documents in the collection
    sift.pathsDB.find({}, function (err, docs) {
        console.log("documents found:", docs);
    });
    
    sift.textsDB.find({}, function (err, docs) {
        console.log("documents found:", docs);
    });
}

sift.removeAll();

window.sift = sift;

var lunr = require('lunr');

sift.searchIndex = lunr(function () {
        //this.field('title')
        this.field('text')
        this.ref('id')
    });
    
sift.searchOptions = {
    size: 20
    };

(function () {
    'use strict';
    
    var _templateBase = './scripts';
    
    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'angular.filter'
    ])
    .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: _templateBase + '/intro/intro.html' ,
                controller: 'introController', 
                resolve: {
                    factory: checkRouting
                }
            });
            $routeProvider
            .when('/search/search.html', {
                templateUrl: _templateBase + '/search/search.html' ,
                controller: 'searchController'
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }
    ]);
})();

// http://stackoverflow.com/questions/11541695/redirecting-to-a-certain-route-based-on-condition
var checkRouting = function ($q, $rootScope, $location) {
    var deferred = $q.defer();
    
    sift.pathsDB.count({}, function (err, count) {
        if (count === 0) {
            deferred.resolve(true);
        } else {
            deferred.reject();
            $location.path("/search/search.html");
        }
    });
    
    return deferred.promise;
};
