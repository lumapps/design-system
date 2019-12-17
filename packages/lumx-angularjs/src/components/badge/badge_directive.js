import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './badge.html';

/////////////////////////////

function BadgeController() {
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
        color: 'light',
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

        const color = lx.color ? lx.color : _DEFAULT_PROPS.color;
        classes.push(`${CSS_PREFIX}-badge--color-${color}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function BadgeDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: BadgeController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lxColor',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.badge').directive('lxBadge', BadgeDirective);

/////////////////////////////

export { BadgeDirective };
