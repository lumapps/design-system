import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-divider.html';

/////////////////////////////

function DividerDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        if (!attrs.lxTheme) {
            el.addClass('lx-divider--theme-light');
        }

        attrs.$observe('lxTheme', (theme) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-divider--theme-\S+/g) || []).join(' ');
            }).addClass(`lx-divider--theme-${theme}`);
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
