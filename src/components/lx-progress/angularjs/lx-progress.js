import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-progress.html';

/////////////////////////////

function lxProgressController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxProgress = this;
}

/////////////////////////////

function lxProgressDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: lxProgressController,
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

angular.module(`${MODULE_NAME}.progress`).directive(`${COMPONENT_PREFIX}Progress`, lxProgressDirective);

/////////////////////////////

export { lxProgressDirective };
