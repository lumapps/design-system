import { mdiCommentOutline, mdiDelete, mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoDataTableController($filter, $scope) {
    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    vm.icons = {
        mdiDelete,
        mdiPencil,
    };
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
        name: 'image',
        variant: 'rounded',
    });
    vm.dataTableTbody = [
        {
            calories: 159,
            comments: 'Lorem ipsum',
            dessert: 'Frozen yogurt',
            fat: 6.0,
            id: 1,
            image: 'https://picsum.photos/72?image=1027',
        },
        {
            calories: 237,
            comments: 'Lorem ipsum',
            dessert: 'Ice cream sandwich',
            fat: 9.0,
            id: 2,
            image: 'https://picsum.photos/72?image=832',
            lxDataTableDisabled: true,
        },
        {
            calories: 262,
            comments: 'Lorem ipsum',
            dessert: 'Eclair',
            fat: 16.0,
            id: 3,
            image: 'https://picsum.photos/72?image=823',
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
