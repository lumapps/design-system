import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './input-helper.html';

/////////////////////////////

function InputHelperController() {
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
        kind: 'info',
        theme: 'light',
    };

    /**
     * The color according to kind.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _KIND_COLOR = {
        error: 'red',
        info: 'dark',
        valid: 'green',
        warning: 'yellow',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get input helper classes.
     *
     * @return {Array} The list of input helper classes.
     */
    function getClasses() {
        const classes = [];

        const color = lx.kind ? _KIND_COLOR[lx.kind] : _DEFAULT_PROPS.color;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-input-helper--color-${color}`);
        classes.push(`${CSS_PREFIX}-input-helper--theme-${theme}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function InputHelperDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: InputHelperController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            helper: '@lxHelper',
            kind: '@?lxKind',
            theme: '@?lxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.input-helper').directive('lxInputHelper', InputHelperDirective);

/////////////////////////////

export { InputHelperDirective };
