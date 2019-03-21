import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ThumbnailDirective() {
    'ngInject';

    /**
     * Get thumbnail template according to variant.
     *
     * @param  {Element} el    The directive element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The thumbnail html template.
     */
    function getTemplate(el, attrs) {
        let thumbnailClass = `${CSS_PREFIX}-thumbnail`;

        if (!attrs.lumxSize) {
            thumbnailClass += ` ${CSS_PREFIX}-thumbnail--size-m`;
        }

        if (!attrs.lumxVariant) {
            thumbnailClass += ` ${CSS_PREFIX}-thumbnail--variant-squared`;
        }

        return `<div class="${thumbnailClass}"></div>`;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lumxImage', (newImage) => {
            el.css('background-image', `url(${newImage})`);
        });

        attrs.$observe('lumxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)thumbnail--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--size-${size}`);
        });

        attrs.$observe('lumxVariant', (variant) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)thumbnail--variant-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--variant-${variant}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: getTemplate,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.thumbnail`).directive(`${COMPONENT_PREFIX}Thumbnail`, ThumbnailDirective);

/////////////////////////////

export { ThumbnailDirective };
