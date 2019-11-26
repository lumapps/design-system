import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function TableHeadController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function TableHeadDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: TableHeadController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {},
        template: '<thead ng-transclude></thead>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}TableHead`, TableHeadDirective);

/////////////////////////////

export { TableHeadDirective };
