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
     * Whether the directive has center slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasCenter = false;

    /**
     * Whether the directive has left slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasLeft = false;

    /**
     * Whether the directive has right slot filled or not.
     *
     * @type {boolean}
     */
    lxToolbar.hasRight = false;
}

/////////////////////////////

function lxToolbarDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('center')) {
            ctrl.hasCenter = true;
            el.addClass('lx-toolbar--has-center');
        }

        if (transclude.isSlotFilled('left')) {
            ctrl.hasLeft = true;
            el.addClass('lx-toolbar--has-left');
        }

        if (transclude.isSlotFilled('right')) {
            ctrl.hasRight = true;
            el.addClass('lx-toolbar--has-right');
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
            center: '?lxToolbarCenter',
            left: '?lxToolbarLeft',
            right: '?lxToolbarRight',
        },
    };
}

/////////////////////////////

angular.module('lumx.toolbar').directive('lxToolbar', lxToolbarDirective);

/////////////////////////////

export { lxToolbarDirective };
