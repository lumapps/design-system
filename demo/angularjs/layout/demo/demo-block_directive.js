import { mdiCodeTags } from 'LumX/icons';

import template from './demo-block.html';

/////////////////////////////

function demoBlockController() {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const demoBlock = this;

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
    demoBlock.hasDarkTheme = false;

    /**
     * Wheter the block has a description or not.
     *
     * @type {boolean}
     */
    demoBlock.hasDescription = false;

    /**
     * Wheter the block displays a theme switcher or not.
     *
     * @type {boolean}
     */
    demoBlock.hasThemeSwitcher = true;

    /**
     * The main block icons.
     *
     * @type {Object}
     */
    demoBlock.icons = {
        mdiCodeTags,
    };

    /**
     * Wheter the code view is open or not.
     *
     * @type {boolean}
     */
    demoBlock.isCodeOpen = false;

    /**
     * The component theme.
     *
     * @type {string}
     */
    demoBlock.theme = 'light';

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Toggle code visibility.
     */
    function toggleCode() {
        demoBlock.isCodeOpen = !demoBlock.isCodeOpen;
    }

    /**
     * Toggle component theme from light to dark and so on.
     */
    function toggleTheme() {
        if (demoBlock.hasDarkTheme) {
            demoBlock.theme = 'dark';
        } else {
            demoBlock.theme = 'light';
        }
    }

    /////////////////////////////

    demoBlock.toggleCode = toggleCode;
    demoBlock.toggleTheme = toggleTheme;
}

/////////////////////////////

function demoBlockDirective() {
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
        controller: demoBlockController,
        controllerAs: 'demoBlock',
        link,
        replace: true,
        restrict: 'E',
        scope: true,
        template,
        transclude: true,
    };
}

/////////////////////////////

angular.module('design-system').directive('demoBlock', demoBlockDirective);

/////////////////////////////

export { demoBlockDirective };
