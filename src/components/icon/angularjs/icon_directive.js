import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function IconDirective() {
    'ngInject';

    /**
     * Get icon template according to color and size.
     *
     * @return {string} The icon html template.
     */
    function getTemplate() {
        return `
            <i class="${CSS_PREFIX}-icon">
                <svg
                    aria-hidden="true"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    width="1em"
                >
                    <path fill="currentColor" />
                </svg>
            </i>
        `;
    }

    function link(scope, el, attrs) {
        attrs.$observe('lumxPath', (path) => {
            el.find('path').attr('d', path);
        });

        attrs.$observe('lumxColor', (color) => {
            if (!color) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--color-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--color-${color}`);
        });

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*icon--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-icon--size-${size}`);
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

angular.module(`${MODULE_NAME}.icon`).directive(`${COMPONENT_PREFIX}Icon`, IconDirective);

/////////////////////////////

export { IconDirective };
