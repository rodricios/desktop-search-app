 
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
        
        // function deleteCustomer($event) {
        //     var confirm = $mdDialog.confirm()
        //                            .title('Are you sure?')
        //                            .content('Are you sure want to delete this customer?')
        //                            .ok('Yes')
        //                            .cancel('No')
        //                            .targetEvent($event);
            
            
        //     $mdDialog.show(confirm).then(function () {
        //         customerService.destroy(self.selected.customer_id).then(function (affectedRows) {
        //             self.customers.splice(self.selectedIndex, 1);
        //         });
        //     }, function () { });
        // }
        
        // function saveCustomer($event) {
        //     if (self.selected != null && self.selected.customer_id != null) {
        //         customerService.update(self.selected).then(function (affectedRows) {
        //             $mdDialog.show(
        //                 $mdDialog
        //                     .alert()
        //                     .clickOutsideToClose(true)
        //                     .title('Success')
        //                     .content('Data Updated Successfully!')
        //                     .ok('Ok')
        //                     .targetEvent($event)
        //             );
        //         });
        //     }
        //     else {
        //         //self.selected.customer_id = new Date().getSeconds();
        //         customerService.create(self.selected).then(function (affectedRows) {
        //             $mdDialog.show(
        //                 $mdDialog
        //                     .alert()
        //                     .clickOutsideToClose(true)
        //                     .title('Success')
        //                     .content('Data Added Successfully!')
        //                     .ok('Ok')
        //                     .targetEvent($event)
        //             );
        //         });
        //     }
        // }
        
        // function createCustomer() {
        //     self.selected = {};
        //     self.selectedIndex = null;
        // }
        
        // function getAllCustomers() {
        //     customerService.getCustomers().then(function (customers) {
        //         self.customers = [].concat(customers);
        //         self.selected = customers[0];
        //     });
        // }
        
    }

})();