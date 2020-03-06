import { CSS_PREFIX } from '@lumx/core/js/constants';

/////////////////////////////

function ChipGroupController() {
    'ngInject';

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
        align: 'left',
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get button classes.
     *
     * @return {Array} The list of button classes.
     */
    function getClasses() {
        const classes = [];

        const align = lx.align ? lx.align : _DEFAULT_PROPS.align;
        classes.push(`${CSS_PREFIX}-chip-group--align-${align}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function ChipGroupDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ChipGroupController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
        },
        template: `<div class="${CSS_PREFIX}-chip-group" ng-class="lx.getClasses()" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module('lumx.chip').directive('lxChipGroup', ChipGroupDirective);

/////////////////////////////

export { ChipGroupDirective };
