import '../style/lx-thumbnail.scss';

/////////////////////////////

function lxThumbnailDirective() {
    /**
     * Get thumbnail template according to variant.
     *
     * @param  {Element} el    The directive element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The thumbnail html template.
     */
    function getTemplate(el, attrs) {
        let thumbnailClass = 'lx-thumbnail';

        if (!attrs.lxSize) {
            thumbnailClass += ' lx-thumbnail--size-m';
        }

        if (!attrs.lxVariant) {
            thumbnailClass += ' lx-thumbnail--variant-squared';
        }

        return `<div class="${thumbnailClass}"></div>`;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lxImage', (newImage) => {
            el.css('background-image', `url(${newImage})`);
        });

        attrs.$observe('lxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-thumbnail--size-\S+/g) || []).join(' ');
            }).addClass(`lx-thumbnail--size-${size}`);
        });

        attrs.$observe('lxVariant', (variant) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-thumbnail--variant-\S+/g) || []).join(' ');
            }).addClass(`lx-thumbnail--variant-${variant}`);
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

angular.module('lumx.thumbnail').directive('lxThumbnail', lxThumbnailDirective);

/////////////////////////////

export { lxThumbnailDirective };
