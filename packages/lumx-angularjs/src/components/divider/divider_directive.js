import { CSS_PREFIX } from '@lumx/core/constants';

import template from './divider.html';

/////////////////////////////

function DividerController() {
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
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get divider classes.
     *
     * @return {Array} The list of divider classes.
     */
    function getClasses() {
        const classes = [];

        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        classes.push(`${CSS_PREFIX}-divider--theme-${theme}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function DividerDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: DividerController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        theme: '@?lxTheme',
        template,
    };
}

/////////////////////////////

angular.module('lumx.divider').directive('lxDivider', DividerDirective);

/////////////////////////////

export { DividerDirective };
