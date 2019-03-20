import { COMPONENT_PREFIX, MODULE_NAME, SERVICE_PREFIX } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function DataTableService($rootScope) {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Activate a specific row in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row object to activate in the data table.
     */
    function activate(dataTableId, row) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__activate`, dataTableId, row);
    }

    /**
     * Deactivate a specific row in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row object to deactivate in the data table.
     */
    function deactivate(dataTableId, row) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__deactivate`, dataTableId, row);
    }

    /**
     * Select a specific row in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row object to select in the data table.
     */
    function select(dataTableId, row) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__select`, dataTableId, row);
    }

    /**
     * Select all rows in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     */
    function selectAll(dataTableId) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__select-all`, dataTableId);
    }

    /**
     * Unselect a specific row in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     * @param {Object} row         The row object to unselect in the data table.
     */
    function unselect(dataTableId, row) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__unselect`, dataTableId, row);
    }

    /**
     * Unselect all rows in a given data table.
     *
     * @param {string} dataTableId The data table identifier.
     */
    function unselectAll(dataTableId) {
        $rootScope.$broadcast(`${COMPONENT_PREFIX}-data-table__unselect-all`, dataTableId);
    }

    /////////////////////////////

    service.activate = activate;
    service.deactivate = deactivate;
    service.select = select;
    service.selectAll = selectAll;
    service.unselect = unselect;
    service.unselectAll = unselectAll;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.data-table`).service(`${SERVICE_PREFIX}DataTableService`, DataTableService);

/////////////////////////////

export { DataTableService };
