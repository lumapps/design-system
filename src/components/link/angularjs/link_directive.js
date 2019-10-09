import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function LinkController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get link classes.
     *
     * @return {Array} The list of link classes.
     */
    function getClasses() {
        const classes = [];

        if (angular.isDefined(lumx.color)) {
            classes.push(`${CSS_PREFIX}-link--color-${lumx.color}`);
        }

        if (angular.isDefined(lumx.colorVariant)) {
            classes.push(`${CSS_PREFIX}-link--color-variant-${lumx.colorVariant}`);
        }

        return classes;
    }

    /////////////////////////////

    lumx.getClasses = getClasses;
}

/////////////////////////////

function LinkDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: LinkController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            color: '@?lumxColor',
            colorVariant: '@?lumxColorVariant',
        },
        template: `<a class="${CSS_PREFIX}-link" ng-class="lumx.getClasses()" ng-transclude></a>`,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.link`).directive(`${COMPONENT_PREFIX}Link`, LinkDirective);

/////////////////////////////

export { LinkDirective };
