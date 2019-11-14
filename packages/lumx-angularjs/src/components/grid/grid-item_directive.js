import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

/////////////////////////////

function GridItemDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        attrs.$observe('lumxAlign', (align) => {
            if (!align) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--align-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--align-${align}`);
        });

        attrs.$observe('lumxOrder', (order) => {
            if (!order) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--order-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--order-${order}`);
        });

        attrs.$observe('lumxWidth', (width) => {
            if (!width) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--width-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid-item--width-${width}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: '<div class="lumx-grid-item" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.grid`).directive(`${COMPONENT_PREFIX}GridItem`, GridItemDirective);

/////////////////////////////

export { GridItemDirective };
