import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

import template from './lx-data-table.html';

/////////////////////////////

function DataTableController($rootScope, $sce, $scope) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lxDataTable = this;

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
    lxDataTable.allRowsSelected = false;

    /**
     * The data table icons.
     *
     * @type {Object}
     */
    lxDataTable.icons = {
        mdiArrowDown,
        mdiArrowUp,
    };

    /**
     * The array containing all selected rows.
     *
     * @type {Array}
     */
    lxDataTable.selectedRows = [];

    /////////////////////////////

    /**
     * Services and utilities.
     */
    lxDataTable.$sce = $sce;

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
        lxDataTable.toggleActivation(row, true);
    }

    /**
     * Deactivate a given row.
     *
     * @param {Object} row The row to deactivate.
     */
    function _deactivate(row) {
        lxDataTable.toggleActivation(row, false);
    }

    /**
     * Select a given row.
     *
     * @param {Object} row The row to select.
     */
    function _select(row) {
        lxDataTable.toggleSelection(row, true);
    }

    /**
     * Select all rows.
     */
    function _selectAll() {
        lxDataTable.selectedRows.length = 0;

        for (let i = 0, len = lxDataTable.tbody.length; i < len; i++) {
            if (!lxDataTable.tbody[i].lxDataTableDisabled) {
                lxDataTable.tbody[i].lxDataTableSelected = true;
                lxDataTable.selectedRows.push(lxDataTable.tbody[i]);
            }
        }

        lxDataTable.allRowsSelected = true;

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__unselected`, lxDataTable.id, lxDataTable.selectedRows);
    }

    /**
     * Unselect a given row.
     *
     * @param {Object} row The row to unselect.
     */
    function _unselect(row) {
        lxDataTable.toggleSelection(row, false);
    }

    /**
     * Unselect all rows.
     */
    function _unselectAll() {
        for (let i = 0, len = lxDataTable.tbody.length; i < len; i++) {
            if (!lxDataTable.tbody[i].lxDataTableDisabled) {
                lxDataTable.tbody[i].lxDataTableSelected = false;
            }
        }

        lxDataTable.allRowsSelected = false;
        lxDataTable.selectedRows.length = 0;

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__selected`, lxDataTable.id, lxDataTable.selectedRows);
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

        for (let i = 0, len = lxDataTable.tbody.length; i < len; i++) {
            if (!lxDataTable.tbody[i].lxDataTableDisabled) {
                displayedRows++;
            }
        }

        if (displayedRows === lxDataTable.selectedRows.length) {
            lxDataTable.allRowsSelected = true;
        } else {
            lxDataTable.allRowsSelected = false;
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

        for (let i = 0, len = lxDataTable.thead.length; i < len; i++) {
            if (lxDataTable.thead[i].sortable && lxDataTable.thead[i].name !== column.name) {
                lxDataTable.thead[i].sort = undefined;
            }
        }

        if (!column.sort || column.sort === 'desc') {
            column.sort = 'asc';
        } else {
            column.sort = 'desc';
        }

        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__sorted`, lxDataTable.id, column);
    }

    /**
     * Activate or deactivate a given row.
     *
     * @param {Object} row The row to activate/deactivate.
     */
    function toggleActivation(row) {
        if (row.lxDataTableDisabled || !lxDataTable.isActivable) {
            return;
        }

        for (let i = 0, len = lxDataTable.tbody.length; i < len; i++) {
            if (lxDataTable.tbody.indexOf(row) !== i) {
                lxDataTable.tbody[i].lxDataTableActivated = false;
            }
        }

        row.lxDataTableActivated = !row.lxDataTableActivated;

        if (row.lxDataTableActivated) {
            $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__activated`, lxDataTable.id, row);
        } else {
            $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__deactivated`, lxDataTable.id, row);
        }
    }

    /**
     * Select or unselect all rows.
     */
    function toggleAllSelected() {
        if (!lxDataTable.hasBulk) {
            return;
        }

        if (lxDataTable.allRowsSelected) {
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
        if (row.lxDataTableDisabled || !lxDataTable.isSelectable) {
            return;
        }

        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        row.lxDataTableSelected = angular.isDefined(newSelectedStatus) ? newSelectedStatus : !row.lxDataTableSelected;

        if (row.lxDataTableSelected) {
            if (
                lxDataTable.selectedRows.length === 0 ||
                (lxDataTable.selectedRows.length > 0 && lxDataTable.selectedRows.indexOf(row) === -1)
            ) {
                lxDataTable.selectedRows.push(row);
                lxDataTable.areAllRowsSelected();

                $rootScope.$broadcast(
                    `${COMPONENT_PREFIX}-data-table__selected`,
                    lxDataTable.id,
                    lxDataTable.selectedRows,
                    row,
                );
            }
        } else if (lxDataTable.selectedRows.length > 0 && lxDataTable.selectedRows.indexOf(row) > -1) {
            lxDataTable.selectedRows.splice(lxDataTable.selectedRows.indexOf(row), 1);
            lxDataTable.allRowsSelected = false;

            $rootScope.$broadcast(
                `${COMPONENT_PREFIX}-data-table__unselected`,
                lxDataTable.id,
                lxDataTable.selectedRows,
                row,
            );
        }
    }

    /////////////////////////////

    lxDataTable.areAllRowsSelected = areAllRowsSelected;
    lxDataTable.sort = sort;
    lxDataTable.toggleActivation = toggleActivation;
    lxDataTable.toggleAllSelected = toggleAllSelected;
    lxDataTable.toggleSelection = toggleSelection;

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
        if (id === lxDataTable.id && angular.isDefined(row)) {
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
        if (id === lxDataTable.id) {
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
        if (id === lxDataTable.id && angular.isDefined(row)) {
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
        if (id === lxDataTable.id) {
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
        if (id === lxDataTable.id && angular.isDefined(row)) {
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
        if (id === lxDataTable.id && angular.isDefined(row)) {
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
        controllerAs: 'lxDataTable',
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
