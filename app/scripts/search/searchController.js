 
(function () {
    'use strict';
    angular.module('app')
        .controller('searchController', ['searchService', '$q', '$mdDialog', SearchController]);
    
    function SearchController(searchService, $q, $mdDialog) {
        var self = this;
        
        self.selected = null;

        self.selectedIndex = 0;
        self.filterText = null;
        self.folders = []
        
        self.filter = filterFolders;
        
        // Load initial data
        //getAllCustomers();
        
        //----------------------
        // Internal functions 
        //----------------------
        
        function search(query) {
            
        }
        
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