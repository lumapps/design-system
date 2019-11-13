import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function GridDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            orientation: 'horizontal',
            wrap: 'nowrap',
        };

        if (!attrs.lumxOrientation) {
            el.addClass(`${CSS_PREFIX}-grid--orientation-${defaultProps.orientation}`);
        }

        attrs.$observe('lumxOrientation', (orientation) => {
            if (!orientation) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--orientation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--orientation-${orientation}`);
        });

        if (!attrs.lumxWrap) {
            el.addClass(`${CSS_PREFIX}-grid--wrap-${defaultProps.wrap}`);
        }

        attrs.$observe('lumxWrap', (wrap) => {
            if (!wrap) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--wrap-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--wrap-${wrap}`);
        });

        attrs.$observe('lumxHAlign', (hAlign) => {
            if (!hAlign) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--hAlign-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--h-align-${hAlign}`);
        });

        attrs.$observe('lumxVAlign', (vAlign) => {
            if (!vAlign) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--vAlign-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--v-align-${vAlign}`);
        });

        attrs.$observe('lumxGutter', (gutter) => {
            if (!gutter) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*grid--gutter-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-grid--gutter-${gutter}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: '<div class="lumx-grid" ng-transclude></div>',
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.grid`).directive(`${COMPONENT_PREFIX}Grid`, GridDirective);

/////////////////////////////

export { GridDirective };
