(function () {
    
    var remote = require('remote'); 
    var dialog = remote.require('dialog'); 
    var fs = require('fs');
    
    'use strict';
    angular.module('app')
        .controller('introController', ['introService', '$q', '$scope', IntroController])
        .directive('customOnDrop', CustomOnDrop)
        .directive('customOnChange', CustomOnChange)
        .filter('isFolder', IsFolder);
        
    function IntroController(introService, $q, $scope) {

        $scope.default = '/Documents';
        $scope.folders = []; 
        
        $scope.savePaths = function(){
            //console.log($scope.folders);
            introService.savePaths($scope.folders);
        };
        
        $scope.addFolder = function(folder) {
            $scope.folders.push(folder);
        }
        
        $scope.openFolder = function() {
            dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']},
            function (fileNames) {
                for (var i = 0, f; f = fileNames[i]; i++) { 
                    var file = {path: f};
                    $scope.$apply(function(){
                        $scope.folders.push(file);
                    });
                }
                console.log(fileNames);
            }); 
        }
        
        $scope.dropFolders = function(event){
            event.preventDefault();
            event.stopPropagation();
            var files = event.originalEvent.dataTransfer.files;
            
            // iterate in the files dropped
            for (var i = 0, f; f = files[i]; i++) { 
                if (!f.type && f.size % 4096 == 0) {
                    //$scope.addFolder(f);
                    $scope.$apply(function(){
                        $scope.folders.push(f);
                    });
                }
            }
            
            console.log($scope.folders);
        };
        
    }
    
    function CustomOnDrop() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var onDropHandler = scope.$eval(attrs.customOnDrop);
                
                var processDragOverOrEnter = function(event) {
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
        return function(folders) {
            var filtered = [];
            angular.forEach(folders, function(folder) {
                var stats = fs.statSync(folder.path);
                if (stats.isDirectory()) {
                    filtered.push(folder);
                }
            });
            return filtered;
        };
    }
    
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
    
})();