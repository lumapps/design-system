import { mdiCommentOutline, mdiDelete, mdiPencil } from 'LumX/icons';

/////////////////////////////

function DemoDataTableController($filter, $scope) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The id of the data table.
     *
     * @type {string}
     * @constant
     * @readonly
     */
    vm.dataTableId = 'dataTableDemo';

    /**
     * The body of the data table.
     * This represents the data to display in the data table.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.dataTableTbody = [
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 159,
            comments: 'Lorem ipsum',
            dessert: 'Frozen yogurt',
            // eslint-disable-next-line no-magic-numbers
            fat: 6.0,
            id: 1,
            image: 'https://picsum.photos/72?image=1027',
        },
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 237,
            comments: 'Lorem ipsum',
            dessert: 'Ice cream sandwich',
            // eslint-disable-next-line no-magic-numbers
            fat: 9.0,
            // eslint-disable-next-line no-magic-numbers
            id: 2,
            image: 'https://picsum.photos/72?image=832',
            lxDataTableDisabled: true,
        },
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 262,
            comments: 'Lorem ipsum',
            dessert: 'Eclair',
            // eslint-disable-next-line no-magic-numbers
            fat: 16.0,
            // eslint-disable-next-line no-magic-numbers
            id: 3,
            image: 'https://picsum.photos/72?image=823',
        },
    ];

    /**
     * The head of the data table.
     * This represents the columns of the data table.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
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

    /**
     * The icons to use in the template.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.icons = {
        mdiDelete,
        mdiPencil,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Update the actions available at the top of the datatable.
     *
     * @param {Event}         evt          The event that triggered this function.
     * @param {string}        dataTableId  The id of the data table to update the actions of.
     * @param {Array<Object>} selectedRows The list of selected rows for the given data table.
     */
    function updateActions(evt, dataTableId, selectedRows) {
        if (dataTableId === vm.dataTableDemo) {
            vm.selectedRows = selectedRows;
        }
    }

    /**
     * Update the sorting of the data table.
     *
     * @param {Event}  evt         The event that triggered this function.
     * @param {string} dataTableId The id of the data table to sort.
     * @param {Object} column      The column to sort the data table by.
     */
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

    /**
     * When a line is selected in the data table, update the list of actions available on top of the data table.
     */
    $scope.$on('lx-data-table__selected', updateActions);

    /**
     * When a line is unselected in the data table, update the list of actions available on top of the data table.
     */
    $scope.$on('lx-data-table__unselected', updateActions);

    /**
     * When the user clicks on a column head to sort the data table, trigger the sorting of the data table according to
     * the clicked column.
     */
    $scope.$on('lx-data-table__sorted', updateSort);
}

/////////////////////////////

angular.module('design-system').controller('DemoDataTableController', DemoDataTableController);

/////////////////////////////

export { DemoDataTableController };
