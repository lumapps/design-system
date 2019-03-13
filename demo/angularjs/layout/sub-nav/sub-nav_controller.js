import upperFirst from 'lodash/upperFirst';

import { changeTheme as _changeTheme } from '../../../utils';

/////////////////////////////

function SubNavController(Theme, Themes) {
    'ngInject';

    const vm = this;

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
    vm.THEMES = [];

    /**
     * The currently selected theme.
     *
     * @type {string}
     */
    vm.selectedTheme = undefined;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Change the theme in the UI.
     */
    function switchTheme() {
        Theme.theme = vm.themeObjectToTheme(vm.selectedTheme);
        _changeTheme(Theme.theme);
    }

    /**
     * Convert a theme object to the theme value.
     *
     * @param  {Object} themeObject The theme object.
     * @return {string} The theme value.
     */
    function themeObjectToTheme({ theme }) {
        return theme;
    }

    /**
     * Convert the theme value to the theme object usable in the LxSelect.
     *
     * @param  {string} theme The theme to convert.
     * @return {Object} The theme object for the LxSelect.
     */
    function themeToThemeObject(theme) {
        return {
            label: theme === 'lumapps' ? 'LumApps' : upperFirst(theme),
            theme,
        };
    }

    /////////////////////////////

    vm.switchTheme = switchTheme;
    vm.themeObjectToTheme = themeObjectToTheme;
    vm.themeToThemeObject = themeToThemeObject;

    /////////////////////////////

    /**
     * Initialize the controller.
     */
    function init() {
        vm.THEMES = Themes.map(vm.themeToThemeObject);
        vm.selectedTheme = vm.themeToThemeObject(Theme.theme);
    }

    init();
}

/////////////////////////////

angular.module('design-system').controller('SubNavController', SubNavController);

/////////////////////////////

export { SubNavController };
