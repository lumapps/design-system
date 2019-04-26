import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function AvatarDirective() {
    'ngInject';

    function link(scope, el, attrs) {
        const defaultProps = {
            size: 'm',
            theme: 'light',
        };

        attrs.$observe('lumxImage', (newImage) => {
            el.css('background-image', `url(${newImage})`);
        });

        if (!attrs.lumxSize) {
            el.addClass(`${CSS_PREFIX}-avatar--size-${defaultProps.size}`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*avatar--size-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-avatar--size-${size}`);
        });

        if (!attrs.lumxTheme) {
            el.addClass(`${CSS_PREFIX}-avatar--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            el.removeClass((index, className) => {
                return (className.match(/(?:\S|-)*avatar--theme-\S+/g) || []).join(' ');
            }).addClass(`${CSS_PREFIX}-avatar--theme-${theme}`);
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: `<div class="${CSS_PREFIX}-avatar"></div>`,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.avatar`).directive(`${COMPONENT_PREFIX}Avatar`, AvatarDirective);

/////////////////////////////

export { AvatarDirective };
