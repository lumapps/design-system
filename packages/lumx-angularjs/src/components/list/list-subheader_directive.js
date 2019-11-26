import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function ListSubheaderDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<li class="${CSS_PREFIX}-list-subheader" ng-transclude></li>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}ListSubheader`, ListSubheaderDirective);

/////////////////////////////

export { ListSubheaderDirective };
