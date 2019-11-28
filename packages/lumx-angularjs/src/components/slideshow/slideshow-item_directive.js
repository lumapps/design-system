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
        require: '^lxSlideshow',
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.slideshow').directive('lxSlideshowItem', SlideshowItemDirective);

/////////////////////////////

export { SlideshowItemDirective };
