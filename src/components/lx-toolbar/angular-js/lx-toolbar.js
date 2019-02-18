import '../style/lx-toolbar.scss';
import template from './lx-toolbar.html';

/////////////////////////////

function lxToolbarController() {
    // eslint-disable-next-line consistent-this
    const lxToolbar = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Wether the directive has label slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasLabel = false;

    /**
     * Wether the directive has left slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasLeft = false;

    /**
     * Wether the directive has right slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasRight = false;
}

/////////////////////////////

function lxToolbarDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
        }

        if (transclude.isSlotFilled('left')) {
            ctrl.hasLeft = true;
        }

        if (transclude.isSlotFilled('right')) {
            ctrl.hasRight = true;
        }
    }

    return {
        bindToController: true,
        controller: lxToolbarController,
        controllerAs: 'lxToolbar',
        link,
        replace: true,
        restrict: 'E',
        template,
        transclude: {
            label: '?lxToolbarLabel',
            left: '?lxToolbarLeft',
            right: '?lxToolbarRight',
        },
    };
}

/////////////////////////////

angular.module('lumx.toolbar').directive('lxToolbar', lxToolbarDirective);

/////////////////////////////

export { lxToolbarDirective };
