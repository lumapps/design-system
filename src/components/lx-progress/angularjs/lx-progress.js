import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-progress.html';

/////////////////////////////

function ProgressController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxProgress = this;
}

/////////////////////////////

function ProgressDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressController,
        controllerAs: 'lxProgress',
        replace: true,
        restrict: 'E',
        scope: {
            variant: '@?lxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.progress`).directive(`${COMPONENT_PREFIX}Progress`, ProgressDirective);

/////////////////////////////

export { ProgressDirective };
