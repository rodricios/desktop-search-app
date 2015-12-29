(function () {
    'use strict';
    angular.module('app')
        .controller('searchController', ['searchService', '$scope', '$q', '$mdDialog', SearchController]);

    function SearchController(searchService, $scope, $q, $mdDialog) {
        var self = this;

        self.selected = null;

        self.selectedIndex = 0;
        self.filterText = null;

        $scope.folders = [];
        $scope.results = [];

        self.filter = filterFolders;
        
        //----------------------
        // Internal functions 
        //----------------------
        $scope.search = function (query) {
            var docIds = searchService.getDocIdsByQuery(query).slice(self.selectedIndex, sift.searchOptions.size);

            if (docIds.length === 0) return;
            var textResults = {};
            var results = [];

            var textContents = searchService.getTextsByTextIds(docIds.map(
                d => d.ref
                )).then(function (texts) {
                    
                    angular.forEach(texts, function(text) {
                        textResults[text._id] = {
                            textContent: text.textContent, 
                            pathId: text.pathId
                            };
                    });

                    var ids = texts.map(d => d.pathId);
                    return ids;
                }).then(searchService.getPathsByPathIds)
                .then(function (docs) {
                    var pathDict = {};

                    angular.forEach(docs, function (doc) {
                        pathDict[doc._id] = doc.path;
                    });
                    
                    $scope.results = docIds.map(function (r) {
                        
                        r.path = pathDict[textResults[r.ref].pathId];
                        r.textContent = textResults[r.ref].textContent;
                        
                        return r;
                    });

                });

        }

        $scope.getPaths = function () {
            searchService.getPaths().then(function (docs) {
                $scope.folders = $scope.folders.concat(docs);
            });
        }

        $scope.getPaths();

        function listDirectory(dir) {
            dir = !!!dir == false ? "C:\\Users\\rodrigo\\SiftDocuments" : dir;

            searchService.getFilesRecursively(dir);
        }

        function filterFolders() {
            if (self.filterText == null || self.filterText == "") {
                self.folders = [].concat(listDirectory());
            }
            else {
                self.folders = [].concat(listDirectory(self.filterText));
            }
        }
    }

})();