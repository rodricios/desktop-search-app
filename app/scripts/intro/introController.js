(function () {
    'use strict';

    var remote = require('remote');
    var dialog = remote.require('dialog');
    var fs = require('fs');
    var path = require('path');
    var recursive = require('recursive-readdir');
    var dir = require('node-dir');

    var dirOptions = {
        match: /.txt$/,
        exclude: /^\./
    };

    angular.module('app')
        .controller('introController', ['introService', '$q', '$scope', '$location', IntroController])
        .directive('customOnDrop', CustomOnDrop)
        .directive('customOnChange', CustomOnChange)
        .filter('isFolder', IsFolder);

    function IntroController(introService, $q, $scope, $location) {

        $scope.default = '/Documents';
        $scope.folders = [];

        $scope.savePaths = function () {
            //console.log($scope.folders);
            //introService.savePaths($scope.folders);
            
            angular.forEach($scope.folders, function (folder) {

                dir.readFiles(folder.path, {
                    match: dirOptions.match,
                    exclude: dirOptions.exclude
                }, function (err, content, filename, next) {
                    if (err) throw err;

                    introService.savePath({ path: filename })
                        .then(function (newData) {
                            content = content.split('\n');
                            
                            var tf = (d) => ({
                                    pathId: (newData._id),
                                    textContent: d
                                });
                            
                            return _chunkArray(content, 3, tf);
                        })
                        .then(introService.savePathsAndTextContents)
                        .then(introService.indexDocuments);

                    next();
                },
                    function (err, files) {
                        if (err) throw err;
                        console.log('finished reading files:', files);
                        $location.path('../search/search.html');
                    });
            });
        };
        
        $scope.getFilePaths = function (path) {
            var deferred = $q.defer();

            dir.files(path, function (err, files) {
                if (err) deferred.reject(err);
                
                // include only certain filenames
                files = files.filter(function (val) {
                    return dirOptions.match.test(val);
                });

                deferred.resolve(files);
            });

            return deferred.promise;
        }


        $scope.indexFileContents = function (path, ext) {
            var deferred = $q.defer();

            dir.readFiles(path, {
                match: dirOptions.match,
                exclude: dirOptions.exclude
            }, function (err, content, filename, next) {
                if (err) deferred.reject(err);
                //console.log('content:', content);
                //deferred.resolve(content);
                next();
            },
                function (err, files) {
                    if (err) deferred.reject(err);
                    console.log('finished reading files:', files);
                });

            return deferred.promise;
        }

        $scope.addFolder = function (folder) {
            $scope.folders.push(folder);
        }

        $scope.openFolder = function () {
            dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] },
                function (fileNames) {
                    for (var i = 0, f; f = fileNames[i]; i++) {
                        var file = { path: f };
                        $scope.$apply(function () {
                            $scope.folders.push(file);
                        });
                    }
                    console.log(fileNames);
                });
        }

        $scope.dropFolders = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var files = event.originalEvent.dataTransfer.files;
            
            // iterate in the files dropped
            for (var i = 0, f; f = files[i]; i++) {
                if (!f.type && f.size % 4096 == 0) {
                    //$scope.addFolder(f);
                    $scope.$apply(function () {
                        $scope.folders.push(f);
                    });
                }
            }

            console.log($scope.folders);
        };
    }
    
    function _chunkArray(array, size, transformer) {
        if (typeof transformer == "undefined") {
            transformer = (d) => d;
        }
        var slices = [];

        while (array.length > 0)
            slices.push(transformer(array.splice(0, size).join(" ")));

        return slices;
    }
    
    function CustomOnDrop() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var onDropHandler = scope.$eval(attrs.customOnDrop);

                var processDragOverOrEnter = function (event) {
                    if (event != null) event.preventDefault();
                    return false;
                };

                elem.bind('dragover', processDragOverOrEnter);
                elem.bind('dragenter', processDragOverOrEnter);

                elem.on('drop', onDropHandler);
            }
        };
    }

    function CustomOnChange() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);

                console.log(element);

                element.on('change', onChangeHandler);
            }
        };
    }

    function IsFolder() {
        return function (folders) {
            var filtered = [];
            angular.forEach(folders, function (folder) {
                var stats = fs.statSync(folder.path);
                if (stats.isDirectory()) {
                    filtered.push(folder);
                }
            });
            return filtered;
        };
    }

})();


// adding drag-n-drop
// http://jsfiddle.net/MeBeiM/rnjpbhhg///http://stackoverflow.com/questions/25016442/how-to-distinguish-if-a-file-or-folder-is-being-dragged-prior-to-it-being-droppe

// filtering dupes
// https://github.com/a8m/angular-filter
// http://stackoverflow.com/questions/15914658/how-to-make-ng-repeat-filter-out-duplicate-results

// custom filters
// http://stackoverflow.com/questions/15196161/angularjs-how-to-structure-a-custom-filter-with-ng-repeat-to-return-items-cond

// getting filenames in folder
// http://stackoverflow.com/questions/2727167/getting-all-filenames-in-a-directory-with-node-js

// fs stats - getting file and folder info
// https://nodejs.org/docs/v0.3.1/api/fs.html#fs.Stats
