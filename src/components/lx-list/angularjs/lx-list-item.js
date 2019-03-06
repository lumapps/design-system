import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-list-item.html';

/////////////////////////////

function lxListItemController($element) {
    // eslint-disable-next-line consistent-this
    const lxListItem = this;

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
    lxListItem.hasAfter = false;

    /**
     * Whether the directive has before slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasBefore = false;

    /**
     * Whether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasContent = false;

    /**
     * The parent controller (list).
     *
     * @type {Object}
     */
    lxListItem.parentController = undefined;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    $element.on('focus', () => {
        if (angular.isUndefined(lxListItem.parentController)) {
            return;
        }

        lxListItem.parentController.activeItemIndex = $element.index('.lx-list-item');
    });
}

/////////////////////////////

function lxListItemDirective() {
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
            ctrls[0].parentController = ctrls[1];
        }
    }

    return {
        bindToController: true,
        controller: lxListItemController,
        controllerAs: 'lxListItem',
        link,
        replace: true,
        require: ['lxListItem', '?^lxList'],
        restrict: 'E',
        scope: {
            isSelected: '=?lxIsSelected',
        },
        template,
        transclude: {
            after: '?lxListItemAfter',
            before: '?lxListItemBefore',
            content: '?lxListItemContent',
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.list`).directive('lxListItem', lxListItemDirective);

/////////////////////////////

export { lxListItemDirective };
