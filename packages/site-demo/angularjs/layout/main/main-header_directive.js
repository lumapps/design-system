import { mdiReact } from '@lumx/icons';

import { changeTheme as _changeTheme } from '../../../utils';

import template from './main-header.html';

/////////////////////////////

function mainHeaderController(Theme) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const mainHeader = this;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * The available themes.
     *
     * @type {Array<Object>}
     * @constant
     */
    mainHeader.THEMES = [];

    /**
     * The main header icons.
     *
     * @type {Object}
     */
    mainHeader.icons = {
        mdiReact,
    };

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Whether the theme is active or not.
     *
     * @param  {Object}  theme The theme object.
     * @return {boolean} Whether the theme is active or not.
     */
    function isThemeActive(theme) {
        return Theme.theme === theme;
    }

    /**
     * Set active theme to given theme.
     *
     * @param {Object} theme The theme object.
     */
    function setTheme(theme) {
        Theme.theme = theme;
        _changeTheme(Theme.theme);
    }

    /////////////////////////////

    mainHeader.isThemeActive = isThemeActive;
    mainHeader.setTheme = setTheme;
}

/////////////////////////////

function mainHeaderDirective() {
    'ngInject';

    return {
        bindToController: true,
        controller: mainHeaderController,
        controllerAs: 'mainHeader',
        replace: true,
        restrict: 'E',
        scope: {
            category: '@',
        },
        template,
    };
}

/////////////////////////////

angular.module('design-system').directive('mainHeader', mainHeaderDirective);

/////////////////////////////

export { mainHeaderDirective };
