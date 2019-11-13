import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './image-block.html';

/////////////////////////////

function ImageBlockController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;

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
    lumx.hasActions = false;

    /**
     * Whether the directive has tags slot filled or not.
     *
     * @type {boolean}
     */
    lumx.hasTags = false;
}

/////////////////////////////

function ImageBlockDirective() {
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
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            align: '@?lumxAlign',
            aspectRatio: '@?lumxAspectRatio',
            captionPosition: '@?lumxCaptionPosition',
            captionStyle: '=?lumxCaptionStyle',
            description: '@?lumxDescription',
            fillHeight: '=?lumxFillHeight',
            image: '@lumxImage',
            onClick: '&?lumxOnClick',
            theme: '@?lumxTheme',
            title: '@?lumxTitle',
        },
        template,
        transclude: {
            actions: `?${COMPONENT_PREFIX}ImageBlockActions`,
            tags: `?${COMPONENT_PREFIX}ImageBlockTags`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.image-block`).directive(`${COMPONENT_PREFIX}ImageBlock`, ImageBlockDirective);

/////////////////////////////

export { ImageBlockDirective };
