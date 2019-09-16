import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function RadioGroupDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<div class="${CSS_PREFIX}-radio-group" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.radio-button`).directive(`${COMPONENT_PREFIX}RadioGroup`, RadioGroupDirective);

/////////////////////////////

export { RadioGroupDirective };
