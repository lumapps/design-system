import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function ButtonDirective() {
    'ngInject';

    /**
     * Whether the button needs to be converted to a link or not.
     *
     * @param  {Object}  attrs The directive attributes.
     * @return {boolean} Whether the button is an anchor or not.
     */
    function isAnchor(attrs) {
        return (
            angular.isDefined(attrs.href) ||
            angular.isDefined(attrs.ngHref) ||
            angular.isDefined(attrs.ngLink) ||
            angular.isDefined(attrs.uiSref)
        );
    }

    /**
     * Get button template according to type, color and size.
     *
     * @param  {Element} el    The directive element.
     * @param  {Object}  attrs The directive attributes.
     * @return {string}  The button html template.
     */
    function getTemplate(el, attrs) {
        if (isAnchor(attrs)) {
            return `<a class="${CSS_PREFIX}-button" ng-transclude></a>`;
        } else if (attrs.lumxHasBackground) {
            return `
                <div class="${CSS_PREFIX}-button-wrapper">
                    <button class="${CSS_PREFIX}-button" ng-transclude></button>
                </div>
            `;
        }

        return `<button class="${CSS_PREFIX}-button" ng-transclude></button>`;
    }

    function link(scope, el, attrs) {
        let buttonEl = el;

        if (attrs.lumxHasBackground) {
            buttonEl = el.find('button');
        }

        if (!attrs.lumxVariant || attrs.lumxVariant === 'button') {
            const leftIcon = buttonEl.find('i:first-child');
            const rightIcon = buttonEl.find('i:last-child');
            const label = buttonEl.find('span');

            if (leftIcon.length > 0) {
                buttonEl.addClass(`${CSS_PREFIX}-button--has-left-icon`);
            }

            if (rightIcon.length > 0) {
                buttonEl.addClass(`${CSS_PREFIX}-button--has-right-icon`);
            }

            if (label.length === 0) {
                buttonEl.wrapInner('<span></span>');
            }
        }

        const isDefaultEmphasis = !attrs.lumxEmphasis || attrs.lumxEmphasis === 'high';

        const defaultProps = {
            color: isDefaultEmphasis ? 'primary' : 'dark',
            emphasis: 'high',
            size: 'm',
            theme: 'light',
            variant: 'button',
        };

        if (!attrs.lumxColor) {
            buttonEl.addClass(`${CSS_PREFIX}-button--color-${defaultProps.color}`);

            if (attrs.lumxHasBackground && attrs.lumxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-light`);
            }
        }

        attrs.$observe('lumxColor', (color) => {
            if (!color) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--color-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--color-${color}`);

            if (attrs.lumxHasBackground && attrs.lumxEmphasis === 'low') {
                let wrapperColor = 'light';

                if (color === 'light') {
                    wrapperColor = 'dark';
                }

                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-${wrapperColor}`);
            }
        });

        if (!attrs.lumxEmphasis) {
            buttonEl.addClass(`${CSS_PREFIX}-button--emphasis-${defaultProps.emphasis}`);
        }

        attrs.$observe('lumxEmphasis', (emphasis) => {
            if (!emphasis) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--emphasis-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--emphasis-${emphasis}`);
        });

        if (!attrs.lumxSize) {
            buttonEl.addClass(`${CSS_PREFIX}-button--size-${defaultProps.size}`);
        }

        attrs.$observe('lumxSize', (size) => {
            if (!size) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--size-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--size-${size}`);
        });

        if (!attrs.lumxTheme && isDefaultEmphasis) {
            buttonEl.addClass(`${CSS_PREFIX}-button--theme-${defaultProps.theme}`);
        }

        attrs.$observe('lumxTheme', (theme) => {
            if (!theme) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--theme-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--theme-${theme}`);

            if (attrs.lumxHasBackground && attrs.lumxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--color-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--color-${theme}`);
            }
        });

        if (!attrs.lumxVariant) {
            buttonEl.addClass(`${CSS_PREFIX}-button--variant-${defaultProps.variant}`);
        }

        attrs.$observe('lumxVariant', (variant) => {
            if (!variant) {
                return;
            }

            buttonEl
                .removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button--variant-\S+/g) || []).join(' ');
                })
                .addClass(`${CSS_PREFIX}-button--variant-${variant}`);

            if (attrs.lumxHasBackground && attrs.lumxEmphasis === 'low') {
                el.removeClass((index, className) => {
                    return (className.match(/(?:\S|-)*button-wrapper--variant-\S+/g) || []).join(' ');
                }).addClass(`${CSS_PREFIX}-button-wrapper--variant-${variant}`);
            }
        });

        scope.$watch(attrs.lumxIsSelected, (isSelected) => {
            if (isSelected) {
                buttonEl.addClass(`${CSS_PREFIX}-button--is-selected`);
            } else {
                buttonEl.removeClass(`${CSS_PREFIX}-button--is-selected`);
            }
        });
    }

    return {
        link,
        replace: true,
        restrict: 'E',
        template: getTemplate,
        transclude: true,
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.button`).directive(`${COMPONENT_PREFIX}Button`, ButtonDirective);

/////////////////////////////

export { ButtonDirective };
