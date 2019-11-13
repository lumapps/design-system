import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './user-block.html';

/////////////////////////////

function UserBlockController() {
    // eslint-disable-next-line consistent-this
    const lumx = this;

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
    lumx.hasAction = false;

    /**
     * Whether the directive has actions slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasActions = false;
}

/////////////////////////////

function UserBlockDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        const defaultProps = {
            orientation: 'horizontal',
            size: 'm',
            theme: 'light',
        };

        if (!attrs.lumxOrientation) {
            el.addClass(`${CSS_PREFIX}-user-block--orientation-${defaultProps.orientation}`);
        }

        attrs.$observe('lumxOrientation', (orientation) => {
            if (!orientation || (orientation === 'vertical' && attrs.lumxSize !== 'l')) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*user-block--orientation-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-user-block--orientation-${orientation}`);
        });

        if (!attrs.lumxSize) {
            el.addClass(`${CSS_PREFIX}-user-block--size-${defaultProps.size}`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*user-block--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-user-block--size-${size}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-user-block--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*user-block--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-user-block--theme-${theme}`);
        });

        if (transclude.isSlotFilled('action') && attrs.lumxOrientation === 'vertical') {
            ctrl.hasAction = true;
        }

        if (transclude.isSlotFilled('actions') && attrs.lumxOrientation === 'vertical') {
            ctrl.hasActions = true;
        }
    }

    return {
        bindToController: true,
        controller: UserBlockController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            avatar: '@?lumxAvatar',
            fields: '=?lumxFields',
            name: '@?lumxName',
            onClick: '&?lumxOnClick',
            onMouseEnter: '&?lumxOnMouseEnter',
            onMouseLeave: '&?lumxOnMouseLeave',
            orientation: '@?lumxOrientation',
            size: '@?lumxSize',
            theme: '@?lumxTheme',
        },
        template,
        transclude: {
            action: `?${COMPONENT_PREFIX}UserBlockAction`,
            actions: `?${COMPONENT_PREFIX}UserBlockActions`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.user-block`).directive(`${COMPONENT_PREFIX}UserBlock`, UserBlockDirective);

/////////////////////////////

export { UserBlockDirective };
