(function IIFE() {
    'use strict';

    /////////////////////////////

    lxDataTableController.$inject = ['$rootScope', '$sce', '$scope'];

    function lxDataTableController($rootScope, $sce, $scope) {
        var lxDataTable = this;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * Wether all rows are selected or not.
         *
         * @type {boolean}
         */
        lxDataTable.allRowsSelected = false;

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
            toggleActivation(row, true);
        }

        /**
         * Deactivate a given row.
         *
         * @param {Object} row The row to deactivate.
         */
        function _deactivate(row) {
            toggleActivation(row, false);
        }

        /**
         * Select a given row.
         *
         * @param {Object} row The row to select.
         */
        function _select(row) {
            toggleSelection(row, true);
        }

        /**
         * Select all rows.
         */
        function _selectAll() {
            lxDataTable.selectedRows.length = 0;

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++) {
                if (!lxDataTable.tbody[i].lxDataTableDisabled) {
                    lxDataTable.tbody[i].lxDataTableSelected = true;
                    lxDataTable.selectedRows.push(lxDataTable.tbody[i]);
                }
            }

            lxDataTable.allRowsSelected = true;

            $rootScope.$broadcast('lx-data-table__unselected', lxDataTable.id, lxDataTable.selectedRows);
        }

        /**
         * Unselect a given row.
         *
         * @param {Object} row The row to unselect.
         */
        function _unselect(row) {
            toggleSelection(row, false);
        }

        /**
         * Unselect all rows.
         */
        function _unselectAll() {
            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++) {
                if (!lxDataTable.tbody[i].lxDataTableDisabled) {
                    lxDataTable.tbody[i].lxDataTableSelected = false;
                }
            }

            lxDataTable.allRowsSelected = false;
            lxDataTable.selectedRows.length = 0;

            $rootScope.$broadcast('lx-data-table__selected', lxDataTable.id, lxDataTable.selectedRows);
        }

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Wether all rows are selected or not.
         */
        function areAllRowsSelected() {
            var displayedRows = 0;

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++) {
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

            for (var i = 0, len = lxDataTable.thead.length; i < len; i++) {
                if (lxDataTable.thead[i].sortable && lxDataTable.thead[i].name !== column.name) {
                    lxDataTable.thead[i].sort = undefined;
                }
            }

            if (!column.sort || column.sort === 'desc') {
                column.sort = 'asc';
            }  else {
                column.sort = 'desc';
            }

            $rootScope.$broadcast('lx-data-table__sorted', lxDataTable.id, column);
        }

        /**
         * Activate or deactivate a given row.
         *
         * @param {Object} row The row to activate/deactivate.
         */
        function toggleActivation(row) {
            if (row.lxDataTableDisabled || !lxDataTable.activable) {
                return;
            }

            for (var i = 0, len = lxDataTable.tbody.length; i < len; i++) {
                if (lxDataTable.tbody.indexOf(row) !== i) {
                    lxDataTable.tbody[i].lxDataTableActivated = false;
                }
            }

            row.lxDataTableActivated = !row.lxDataTableActivated;

            if (row.lxDataTableActivated) {
                $rootScope.$broadcast('lx-data-table__activated', lxDataTable.id, row);
            } else {
                $rootScope.$broadcast('lx-data-table__deactivated', lxDataTable.id, row);
            }
        }

        /**
         * Select or unselect all rows.
         */
        function toggleAllSelected() {
            if (!lxDataTable.bulk) {
                return;
            }

            if (lxDataTable.allRowsSelected) {
                _unselectAll();
            } else {
                _selectAll();
            }
        }

        /**
         * select or unselect a given row
         *
         * @param {Object}  row                 The row to select/unselect.
         * @param {boolean} [newSelectedStatus] Wether the given row should be selected or unselected.
         * @param {Event}   [evt]               The checkbox click event.
         */
        function toggleSelection(row, newSelectedStatus, evt) {
            if (row.lxDataTableDisabled || !lxDataTable.selectable) {
                return;
            }

            if (angular.isDefined(evt)) {
                evt.stopPropagation();
            }

            row.lxDataTableSelected = angular.isDefined(newSelectedStatus) ? newSelectedStatus : !row.lxDataTableSelected;

            if (row.lxDataTableSelected) {
                // Make sure it's not already in.
                if (lxDataTable.selectedRows.length === 0 || (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(row) === -1)) {
                    lxDataTable.selectedRows.push(row);
                    lxDataTable.areAllRowsSelected();

                    $rootScope.$broadcast('lx-data-table__selected', lxDataTable.id, lxDataTable.selectedRows, row);
                }
            } else {
                if (lxDataTable.selectedRows.length && lxDataTable.selectedRows.indexOf(row) > -1) {
                    lxDataTable.selectedRows.splice(lxDataTable.selectedRows.indexOf(row), 1);
                    lxDataTable.allRowsSelected = false;

                    $rootScope.$broadcast('lx-data-table__unselected', lxDataTable.id, lxDataTable.selectedRows, row);
                }
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

        $scope.$on('lx-data-table__select', function(event, id, row) {
            if (id === lxDataTable.id && angular.isDefined(row)) {
                if (angular.isArray(row) && row.length > 0) {
                    row = row[0];
                }
                _select(row);
            }
        });

        $scope.$on('lx-data-table__select-all', function(event, id) {
            if (id === lxDataTable.id) {
                _selectAll();
            }
        });

        $scope.$on('lx-data-table__unselect', function(event, id, row) {
            if (id === lxDataTable.id && angular.isDefined(row)) {
                if (angular.isArray(row) && row.length > 0) {
                    row = row[0];
                }
                _unselect(row);
            }
        });

        $scope.$on('lx-data-table__unselect-all', function(event, id) {
            if (id === lxDataTable.id) {
                _unselectAll();
            }
        });

        $scope.$on('lx-data-table__activate', function(event, id, row) {
            if (id === lxDataTable.id && angular.isDefined(row)) {
                if (angular.isArray(row) && row.length > 0) {
                    row = row[0];
                }
                _activate(row);
            }
        });

        $scope.$on('lx-data-table__deactivate', function(event, id, row) {
            if (id === lxDataTable.id && angular.isDefined(row)) {
                if (angular.isArray(row) && row.length > 0) {
                    row = row[0];
                }
                _deactivate(row);
            }
        });
    }

    /////////////////////////////

    function lxDataTableDirective() {
        return {
            bindToController: true,
            controller: lxDataTableController,
            controllerAs: 'lxDataTable',
            replace: true,
            restrict: 'E',
            scope: {
                activable: '=?lxActivable',
                border: '=?lxBorder',
                bulk: '=?lxBulk',
                selectable: '=?lxSelectable',
                thumbnail: '=?lxThumbnail',
                tbody: '=lxTbody',
                thead: '=lxThead',
                theme: '@?lxTheme',
            },
            templateUrl: 'components/lx-data-table/lx-data-table.html',
        };
    }

    /////////////////////////////

    angular.module('lumx.data-table').directive('lxDataTable', lxDataTableDirective);
})();
