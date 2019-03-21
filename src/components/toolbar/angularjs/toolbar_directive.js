import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './toolbar.html';

/////////////////////////////

function ToolbarController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has after slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasBefore = false;

    /**
     * Whether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasLabel = false;
}

/////////////////////////////

function ToolbarDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrl.hasBefore = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-before`);
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-label`);
        }

        if (transclude.isSlotFilled('after')) {
            ctrl.hasAfter = true;
            el.addClass(`${CSS_PREFIX}-toolbar--has-after`);
        }
    }

    return {
        bindToController: true,
        controller: ToolbarController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        template,
        transclude: {
            after: `?${COMPONENT_PREFIX}ToolbarAfter`,
            before: `?${COMPONENT_PREFIX}ToolbarBefore`,
            label: `?${COMPONENT_PREFIX}ToolbarLabel`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.toolbar`).directive(`${COMPONENT_PREFIX}Toolbar`, ToolbarDirective);

/////////////////////////////

export { ToolbarDirective };
