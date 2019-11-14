import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

import template from './icon.html';

/////////////////////////////

function IconController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function IconDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        attrs.$observe('lumxPath', (path) => {
            el.addClass(`${CSS_PREFIX}-icon--path`);
            el.find('path').attr('d', path);
        });

        attrs.$observe('lumxFont', (font) => {
            el.addClass(`${CSS_PREFIX}-icon--font mdi mdi-${font}`);
        });

        attrs.$observe('lumxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--color-${color}`);
        });

        attrs.$observe('lumxColorVariant', (colorVariant) => {
            if (!colorVariant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--color-variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--color-variant-${colorVariant}`);
        });

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--size-${size}`);
        });
    }

    return {
        bindToController: true,
        controller: IconController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            path: '@?lumxPath',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.icon`).directive(`${COMPONENT_PREFIX}Icon`, IconDirective);

/////////////////////////////

export { IconDirective };
