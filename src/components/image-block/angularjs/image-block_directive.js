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
        if (angular.isUndefined(lumx.aspectRatio) || lumx.aspectRatio === 'original') {
            return {};
        }

        return {
            backgroundImage: `url(${lumx.image})`,
        };
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
            aspectRatio: '@?lumxAspectRatio',
            captionPosition: '@?lumxCaptionPosition',
            captionStyle: '=?lumxCaptionStyle',
            description: '@?lumxDescription',
            image: '@lumxImage',
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
