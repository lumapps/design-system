import { MODULE_NAME } from '@lumx/angularjs/lumx'

import '../style/lx-divider.scss';
import template from './lx-divider.html';

/////////////////////////////

function lxDividerDirective() {
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

angular.module(`${MODULE_NAME}.divider`).directive('lxDivider', lxDividerDirective);

/////////////////////////////

export { lxDividerDirective };
