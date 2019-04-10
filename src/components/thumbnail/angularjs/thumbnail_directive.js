import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ThumbnailDirective() {
    'ngInject';

    /**
     * Get thumbnail template according to variant.
     *
     * @return {string} The thumbnail html template.
     */
    function getTemplate() {
        return `<div class="${CSS_PREFIX}-thumbnail"></div>`;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lumxImage', (newImage) => {
            el.css('background-image', `url(${newImage})`);
        });

        if (!attrs.lumxSize) {
            el.addClass(`${CSS_PREFIX}-thumbnail--size-m`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*thumbnail--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-thumbnail--size-${size}`);
        });

        if (!attrs.lumxVariant) {
            el.addClass(` ${CSS_PREFIX}-thumbnail--variant-squared`);
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
