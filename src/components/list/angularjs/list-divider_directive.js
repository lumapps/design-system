import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ListDividerDirective() {
    'ngInject';

    return {
        replace: true,
        restrict: 'E',
        template: `<li class="${CSS_PREFIX}-list-divider"></li>`,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}ListDivider`, ListDividerDirective);

/////////////////////////////

export { ListDividerDirective };
