import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './lx-image-block.html';

/////////////////////////////

function ImageBlockController() {
    // eslint-disable-next-line consistent-this
    const lxImageBlock = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get image style according to image url and image height.
     *
     * @return {Object} The image style properties.
     */
    function getImageStyle() {
        const imageStyle = {
            backgroundImage: `url(${lxImageBlock.image})`,
        };

        if (!lxImageBlock.aspectRatio || lxImageBlock.aspectRatio === 'original') {
            imageStyle.height = lxImageBlock.imageHeight;
        }

        return imageStyle;
    }

    /////////////////////////////

    lxImageBlock.getImageStyle = getImageStyle;
}

/////////////////////////////

function ImageBlockDirective() {
    return {
        bindToController: true,
        controller: ImageBlockController,
        controllerAs: 'lxImageBlock',
        replace: true,
        restrict: 'E',
        scope: {
            aspectRatio: '@?lxAspectRatio',
            captionPosition: '@?lxCaptionPosition',
            description: '@?lxDescription',
            image: '@lxImage',
            imageHeight: '@?lxImageHeight',
            tags: '=?lxTags',
            theme: '@?lxTheme',
            title: '@?lxTitle',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.image-block`).directive(`${COMPONENT_PREFIX}ImageBlock`, ImageBlockDirective);

/////////////////////////////

export { ImageBlockDirective };
