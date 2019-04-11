import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TableHeadDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: '<thead ng-transclude></thead>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableHead`, TableHeadDirective);

/////////////////////////////

export { TableHeadDirective };
