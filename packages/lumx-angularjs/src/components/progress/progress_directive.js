import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './progress.html';

/////////////////////////////

function ProgressController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function ProgressDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ProgressController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            customColors: '=?lumxCustomColors',
            theme: '@?lumxTheme',
            variant: '@?lumxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.progress`).directive(`${COMPONENT_PREFIX}Progress`, ProgressDirective);

/////////////////////////////

export { ProgressDirective };
