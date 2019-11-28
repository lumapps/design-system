import { CSS_PREFIX } from '@lumx/core/constants';

import template from './user-block.html';

/////////////////////////////

function UserBlockController() {
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
        orientation: 'horizontal',
        size: 'm',
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has action slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasAction = false;

    /**
     * Whether the directive has actions slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasActions = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get user block classes.
     *
     * @return {Array} The list of user block classes.
     */
    function getClasses() {
        const classes = [];

        const orientation = lx.orientation ? lx.orientation : _DEFAULT_PROPS.orientation;
        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-user-block--orientation-${orientation}`);
        classes.push(`${CSS_PREFIX}-user-block--size-${size}`);
        classes.push(`${CSS_PREFIX}-user-block--theme-${theme}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function UserBlockDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('action')) {
            ctrl.hasAction = true;
        }

        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }
    }

    return {
        bindToController: true,
        controller: UserBlockController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            avatar: '@?lxAvatar',
            fields: '=?lxFields',
            name: '@?lxName',
            onClick: '&?lxOnClick',
            onMouseEnter: '&?lxOnMouseEnter',
            onMouseLeave: '&?lxOnMouseLeave',
            orientation: '@?lxOrientation',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            action: '?lxUserBlockAction',
            actions: '?lxUserBlockActions',
        },
    };
}

/////////////////////////////

angular.module('lumx.user-block').directive('lxUserBlock', UserBlockDirective);

/////////////////////////////

export { UserBlockDirective };
