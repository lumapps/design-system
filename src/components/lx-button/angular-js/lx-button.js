import '../style/lx-button.scss';

/////////////////////////////

function lxButtonDirective(LxThemeConstant) {
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
        const defaultProps = {
            color: 'primary',
            size: 'm',
            theme: 'light',
            type: 'primary',
        };

        let buttonClass = 'lx-button';

        if (!attrs.lxColor && (attrs.lxType === 'primary' || !attrs.lxType)) {
            buttonClass += ` lx-button--color-${defaultProps.color}`;
        }

        if (!attrs.lxSize) {
            buttonClass += ` lx-button--size-${defaultProps.size}`;
        }

        if (!attrs.lxTheme) {
            buttonClass += ` lx-button--theme-${defaultProps.theme}`;
        }

        if (!attrs.lxType) {
            buttonClass += ` lx-button--type-${defaultProps.type}`;
        }

        if (isAnchor(attrs)) {
            return `<a class="${buttonClass}" ng-transclude></a>`;
        }

        return `<button class="${buttonClass}" ng-transclude></button>`;
    }

    function link(scope, el, attrs) {
        const transcludedIcon = el.find('i');
        const tanscludedText = el.find('span');

        if (transcludedIcon.length > 0 && !tanscludedText.length > 0) {
            el.addClass('lx-button--shape-circled');
        } else {
            el.addClass('lx-button--shape-contained');
        }

        if (transcludedIcon.length === 0 && tanscludedText.length === 0) {
            el.wrapInner('<span class="lx-button__text"></span>');
        }

        if (transcludedIcon.length > 0) {
            transcludedIcon.addClass('lx-button__icon');
        }

        if (transcludedIcon.length > 0 && tanscludedText.length > 0) {
            transcludedIcon.addClass('lx-button__icon--has-sibling');
        }

        if (tanscludedText.length > 0) {
            tanscludedText.addClass('lx-button__text');
        }

        attrs.$observe('lxColor', (color) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-button--color-\S+/g) || []).join(' ');
            });

            if (LxThemeConstant.includes(color)) {
                el.addClass(`lx-button--color-${color}`);
            } else {
                el.addClass('lx-button--color-custom');
            }
        });

        attrs.$observe('lxSize', (size) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-button--size-\S+/g) || []).join(' ');
            }).addClass(`lx-button--size-${size}`);
        });

        attrs.$observe('lxTheme', (theme) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-button--theme-\S+/g) || []).join(' ');
            }).addClass(`lx-button--theme-${theme}`);
        });

        attrs.$observe('lxType', (type) => {
            el.removeClass((index, className) => {
                return (className.match(/(^|\s)lx-button--type-\S+/g) || []).join(' ');
            }).addClass(`lx-button--type-${type}`);
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

angular.module('lumx.button').directive('lxButton', lxButtonDirective);

/////////////////////////////

export { lxButtonDirective };
