import '../style/lx-chip.scss';

/////////////////////////////

function lxChipController() {
    // eslint-disable-next-line consistent-this
    const lxChip = this;

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
    lxChip.hasLabel = false;

    /**
     * Wether the directive has primary slot filled or not.
     *
     * @type {boolean}
     */
    lxChip.hasPrimary = false;
}

/////////////////////////////

function lxChipDirective() {
    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('primary')) {
            ctrl.hasPrimary = true;
        }

        if (transclude.isSlotFilled('label')) {
            ctrl.hasLabel = true;
        }
    }

    return {
        bindToController: true,
        controller: lxChipController,
        controllerAs: 'lxChip',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            isDeletable: '=?lxIsDeletable',
            isDisabled: '=?ngDisabled',
            theme: '@?lxTheme',
        },
        template: require('./lx-chip.html'),
        transclude: {
            label: '?lxChipLabel',
            primary: '?lxChipPrimary',
        },
    };
}

/////////////////////////////

angular.module('lumx.chip').directive('lxChip', lxChipDirective);

/////////////////////////////

export { lxChipDirective };
