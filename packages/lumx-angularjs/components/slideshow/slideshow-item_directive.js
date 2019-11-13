import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './slideshow-item.html';

/////////////////////////////

function SlideshowItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl) {
        ctrl.itemsCount++;
        ctrl.updateSlidesCount();
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        require: `^${COMPONENT_PREFIX}Slideshow`,
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.slideshow`).directive(`${COMPONENT_PREFIX}SlideshowItem`, SlideshowItemDirective);

/////////////////////////////

export { SlideshowItemDirective };
