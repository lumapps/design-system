import { CSS_PREFIX } from '@lumx/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

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
            align: '@?lumxAlign',
            aspectRatio: '@?lumxAspectRatio',
            fillHeight: '=?lumxFillHeight',
            image: '@lumxImage',
            theme: '@?lumxTheme',
        },
        template,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.thumbnail`).directive(`${COMPONENT_PREFIX}Thumbnail`, ThumbnailDirective);

/////////////////////////////

export { ThumbnailDirective };
