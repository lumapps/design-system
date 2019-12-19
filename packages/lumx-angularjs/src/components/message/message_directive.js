import { mdiAlert, mdiAlertCircle, mdiCheckCircle, mdiInformation } from '@lumx/icons';

import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './message.html';

/////////////////////////////

function MessageController() {
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
        success: 'green',
        warning: 'yellow',
    };

    /**
     * The icons according to kind.
     *
     * @type {Object}
     * @constant
     * @readonly
     */
    const _KIND_ICON = {
        error: mdiAlert,
        info: mdiInformation,
        success: mdiCheckCircle,
        warning: mdiAlertCircle,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get message classes.
     *
     * @return {Array} The list of message classes.
     */
    function getClasses() {
        const classes = [];

        const color = lx.kind ? _KIND_COLOR[lx.kind] : _DEFAULT_PROPS.color;
        classes.push(`${CSS_PREFIX}-message--color-${color}`);

        if (lx.hasBackground) {
            classes.push(`${CSS_PREFIX}-message--has-background`);
        }

        return classes;
    }

    /**
     * Get icon according to kind.
     *
     * @return {string} The icon path.
     */
    function getIcon() {
        return _KIND_ICON[lx.kind];
    }

    /////////////////////////////

    lx.getClasses = getClasses;
    lx.getIcon = getIcon;
}

/////////////////////////////

function MessageDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: MessageController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            hasBackground: '=?lxHasBackground',
            kind: '@?lxKind',
        },
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.message').directive('lxMessage', MessageDirective);

/////////////////////////////

export { MessageDirective };
