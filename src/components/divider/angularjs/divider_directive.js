import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './divider.html';

/////////////////////////////

function DividerDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-divider--theme-light`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)divider--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-divider--theme-${theme}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.divider`).directive(`${COMPONENT_PREFIX}Divider`, DividerDirective);

/////////////////////////////

export { DividerDirective };
