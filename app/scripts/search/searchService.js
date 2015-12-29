(function () {
    'use strict';
    
    var fs = require('fs');
    
    angular.module('app')
        .service('searchService', ['$q', SearchService]);
    
    function SearchService($q) {
        return {
            getDocIdsByQuery: getDocIdsByQuery,
            getTextsByTextIds: getTextsByTextIds,
            getPathsByPathIds: getPathsByPathIds,
            getPaths: getPaths
        };
        
        function getPaths() {
            var deferred = $q.defer();
            
            // Find all documents in the collection
            sift.pathsDB.find({}, function (err, docs) {
                if (err) deferred.reject(err);
                deferred.resolve(docs);
            });
            
            return deferred.promise;
        }
        
        function getTextsByTextIds(ids) {
            var deferred = $q.defer();
            
            sift.textsDB.find({ 
                //$where: () => (ids.indexOf(this._id) > -1)
                $where: function() {
                    return ids.indexOf(this._id) > -1
                }
            }, function (err, docs) {
                if (err) deferred.reject(err);
                
                deferred.resolve(docs);
            });
            
            return deferred.promise;
        }
        
        
        function getPathsByPathIds(ids) {
            var deferred = $q.defer();
            
            sift.pathsDB.find({ 
                $where: function() {
                    return ids.indexOf(this._id) > -1
                }
            }, function (err, docs) {
                if (err) deferred.reject(err);
                
                deferred.resolve(docs);
            });
            
            return deferred.promise;
        }
        
        function getDocIdsByQuery(query) {
            return sift.searchIndex.search(query);
        }
    }
})();