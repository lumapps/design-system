import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ChipGroupController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

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

        if (angular.isDefined(lumx.align) && lumx.align) {
            classes.push(`${CSS_PREFIX}-chip-group--align-${lumx.align}`);
        } else {
            classes.push(`${CSS_PREFIX}-chip-group--align-${_DEFAULT_PROPS.align}`);
        }

        return classes;
    }

    /////////////////////////////

    lumx.getClasses = getClasses;
}

/////////////////////////////

function ChipGroupDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: ChipGroupController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lumxAlign',
        },
        template: `<div class="${CSS_PREFIX}-chip-group" ng-class="lumx.getClasses()" ng-transclude></div>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.chip`).directive(`${COMPONENT_PREFIX}ChipGroup`, ChipGroupDirective);

/////////////////////////////

export { ChipGroupDirective };
