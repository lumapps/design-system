import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

/////////////////////////////

function TableCellController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The table icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiArrowDown,
        mdiArrowUp,
    };
}

/////////////////////////////

function TableCellDirective() {
    'ngInject';

    /**
     * Get template url according to variant parameter.
     *
     * @param  {element} el    The directive root element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The template url.
     */
    function getTemplateUrl(el, attrs) {
        return !attrs.lumxVariant || attrs.lumxVariant === 'body'
            ? 'src/components/table/angularjs/table-cell-body.html'
            : 'src/components/table/angularjs/table-cell-head.html';
    }

    return {
        bindToController: true,
        controller: TableCellController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            icon: '@?lumxIcon',
            isSortable: '=?lumxIsSortable',
            scope: '@?lumxScope',
            sortOrder: '@?lumxSortOrder',
            variant: '@?lumxVariant',
        },
        templateUrl: getTemplateUrl,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableCell`, TableCellDirective);

/////////////////////////////

export { TableCellDirective };
