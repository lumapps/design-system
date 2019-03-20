import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './image-block.html';

/////////////////////////////

function ImageBlockController() {
    // eslint-disable-next-line consistent-this
    const lumx = this;

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
            backgroundImage: `url(${lumx.image})`,
        };

        if (!lumx.aspectRatio || lumx.aspectRatio === 'original') {
            imageStyle.height = lumx.imageHeight;
        }

        return imageStyle;
    }

    /////////////////////////////

    lumx.getImageStyle = getImageStyle;
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
