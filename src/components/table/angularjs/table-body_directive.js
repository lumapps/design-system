import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TableBodyDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: '<tbody ng-transclude></tbody>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableBody`, TableBodyDirective);

/////////////////////////////

export { TableBodyDirective };
