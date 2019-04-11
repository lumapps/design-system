import { mdiCommentOutline } from 'LumX/icons';

/////////////////////////////

function DemoTableController($filter) {
    'ngInject';

    const vm = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The body of the table.
     * This represents the data to display in the table.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    vm.tableBody = [
        {
            // eslint-disable-next-line no-magic-numbers
            calories: 159,
            comments: 'Lorem ipsum',
            dessert: 'Frozen yogurt',
            // eslint-disable-next-line no-magic-numbers
            fat: 6.0,
            id: 1,
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
        },
    ];

    /**
     * The head of the table.
     * This represents the cells of the table.
     *
     * @type {Array}
     * @constant
     * @readonly
     */
    vm.tableHead = [
        {
            isSortable: true,
            label: 'Dessert',
            name: 'dessert',
        },
        {
            isSortable: true,
            label: 'Calories',
            name: 'calories',
        },
        {
            isSortable: true,
            label: 'Fat (g)',
            name: 'fat',
            sortOrder: 'asc',
        },
        {
            icon: mdiCommentOutline,
            isSortable: false,
            label: 'Comments',
            name: 'comments',
        },
    ];

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Update the sorting of the table.
     *
     * @param {Object} cell The cell to sort the table by.
     */
    function updateSort(cell) {
        angular.forEach(vm.tableHead, (head) => {
            if (head !== cell) {
                head.sortOrder = undefined;
            }
        });

        if (cell.sortOrder === 'asc') {
            cell.sortOrder = 'desc';
        } else {
            cell.sortOrder = 'asc';
        }

        vm.tableBody = $filter('orderBy')(vm.tableBody, cell.name, cell.sortOrder === 'desc');
    }

    /////////////////////////////

    vm.updateSort = updateSort;
}

/////////////////////////////

angular.module('design-system').controller('DemoTableController', DemoTableController);

/////////////////////////////

export { DemoTableController };
