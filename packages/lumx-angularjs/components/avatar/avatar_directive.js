import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './avatar.html';

/////////////////////////////

function AvatarController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;

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
    lumx.hasActions = false;
}

/////////////////////////////

function AvatarDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        const defaultProps = {
            size: 'm',
            theme: 'light',
        };

        attrs.$observe('lumxImage', (newImage) => {
            el.css('background-image', `url(${newImage})`);
        });

        if (!attrs.lumxSize) {
            el.addClass(`${CSS_PREFIX}-avatar--size-${defaultProps.size}`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*avatar--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-avatar--size-${size}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-avatar--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*avatar--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-avatar--theme-${theme}`);
        });

        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }
    }

    return {
        bindToController: true,
        controller: AvatarController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {},
        template,
        transclude: {
            actions: `?${COMPONENT_PREFIX}AvatarActions`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.avatar`).directive(`${COMPONENT_PREFIX}Avatar`, AvatarDirective);

/////////////////////////////

export { AvatarDirective };
