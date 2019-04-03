import { mdiCodeTags } from 'LumX/icons';

import template from './main-block.html';

/////////////////////////////

function mainBlockController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const mainBlock = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Wether to display the component in dark theme or not.
     *
     * @type {boolean}
     */
    mainBlock.hasDarkTheme = false;

    /**
     * Wheter the block has a description or not.
     *
     * @type {boolean}
     */
    mainBlock.hasDescription = false;

    /**
     * Wheter the block displays a theme switcher or not.
     *
     * @type {boolean}
     */
    mainBlock.hasThemeSwitcher = true;

    /**
     * The main block icons.
     *
     * @type {Object}
     */
    mainBlock.icons = {
        mdiCodeTags,
    };

    /**
     * Wheter the code view is open or not.
     *
     * @type {boolean}
     */
    mainBlock.isCodeOpen = false;

    /**
     * The component theme.
     *
     * @type {string}
     */
    mainBlock.theme = 'light';

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Toggle code visibility.
     */
    function toggleCode() {
        mainBlock.isCodeOpen = !mainBlock.isCodeOpen;
    }

    /**
     * Toggle component theme from light to dark and so on.
     */
    function toggleTheme() {
        if (mainBlock.hasDarkTheme) {
            mainBlock.theme = 'dark';
        } else {
            mainBlock.theme = 'light';
        }
    }

    /////////////////////////////

    mainBlock.toggleCode = toggleCode;
    mainBlock.toggleTheme = toggleTheme;
}

/////////////////////////////

function mainBlockDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrl, transclude) {
        transclude((clone) => {
            if (clone.length > 0) {
                ctrl.hasDescription = true;
            }
        });

        attrs.$observe('jsPath', (jsPath) => {
            ctrl.jsPath = jsPath;
        });

        attrs.$observe('language', (language) => {
            ctrl.language = language;
        });

        attrs.$observe('path', (path) => {
            ctrl.path = path;
        });

        attrs.$observe('hasThemeSwitcher', (hasThemeSwitcher) => {
            ctrl.hasThemeSwitcher = scope.$eval(hasThemeSwitcher);
        });

        attrs.$observe('title', (title) => {
            ctrl.title = title;
        });
    }

    return {
        bindToController: true,
        controller: mainBlockController,
        controllerAs: 'mainBlock',
        link,
        replace: true,
        restrict: 'E',
        scope: true,
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('design-system').directive('mainBlock', mainBlockDirective);

/////////////////////////////

export { mainBlockDirective };
