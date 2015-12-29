(function () {
    'use strict';
    
    angular.module('app')
        .service('introService', ['$q', IntroService]);
    
    function IntroService($q) {
        return {
            savePath: savePath,
            savePaths: savePaths,
            savePathsAndTextContents: savePathsAndTextContents,
            indexDocuments: indexDocuments
        };
        var _path;
        
        function savePaths(paths) {
            var deferred = $q.defer();
            
            var docs = [];
            
            angular.forEach(paths, function(p) {
                docs.push({path: p.path});
            });
            
            sift.pathsDB.insert(docs, function (err, newData) {
            // newDocs is an array with these documents, augmented with their _id
                if (err) deferred.reject(err);
                
                deferred.resolve(newData);
            });
            console.log("introService.savePaths: ",docs);
            
            return deferred.promise;
        }
        
        function savePath(data) {
            var deferred = $q.defer();
            
            sift.pathsDB.insert(data, function (err, newDocs) {
            // newDocs is an array with these documents, augmented with their _id
                if (err) deferred.reject(err);
                
                deferred.resolve(newDocs);
            });
            
            return deferred.promise;
        }
        
        function savePathsAndTextContents(data) {
            var deferred = $q.defer();
            
            sift.textsDB.insert(data, function (err, newDocs) {
                if (err) deferred.reject(err);
                
                deferred.resolve(newDocs);
            });
            
            return deferred.promise;
        }
        
        function indexDocuments(data) {
            angular.forEach(data, function(datum) {
                _path = datum.path;
                
                sift.searchIndex.add({
                    id: datum._id, 
                    text: datum.textContent
                });
            })
        }
    }
    
    // nedb inserting docs 
    // https://github.com/louischatriot/nedb#inserting-documents
    
})();