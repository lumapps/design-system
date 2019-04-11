import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function TableDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            hasDividers: false,
            theme: 'light',
        };

        attrs.$observe('lumxHasDividers', (hasDividers) => {
            if (scope.$eval(hasDividers)) {
                el.addClass(`${CSS_PREFIX}-table--has-dividers`);
            } else {
                el.removeClass(`${CSS_PREFIX}-table--has-dividers`);
            }
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-table--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*table--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-table--theme-${theme}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: `<table class="${CSS_PREFIX}-table" ng-transclude></table>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.table`).directive(`${COMPONENT_PREFIX}Table`, TableDirective);

/////////////////////////////

export { TableDirective };
