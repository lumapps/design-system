import { CSS_PREFIX } from '@lumx/core/js/constants';

import template from './image-block.html';

/////////////////////////////

function ImageBlockController() {
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
        captionPosition: 'below',
        format: 'original',
        theme: 'light',
    };

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the directive has actions slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasActions = false;

    /**
     * Whether the directive has tags slot filled or not.
     *
     * @type {boolean}
     */
    lx.hasTags = false;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get image block classes.
     *
     * @return {Array} The list of image block classes.
     */
    function getClasses() {
        const classes = [];

        const align = lx.align ? lx.align : _DEFAULT_PROPS.align;
        const captionPosition = lx.captionPosition ? lx.captionPosition : _DEFAULT_PROPS.captionPosition;
        const format = lx.format ? lx.format : _DEFAULT_PROPS.format;
        const theme = lx.theme ? lx.theme : _DEFAULT_PROPS.theme;

        classes.push(`${CSS_PREFIX}-image-block--align-${align}`);
        classes.push(`${CSS_PREFIX}-image-block--caption-position-${captionPosition}`);
        classes.push(`${CSS_PREFIX}-image-block--format-${format}`);
        classes.push(`${CSS_PREFIX}-image-block--theme-${theme}`);

        if (lx.aspectRatio) {
            classes.push(`${CSS_PREFIX}-image-block--aspect-ratio-${lx.aspectRatio}`);
        }

        if (lx.fillHeight) {
            classes.push(`${CSS_PREFIX}-image-block--fill-height`);
        }

        if (lx.size) {
            classes.push(`${CSS_PREFIX}-image-block--size-${lx.size}`);
        }

        return classes;
    }

    /////////////////////////////

    lx.getClasses = getClasses;
}

/////////////////////////////

function ImageBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        if (transclude.isSlotFilled('actions')) {
            ctrl.hasActions = true;
        }

        if (transclude.isSlotFilled('tags')) {
            ctrl.hasTags = true;
        }
    }

    return {
        bindToController: true,
        controller: ImageBlockController,
        controllerAs: 'lx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lxAlign',
            aspectRatio: '@?lxAspectRatio',
            captionPosition: '@?lxCaptionPosition',
            captionStyle: '=?lxCaptionStyle',
            description: '@?lxDescription',
            fillHeight: '=?lxFillHeight',
            image: '@lxImage',
            onClick: '&?lxOnClick',
            size: '@?lxSize',
            theme: '@?lxTheme',
            title: '@?lxTitle',
        },
        template,
        transclude: {
            actions: '?lxImageBlockActions',
            tags: '?lxImageBlockTags',
        },
    };
}

/////////////////////////////

angular.module('lumx.image-block').directive('lxImageBlock', ImageBlockDirective);

/////////////////////////////

export { ImageBlockDirective };
