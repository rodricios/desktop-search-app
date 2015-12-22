(function () {
    'use strict';
    
    var fs = require('fs');
    
    angular.module('app')
        .service('searchService', ['$q', SearchService]);
    
    function SearchService($q) {
        return {
            getByQuery: getByQuery,
            getFilesRecursive: getFilesRecursive
        };
        
        function getFilesRecursive (folder) {
            var fileContents = fs.readdirSync(folder),
                fileTree = [],
                stats;

            fileContents.forEach(function (fileName) {
                stats = fs.lstatSync(folder + '/' + fileName);

                if (stats.isDirectory()) {
                    fileTree.push({
                        name: fileName,
                        children: getFilesRecursive(folder + '/' + fileName)
                    });
                } else {
                    fileTree.push({
                        name: fileName
                    });
                }
            });

            return fileTree;
        };
        
        function getByQuery(query) {
            var deferred = $q.defer();
            connection.query(query, function (err, rows) {
                if (err) deferred.reject(err);
                deferred.resolve(rows);
            });
            return deferred.promise;
        }
    }
})();