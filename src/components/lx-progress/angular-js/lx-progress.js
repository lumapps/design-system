import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-progress.scss';
import template from './lx-progress.html';

/////////////////////////////

function lxProgressController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lxProgress = this;
}

/////////////////////////////

function lxProgressDirective() {
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

angular.module(`${MODULE_NAME}.progress`).directive('lxProgress', lxProgressDirective);

/////////////////////////////

export { lxProgressDirective };
