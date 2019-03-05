function DemoSelectController($http) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.selectAjax = {
        list: [],
        loading: false,
        selected: ['Bossk', 'Boba Fett'],
        toModel(data, callback) {
            if (data) {
                callback(data.name);
            } else {
                callback();
            }
        },
        toSelection(data, callback) {
            if (data) {
                $http
                    .get(`https://swapi.co/api/people/?search=${escape(data)}`)
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
        update(newFilter) {
            if (newFilter) {
                vm.selectAjax.loading = true;

                $http
                    .get(`https://swapi.co/api/people/?search=${escape(newFilter)}`)
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
    };

    vm.selectPeople = [
        {
            age: 10,
            email: 'adam@email.com',
            name: 'Adam',
        },
        {
            age: 12,
            email: 'amalie@email.com',
            name: 'Amalie',
        },
        {
            age: 30,
            email: 'wladimir@email.com',
            name: 'Wladimir',
        },
        {
            age: 31,
            email: 'samantha@email.com',
            name: 'Samantha',
        },
        {
            age: 16,
            email: 'estefanía@email.com',
            name: 'Estefanía',
        },
        {
            age: 54,
            email: 'natasha@email.com',
            name: 'Natasha',
        },
        {
            age: 43,
            email: 'nicole@email.com',
            name: 'Nicole',
        },
        {
            age: 21,
            email: 'adrian@email.com',
            name: 'Adrian',
        },
    ];

    vm.selectModel = {
        selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
        selectedPerson: undefined,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    function selectCallback() {
        console.log('New value: ', vm.selectAjax.selected);
    }

    /////////////////////////////

    vm.selectCallback = selectCallback;

    /////////////////////////////

    function init() {
        $http.get('https://swapi.co/api/people/?search=bo').then(function updateSuccess(response) {
            if (response.data && response.data.results) {
                vm.selectAjax.list = response.data.results;
            }
        });
    }

    init();
}

/////////////////////////////

angular.module('design-system').controller('DemoSelectController', DemoSelectController);

/////////////////////////////

export { DemoSelectController };
