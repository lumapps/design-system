import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

import template from './lx-data-table.html';

/////////////////////////////

function DataTableController($rootScope, $sce, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether all rows are selected or not.
     *
     * @type {boolean}
     */
    lumx.allRowsSelected = false;

    /**
     * The data table icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiArrowDown,
        mdiArrowUp,
    };

    /**
     * The array containing all selected rows.
     *
     * @type {Array}
     */
    lumx.selectedRows = [];

    /////////////////////////////

    /**
     * Services and utilities.
     */
    lumx.$sce = $sce;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Activate a given row.
     *
     * @param {Object} row The row to activate.
     */
    function _activate(row) {
        lumx.toggleActivation(row, true);
    }

    /**
     * Deactivate a given row.
     *
     * @param {Object} row The row to deactivate.
     */
    function _deactivate(row) {
        lumx.toggleActivation(row, false);
    }

    /**
     * Select a given row.
     *
     * @param {Object} row The row to select.
     */
    function _select(row) {
        lumx.toggleSelection(row, true);
    }

    /**
     * Select all rows.
     */
    function _selectAll() {
        lumx.selectedRows.length = 0;

        for (let i = 0, len = lumx.tbody.length; i < len; i++) {
            if (!lumx.tbody[i].lumxDataTableDisabled) {
                lumx.tbody[i].lumxDataTableSelected = true;
                lumx.selectedRows.push(lumx.tbody[i]);
            }
        }

        lumx.allRowsSelected = true;

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__unselected`, lumx.id, lumx.selectedRows);
    }

    /**
     * Unselect a given row.
     *
     * @param {Object} row The row to unselect.
     */
    function _unselect(row) {
        lumx.toggleSelection(row, false);
    }

    /**
     * Unselect all rows.
     */
    function _unselectAll() {
        for (let i = 0, len = lumx.tbody.length; i < len; i++) {
            if (!lumx.tbody[i].lumxDataTableDisabled) {
                lumx.tbody[i].lumxDataTableSelected = false;
            }
        }

        lumx.allRowsSelected = false;
        lumx.selectedRows.length = 0;

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__selected`, lumx.id, lumx.selectedRows);
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Whether all rows are selected or not.
     */
    function areAllRowsSelected() {
        let displayedRows = 0;

        for (let i = 0, len = lumx.tbody.length; i < len; i++) {
            if (!lumx.tbody[i].lumxDataTableDisabled) {
                displayedRows++;
            }
        }

        if (displayedRows === lumx.selectedRows.length) {
            lumx.allRowsSelected = true;
        } else {
            lumx.allRowsSelected = false;
        }
    }

    /**
     * Sort a given column.
     *
     * @param {Object} column The column to sort.
     */
    function sort(column) {
        if (!column.sortable) {
            return;
        }

        for (let i = 0, len = lumx.thead.length; i < len; i++) {
            if (lumx.thead[i].sortable && lumx.thead[i].name !== column.name) {
                lumx.thead[i].sort = undefined;
            }
        }

        if (!column.sort || column.sort === 'desc') {
            column.sort = 'asc';
        } else {
            column.sort = 'desc';
        }

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__sorted`, lumx.id, column);
    }

    /**
     * Activate or deactivate a given row.
     *
     * @param {Object} row The row to activate/deactivate.
     */
    function toggleActivation(row) {
        if (row.lumxDataTableDisabled || !lumx.isActivable) {
            return;
        }

        for (let i = 0, len = lumx.tbody.length; i < len; i++) {
            if (lumx.tbody.indexOf(row) !== i) {
                lumx.tbody[i].lumxDataTableActivated = false;
            }
        }

        row.lumxDataTableActivated = !row.lumxDataTableActivated;

        if (row.lumxDataTableActivated) {
            $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__activated`, lumx.id, row);
        } else {
            $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__deactivated`, lumx.id, row);
        }
    }

    /**
     * Select or unselect all rows.
     */
    function toggleAllSelected() {
        if (!lumx.hasBulk) {
            return;
        }

        if (lumx.allRowsSelected) {
            _unselectAll();
        } else {
            _selectAll();
        }
    }

    /**
     * Select or unselect a given row.
     *
     * @param {Object}  row                 The row to select/unselect.
     * @param {boolean} [newSelectedStatus] Whether the given row should be selected or unselected.
     * @param {Event}   [evt]               The checkbox click event.
     */
    function toggleSelection(row, newSelectedStatus, evt) {
        if (row.lumxDataTableDisabled || !lumx.isSelectable) {
            return;
        }

        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        row.lumxDataTableSelected = angular.isDefined(newSelectedStatus)
            ? newSelectedStatus
            : !row.lumxDataTableSelected;

        if (row.lumxDataTableSelected) {
            if (
                lumx.selectedRows.length === 0 ||
                (lumx.selectedRows.length > 0 && lumx.selectedRows.indexOf(row) === -1)
            ) {
                lumx.selectedRows.push(row);
                lumx.areAllRowsSelected();

                $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__selected`, lumx.id, lumx.selectedRows, row);
            }
        } else if (lumx.selectedRows.length > 0 && lumx.selectedRows.indexOf(row) > -1) {
            lumx.selectedRows.splice(lumx.selectedRows.indexOf(row), 1);
            lumx.allRowsSelected = false;

            $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__unselected`, lumx.id, lumx.selectedRows, row);
        }
    }

    /////////////////////////////

    lumx.areAllRowsSelected = areAllRowsSelected;
    lumx.sort = sort;
    lumx.toggleActivation = toggleActivation;
    lumx.toggleAllSelected = toggleAllSelected;
    lumx.toggleSelection = toggleSelection;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Select a given row from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to select.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__select`, (evt, id, row) => {
        if (id === lumx.id && angular.isDefined(row)) {
            if (angular.isArray(row) && row.length > 0) {
                _select(row[0]);

                return;
            }

            _select(row);
        }
    });

    /**
     * Select all rows from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__select-all`, (evt, id) => {
        if (id === lumx.id) {
            _selectAll();
        }
    });

    /**
     * Unselect a given row from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to unselect.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__unselect`, (evt, id, row) => {
        if (id === lumx.id && angular.isDefined(row)) {
            if (angular.isArray(row) && row.length > 0) {
                _unselect(row[0]);

                return;
            }

            _unselect(row);
        }
    });

    /**
     * Unselect all rows from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__unselect-all`, (evt, id) => {
        if (id === lumx.id) {
            _unselectAll();
        }
    });

    /**
     * Activate a given row from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to activate.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__activate`, (evt, id, row) => {
        if (id === lumx.id && angular.isDefined(row)) {
            if (angular.isArray(row) && row.length > 0) {
                _activate(row[0]);

                return;
            }

            _activate(row);
        }
    });

    /**
     * Deactivate a given row from broadcast event.
     *
     * @param {Event}  evt         The broadcast event.
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row to deactivate.
     */
    $scope.$on(`${COMPONENT_PREFIX}-data-table__deactivate`, (evt, id, row) => {
        if (id === lumx.id && angular.isDefined(row)) {
            if (angular.isArray(row) && row.length > 0) {
                _deactivate(row[0]);

                return;
            }

            _deactivate(row);
        }
    });
}

/////////////////////////////

function DataTableDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: DataTableController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            hasBorder: '=?lxHasBorder',
            hasBulk: '=?lxHasBulk',
            hasThumbnail: '=?lxHasThumbnail',
            isActivable: '=?lxIsActivable',
            isSelectable: '=?lxIsSelectable',
            tbody: '=lxTbody',
            thead: '=lxThead',
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.data-table`).directive(`${COMPONENT_PREFIX}DataTable`, DataTableDirective);

/////////////////////////////

export { DataTableDirective };
