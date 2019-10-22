import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './uploader.html';

/////////////////////////////

function UploaderController() {
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
        aspectRatio: 'horizontal',
        variant: 'squared',
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

        if (angular.isDefined(lumx.aspectRatio) && lumx.aspectRatio) {
            classes.push(`${CSS_PREFIX}-uploader--aspect-ratio-${lumx.aspectRatio}`);
        } else {
            classes.push(`${CSS_PREFIX}-uploader--aspect-ratio-${_DEFAULT_PROPS.aspectRatio}`);
        }

        if (angular.isDefined(lumx.variant) && lumx.variant) {
            classes.push(`${CSS_PREFIX}-uploader--variant-${lumx.variant}`);
        } else {
            classes.push(`${CSS_PREFIX}-uploader--variant-${_DEFAULT_PROPS.variant}`);
        }

        if (angular.isDefined(lumx.size) && lumx.size) {
            classes.push(`${CSS_PREFIX}-uploader--size-${lumx.size}`);
        }

        return classes;
    }

    /////////////////////////////

    lumx.getClasses = getClasses;
}

/////////////////////////////

function UploaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: UploaderController,
        controllerAs: 'lumx',
        replace: true,
        restrict: 'E',
        scope: {
            aspectRatio: '@?lumxAspectRatio',
            icon: '@?lumxIcon',
            label: '@?lumxLabel',
            size: '@?lumxSize',
            variant: '@?lumxVariant',
        },
        template,
        transclude: {
            action: `${COMPONENT_PREFIX}UploaderAction`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.uploader`).directive(`${COMPONENT_PREFIX}Uploader`, UploaderDirective);

/////////////////////////////

export { UploaderDirective };
