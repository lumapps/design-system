(function IIFE() {
    'use strict';

    /////////////////////////////

    DemoSelectController.$inject = ['$http'];

    function DemoSelectController($http) {
        var vm = this;

        vm.selectAjax = {
            selected: ['Bossk', 'Boba Fett'],
            list: [],
            update: function(newFilter) {
                if (newFilter) {
                    vm.selectAjax.loading = true;

                    $http.get('https://swapi.co/api/people/?search=' + escape(newFilter))
                        .then(function updateSuccess(response) {
                            if (response.data && response.data.results) {
                                vm.selectAjax.list = response.data.results;
                            }
                            vm.selectAjax.loading = false;
                        })
                        .catch(function updateError() {
                            vm.selectAjax.loading = false;
                        });
                } else {
                    vm.selectAjax.list = false;
                }
            },
            toModel: function(data, callback) {
                if (data) {
                    callback(data.name);
                } else {
                    callback();
                }
            },
            toSelection: function(data, callback) {
                if (data) {
                    $http.get('https://swapi.co/api/people/?search=' + escape(data))
                        .then(function toSelectionSuccess(response) {
                            if (response.data && response.data.results) {
                                callback(response.data.results[0]);
                            }
                        })
                        .catch(function toSelectionError() {
                            callback();
                        });
                } else {
                    callback();
                }
            },
            loading: false
        };

        $http.get('https://swapi.co/api/people/?search=bo')
            .then(function updateSuccess(response) {
                if (response.data && response.data.results) {
                    vm.selectAjax.list = response.data.results;
                }
            });

        vm.selectPeople = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 10,
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 31,
        }, {
            name: 'Estefanía',
            email: 'estefanía@email.com',
            age: 16,
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
        }];

        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
        };
    }

    /////////////////////////////

    angular.module('lumx').controller('DemoSelectController', DemoSelectController);
})();
