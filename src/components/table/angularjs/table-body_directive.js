import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TableBodyController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function TableBodyDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableBodyController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {},
        template: '<tbody ng-transclude></tbody>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableBody`, TableBodyDirective);

/////////////////////////////

export { TableBodyDirective };
