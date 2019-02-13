import '../style/lx-icon.scss';

/////////////////////////////

function lxIconDirective() {
    /**
     * Get icon template according to color and size.
     *
     * @param  {Element} el    The directive element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The icon html template.
     */
    function getTemplate(el, attrs) {
        let iconClass = 'lx-icon';

        if (angular.isDefined(attrs.lxColor)) {
            iconClass += ` lx-icon--color-${attrs.lxColor}`;
        }

        if (angular.isDefined(attrs.lxSize)) {
            iconClass += ` lx-icon--size-${attrs.lxSize}`;
        }

        return `<i class="${iconClass}"><iconify-icon class="iconify" data-icon="mdi:${
            attrs.lxId
        }"></iconify-icon></i>`;
    }

    return {
        replace: true,
        restrict: 'E',
        template: getTemplate,
    };
}

/////////////////////////////

angular.module('lumx.icon').directive('lxIcon', lxIconDirective);

/////////////////////////////

export { lxIconDirective };
