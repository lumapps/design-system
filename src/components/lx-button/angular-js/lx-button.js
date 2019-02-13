import '../style/lx-button.scss';

/////////////////////////////

function lxButtonDirective(LxThemeConstant) {
    /**
     * Wether the button needs to be converted to a link or not.
     *
     * @param  {Object}  attrs The directive attributes.
     * @return {boolean} Wether the button is an anchor or not.
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
        const buttonType = angular.isDefined(attrs.lxType) ? attrs.lxType : 'primary';
        const buttonColor = angular.isDefined(attrs.lxColor) ? attrs.lxColor : 'primary';
        const buttonSize = angular.isDefined(attrs.lxSize) ? attrs.lxSize : 'm';
        const buttonTheme = angular.isDefined(attrs.lxTheme) ? attrs.lxTheme : 'light';
        let buttonClass = `lx-button lx-button--type-${buttonType} lx-button--size-${buttonSize} lx-button--theme-${buttonTheme}`;

        if (LxThemeConstant.includes(buttonColor)) {
            buttonClass += ` lx-button--color-${buttonColor}`;
        } else {
            buttonClass += ' lx-button--color-custom';
        }

        if (isAnchor(attrs)) {
            return `<a class="${buttonClass}" ng-transclude></a>`;
        }

        return `<button class="${buttonClass}" ng-transclude></button>`;
    }

    function link(scope, el) {
        const transcludedIcon = el.find('i');
        const tanscludedText = el.find('span');

        if (transcludedIcon.length > 0 && !tanscludedText.length > 0) {
            el.addClass('lx-button--shape-circled');
        } else {
            el.addClass('lx-button--shape-contained');
        }

        if (!transcludedIcon.length > 0 && !tanscludedText.length > 0) {
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
