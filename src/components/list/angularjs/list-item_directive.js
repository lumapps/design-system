import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './list-item.html';

/////////////////////////////

function ListItemController($element) {
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
     * Whether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasContent = false;

    /**
     * The parent controller (list).
     *
     * @type {Object}
     */
    lumx.parentController = undefined;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    $element.on('focus', () => {
        if (angular.isUndefined(lumx.parentController)) {
            return;
        }

        lumx.parentController.activeItemIndex = $element.index(`.${COMPONENT_PREFIX}-list-item`);
    });
}

/////////////////////////////

function ListItemDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        if (transclude.isSlotFilled('before')) {
            ctrls[0].hasBefore = true;
        }

        if (transclude.isSlotFilled('content')) {
            ctrls[0].hasContent = true;
        }

        if (transclude.isSlotFilled('after')) {
            ctrls[0].hasAfter = true;
        }

        if (angular.isDefined(ctrls[1]) && ctrls[1]) {
            // eslint-disable-next-line prefer-destructuring
            ctrls[0].parentController = ctrls[1];
        }
    }

    return {
        bindToController: true,
        controller: ListItemController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}ListItem`, `?^${COMPONENT_PREFIX}List`],
        restrict: 'E',
        scope: {
            isSelected: '=?lumxIsSelected',
        },
        template,
        transclude: {
            after: `?${COMPONENT_PREFIX}ListItemAfter`,
            before: `?${COMPONENT_PREFIX}ListItemBefore`,
            content: `?${COMPONENT_PREFIX}ListItemContent`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive(`${COMPONENT_PREFIX}ListItem`, ListItemDirective);

/////////////////////////////

export { ListItemDirective };
