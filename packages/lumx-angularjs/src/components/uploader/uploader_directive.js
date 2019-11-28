import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './uploader.html';

/////////////////////////////

function UploaderController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
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
        const classes = [];

        const aspectRatio = lx.aspectRatio ? lx.aspectRatio : _DEFAULT_PROPS.aspectRatio;
        const size = lx.size ? lx.size : _DEFAULT_PROPS.size;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;
        const variant = lx.variant ? lx.variant : _DEFAULT_PROPS.variant;

        // Adjust to square aspect ratio when using circle variants.
        const adjustedAspectRatio = variant === 'circle' ? 'square' : aspectRatio;

        classes.push(`${CSS_PREFIX}-uploader--aspect-ratio-${adjustedAspectRatio}`);
        classes.push(`${CSS_PREFIX}-uploader--size-${size}`);
        classes.push(`${CSS_PREFIX}-uploader--theme-${theme}`);
        classes.push(`${CSS_PREFIX}-uploader--variant-${variant}`);

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function UploaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: UploaderController,
        controllerAs: 'lx',
        replace: true,
        restrict: 'E',
        scope: {
            aspectRatio: '@?lxAspectRatio',
            icon: '@?lxIcon',
            label: '@?lxLabel',
            size: '@?lxSize',
            theme: '@?lxTheme',
            variant: '@?lxVariant',
        },
        template,
    };
}

/////////////////////////////

angular.module('lumx.uploader').directive('lxUploader', UploaderDirective);

/////////////////////////////

export { UploaderDirective };
