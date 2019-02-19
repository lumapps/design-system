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
        return `<i class="lx-icon"><iconify-icon class="iconify" data-icon="mdi:${attrs.lxId}"></iconify-icon></i>`;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lxColor', (color) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-icon--color-\S+/g) || []).join(' ');
            }).addClass(`lx-icon--color-${color}`);
        });

        attrs.$observe('lxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-icon--size-\S+/g) || []).join(' ');
            }).addClass(`lx-icon--size-${size}`);
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

angular.module('lumx.icon').directive('lxIcon', lxIconDirective);

/////////////////////////////

export { lxIconDirective };
