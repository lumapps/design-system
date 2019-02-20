// eslint-disable-next-line import/no-unresolved
import { mdiCommentOutline } from '@lumx/icons';

/////////////////////////////

function DemoDataTableController($filter, $scope) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.dataTableId = 'dataTableDemo';
    vm.dataTableThead = [
        {
            label: 'Dessert',
            name: 'dessert',
            sortable: true,
        },
        {
            label: 'Calories',
            name: 'calories',
            sortable: true,
        },
        {
            label: 'Fat (g)',
            name: 'fat',
            sort: 'asc',
            sortable: true,
        },
        {
            icon: mdiCommentOutline,
            label: 'Comments',
            name: 'comments',
            sortable: false,
        },
    ];
    vm.advancedDataTableThead = angular.copy(vm.dataTableThead);
    vm.advancedDataTableThead.unshift({
        format(row) {
            return `<img src="${row.image}" width="36" height="36">`;
        },
        name: 'image',
    });
    vm.dataTableTbody = [
        {
            calories: 159,
            comments: 'Lorem ipsum',
            dessert: 'Frozen yogurt',
            fat: 6.0,
            id: 1,
            image: '/images/placeholder/1-square.jpg',
        },
        {
            calories: 237,
            comments: 'Lorem ipsum',
            dessert: 'Ice cream sandwich',
            fat: 9.0,
            id: 2,
            image: '/images/placeholder/2-square.jpg',
            lxDataTableDisabled: true,
        },
        {
            calories: 262,
            comments: 'Lorem ipsum',
            dessert: 'Eclair',
            fat: 16.0,
            id: 3,
            image: '/images/placeholder/3-square.jpg',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    function updateActions(evt, dataTableId, selectedRows) {
        if (dataTableId === vm.dataTableDemo) {
            vm.selectedRows = selectedRows;
        }
    }

    function updateSort(evt, dataTableId, column) {
        vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, column.name, column.sort === 'desc');
    }

    /////////////////////////////

    vm.updateActions = updateActions;
    vm.updateSort = updateSort;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    $scope.$on('lx-data-table__selected', updateActions);
    $scope.$on('lx-data-table__unselected', updateActions);
    $scope.$on('lx-data-table__sorted', updateSort);
}

/////////////////////////////

angular.module('design-system').controller('DemoDataTableController', DemoDataTableController);

/////////////////////////////

export { DemoDataTableController };
