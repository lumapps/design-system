import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './avatar.html';

/////////////////////////////

function AvatarController() {
    'ngInject';

    // eslint-disable-next-line consistent-this, no-unused-vars
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
        size: 'm',
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

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
     * Get background image according to image url.
     *
     * @return {Object} The image style properties.
     */
    function getBackgroundImage() {
        return {
            backgroundImage: `url(${lx.image})`,
        };
    }

    /**
     * Get avatar classes.
     *
     * @return {Array} The list of avatar classes.
     */
    function getClasses() {
        const classes = [];

        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-avatar--size-${size}`);
        classes.push(`${CSS_PREFIX}-avatar--theme-${theme}`);

        return classes;
    }

    /////////////////////////////

    lx.getBackgroundImage = getBackgroundImage;
    lx.getClasses = getClasses;
}

/////////////////////////////

function AvatarDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }
    }

    return {
        bindToController: true,
        controller: AvatarController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            image: '@lxImage',
            size: '@?lxSize',
            theme: '@?lxTheme',
        },
        template,
        transclude: {
            actions: '?lxAvatarActions',
        },
    };
}

/////////////////////////////

angular.module('lumx.avatar').directive('lxAvatar', AvatarDirective);

/////////////////////////////

export { AvatarDirective };
