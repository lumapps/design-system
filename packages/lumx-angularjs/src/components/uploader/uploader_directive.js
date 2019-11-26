import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

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
        size: 'xl',
        theme: 'light',
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
        const aspectRatio = lumx.aspectRatio ? lumx.aspectRatio : _DEFAULT_PROPS.aspectRatio;
        const size = lumx.size ? lumx.size : _DEFAULT_PROPS.size;
        const theme = lumx.theme ? lumx.theme : _DEFAULT_PROPS.theme;
        const variant = lumx.variant ? lumx.variant : _DEFAULT_PROPS.variant;

        // Adjust to square aspect ratio when using circle variants.
        const adjustedAspectRatio = variant === 'circle' ? 'square' : aspectRatio;

        return [
            `${CSS_PREFIX}-uploader--aspect-ratio-${adjustedAspectRatio}`,
            `${CSS_PREFIX}-uploader--size-${size}`,
            `${CSS_PREFIX}-uploader--theme-${theme}`,
            `${CSS_PREFIX}-uploader--variant-${variant}`,
        ];
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
            theme: '@?lumxTheme',
            variant: '@?lumxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.uploader`).directive(`${COMPONENT_PREFIX}Uploader`, UploaderDirective);

/////////////////////////////

export { UploaderDirective };
