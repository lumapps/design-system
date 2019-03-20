import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ButtonGroupDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<div class="${COMPONENT_PREFIX}-button-group" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.button`).directive(`${COMPONENT_PREFIX}ButtonGroup`, ButtonGroupDirective);

/////////////////////////////

export { ButtonGroupDirective };
