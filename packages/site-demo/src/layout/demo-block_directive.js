import { mdiCodeTags } from '@lumx/icons';

import template from './demo-block.html';

/////////////////////////////

function DemoBlockDirective(DemoController) {
    'ngInject';

    return {
        bindToController: true,
        controller: DemoController,
        controllerAs: 'demoBlock',
        replace: true,
        restrict: 'E',
        scope: true,
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('design-system').directive('demoBlock', DemoBlockDirective);

/////////////////////////////

export { DemoBlockDirective };
