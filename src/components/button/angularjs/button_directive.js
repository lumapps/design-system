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
        const isDefaultEmphasis = !attrs.lxEmphasis || attrs.lxEmphasis === 'high';

        const defaultProps = {
            color: isDefaultEmphasis ? 'primary' : 'dark',
            emphasis: 'high',
            size: 'm',
            theme: 'light',
            variant: 'button',
        };

        let buttonClass = `${COMPONENT_PREFIX}-button`;

        if (!attrs.lxColor) {
            buttonClass += ` ${COMPONENT_PREFIX}-button--color-${defaultProps.color}`;
        }

        if (!attrs.lxEmphasis) {
            buttonClass += ` ${COMPONENT_PREFIX}-button--emphasis-${defaultProps.emphasis}`;
        }

        if (!attrs.lxSize) {
            buttonClass += ` ${COMPONENT_PREFIX}-button--size-${defaultProps.size}`;
        }

        if (!attrs.lxTheme && isDefaultEmphasis) {
            buttonClass += ` ${COMPONENT_PREFIX}-button--theme-${defaultProps.theme}`;
        }

        if (!attrs.lxVariant) {
            buttonClass += ` ${COMPONENT_PREFIX}-button--variant-${defaultProps.variant}`;
        }

        if (isAnchor(attrs)) {
            return `<a class="${buttonClass}" ng-transclude></a>`;
        }

        return `<button class="${buttonClass}" ng-transclude></button>`;
    }

    function link(scope, el, attrs) {
        if (!attrs.lxVariant || attrs.lxVariant === 'button') {
            const leftIcon = el.find('i:first-child');
            const rightIcon = el.find('i:last-child');
            const label = el.find('span');

            if (leftIcon.length > 0) {
                el.addClass(`${COMPONENT_PREFIX}-button--has-left-icon`);
            }

            if (rightIcon.length > 0) {
                el.addClass(`${COMPONENT_PREFIX}-button--has-right-icon`);
            }

            if (label.length === 0) {
                el.wrapInner('<span></span>');
            }
        }

        attrs.$observe('lxColor', (color) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)button--color-\S+/g) || []).join(' ');
            }).addClass(`${COMPONENT_PREFIX}-button--color-${color}`);
        });

        attrs.$observe('lxEmphasis', (emphasis) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)button--emphasis-\S+/g) || []).join(' ');
            }).addClass(`${COMPONENT_PREFIX}-button--emphasis-${emphasis}`);
        });

        attrs.$observe('lxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)button--size-\S+/g) || []).join(' ');
            }).addClass(`${COMPONENT_PREFIX}-button--size-${size}`);
        });

        attrs.$observe('lxTheme', (theme) => {
            if (!attrs.lxEmphasis || attrs.lxEmphasis === 'high') {
                el.removeClass((index, className) => {
                    return (className.match(/(^|\s)button--theme-\S+/g) || []).join(' ');
                }).addClass(`${COMPONENT_PREFIX}-button--theme-${theme}`);
            }
        });

        attrs.$observe('lxVariant', (variant) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)button--variant-\S+/g) || []).join(' ');
            }).addClass(`${COMPONENT_PREFIX}-button--variant-${variant}`);
        });

        scope.$watch(attrs.lxIsSelected, (isSelected) => {
            if (isSelected) {
                el.addClass(`${COMPONENT_PREFIX}-button--is-selected`);
            } else {
                el.removeClass(`${COMPONENT_PREFIX}-button--is-selected`);
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
