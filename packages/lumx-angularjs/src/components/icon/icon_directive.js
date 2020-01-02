import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './icon.html';

/////////////////////////////

function IconController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get icon classes.
     *
     * @return {Array} The list of icon classes.
     */
    function getClasses() {
        const classes = [];

        if (lx.path) {
            classes.push(`${CSS_PREFIX}-icon--path`);
        } else if (lx.font) {
            classes.push(`${CSS_PREFIX}-icon--font`);
            classes.push('mdi');
            classes.push(`mdi-${lx.font}`);
        }

        if (lx.color) {
            classes.push(`${CSS_PREFIX}-icon--color-${lx.color}`);
        }

        if (lx.colorVariant) {
            classes.push(`${CSS_PREFIX}-icon--color-variant-${lx.colorVariant}`);
        }

        if (lx.size) {
            classes.push(`${CSS_PREFIX}-icon--size-${lx.size}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function IconDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        attrs.$observe('lxPath', (path) => {
            el.find('path').attr('d', path);
        });
    }

    return {
        bindToController: true,
        controller: IconController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
            colorVariant: '@?lxColorVariant',
            font: '@?lxId',
            path: '@?lxPath',
            size: '@?lxSize',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.icon').directive('lxIcon', IconDirective);

/////////////////////////////

export { IconDirective };
