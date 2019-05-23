import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './image-block.html';

/////////////////////////////

function ImageBlockController() {
    // eslint-disable-next-line consistent-this, no-unused-vars
    const lumx = this;
}

/////////////////////////////

function ImageBlockDirective() {
    return {
        bindToController: true,
        controller: ImageBlockController,
        controllerAs: 'lumx',
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
            tags: '=?lumxTags',
            theme: '@?lumxTheme',
            title: '@?lumxTitle',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.image-block`).directive(`${COMPONENT_PREFIX}ImageBlock`, ImageBlockDirective);

/////////////////////////////

export { ImageBlockDirective };
