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
     * Whether the directive has content slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasContent = false;

    /**
     * Whether the directive has primary slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasPrimary = false;

    /**
     * Whether the directive has secondary slot filled or not.
     *
     * @type {boolean}
     */
    lxListItem.hasSecondary = false;

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
        if (transclude.isSlotFilled('primary')) {
            ctrls[0].hasPrimary = true;
        }

        if (transclude.isSlotFilled('content')) {
            ctrls[0].hasContent = true;
        }

        if (transclude.isSlotFilled('secondary')) {
            ctrls[0].hasSecondary = true;
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
            content: '?lxListItemContent',
            primary: '?lxListItemPrimary',
            secondary: '?lxListItemSecondary',
        },
    };
}

/////////////////////////////

angular.module('lumx.list').directive('lxListItem', lxListItemDirective);

/////////////////////////////

export { lxListItemDirective };
