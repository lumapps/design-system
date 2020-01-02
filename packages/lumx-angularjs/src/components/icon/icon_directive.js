import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './icon.html';

/////////////////////////////

function IconController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The default props.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _DEFAULT_PROPS = {
        color: 'dark',
        size: 'm',
    };

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

        if (lx.hasShape) {
            classes.push(`${CSS_PREFIX}-icon--has-shape`);
        } else {
            classes.push(`${CSS_PREFIX}-icon--no-shape`);
        }

        if (lx.color) {
            classes.push(`${CSS_PREFIX}-icon--color-${lx.color}`);
        } else if (lx.theme) {
            classes.push(`${CSS_PREFIX}-icon--color-${lx.theme === 'light' ? 'dark' : 'light'}`);
        } else if (lx.hasShape) {
            classes.push(`${CSS_PREFIX}-icon--color-${_DEFAULT_PROPS.color}`);
        }

        if (lx.colorVariant) {
            classes.push(`${CSS_PREFIX}-icon--color-variant-${lx.colorVariant}`);
        }

        if (lx.size) {
            classes.push(`${CSS_PREFIX}-icon--size-${lx.size}`);
        } else if (lx.hasShape) {
            classes.push(`${CSS_PREFIX}-icon--size-${_DEFAULT_PROPS.size}`);
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
            hasShape: '=?lxHasShape',
            path: '@?lxPath',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.icon').directive('lxIcon', IconDirective);

/////////////////////////////

export { IconDirective };
