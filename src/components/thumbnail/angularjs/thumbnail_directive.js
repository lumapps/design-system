import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import template from './thumbnail.html';

/////////////////////////////

function ThumbnailController() {
    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get background image according to image url.
     *
     * @return {Object} The image style properties.
     */
    function getBackgroundImage() {
        if (angular.isUndefined(lumx.aspectRatio) || lumx.aspectRatio === 'original') {
            return {};
        }

        return {
            backgroundImage: `url(${lumx.image})`,
        };
    }

    /////////////////////////////

    lumx.getBackgroundImage = getBackgroundImage;
}

/////////////////////////////

function ThumbnailDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            aspectRatio: 'original',
            theme: 'light',
            variant: 'squared',
        };

        if (!attrs.lumxAspectRatio) {
            el.addClass(`${CSS_PREFIX}-thumbnail--aspect-ratio-${defaultProps.aspectRatio}`);
        }

        attrs.$observe('lumxAspectRatio', (aspectRatio) => {
            if (!aspectRatio) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--aspect-ratio-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--aspect-ratio-${aspectRatio}`);
        });

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--size-${size}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-thumbnail--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--theme-${theme}`);
        });

        if (!attrs.lumxVariant) {
            el.addClass(`${CSS_PREFIX}-thumbnail--variant-${defaultProps.variant}`);
        }

        attrs.$observe('lumxVariant', (variant) => {
            if (!variant) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--variant-${variant}`);
        });
    }

    return {
        bindToController: true,
        controller: ThumbnailController,
        controllerAs: 'lumx',
        link,
        replace: true,
        restrict: 'E',
        scope: {
            aspectRatio: '@?lumxAspectRatio',
            image: '@lumxImage',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.thumbnail`).directive(`${COMPONENT_PREFIX}Thumbnail`, ThumbnailDirective);

/////////////////////////////

export { ThumbnailDirective };
