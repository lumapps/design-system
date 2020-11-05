import { CSS_PREFIX } from './constants';

interface ColorPalette {
    primary: {
        D2: string;
        D1: string;
        N: string;
        L1: string;
        L2: string;
        L3: string;
        L4: string;
        L5: string;
        L6: string;
    };
    secondary: {
        D2: string;
        D1: string;
        N: string;
        L1: string;
        L2: string;
        L3: string;
        L4: string;
        L5: string;
        L6: string;
    };
}

/**
 * Add a css rule in a given sheet.
 *
 * @param sheet    The sheet to insert the new rules in.
 * @param selector The css rules selector.
 * @param rules    The css rules.
 * @param index    The css rule index.
 */
function _addCSSRule(sheet: CSSStyleSheet, selector: string, rules: string, index: number) {
    if ('insertRule' in sheet) {
        sheet.insertRule(`${selector}{${rules}}`, index);
    } else if ('addRule' in sheet) {
        (sheet as any).addRule(selector, rules, index);
    }
}

/**
 * Get button css rules impacted by primary and secondary colors.
 *
 * @param  colorPalette The custom color palette.
 * @param  color        Whether to return primary or secondary variants.
 * @return The button css rules.
 */
function _getButtonCSSRules(colorPalette: ColorPalette, color: keyof ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-high.${CSS_PREFIX}-button--theme-light
            `,
            rule: `background-color: ${colorPalette[color].N}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-medium
            `,
            rule: `background-color: ${colorPalette[color].L5}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-high.${CSS_PREFIX}-button--theme-dark,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-medium,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-low
            `,
            rule: `color: ${colorPalette[color].N}`,
        },
        // Hover state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-high.${CSS_PREFIX}-button--theme-light:hover
            `,
            rule: `background-color: ${colorPalette[color].D1}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-medium:hover,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-low:hover
            `,
            rule: `background-color: ${colorPalette[color].L4}`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-high.${CSS_PREFIX}-button--theme-light:active
            `,
            rule: `background-color: ${colorPalette[color].D2}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-medium:active,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-low:active
            `,
            rule: `background-color: ${colorPalette[color].L3}`,
        },
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-high.${CSS_PREFIX}-button--theme-light[data-focus-visible-added],
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-medium[data-focus-visible-added],
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--color-${color}.${CSS_PREFIX}-button--emphasis-low[data-focus-visible-added]
            `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette[color].L3}`,
        },
    ];
}

/**
 * Get selected button css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The selected button css rules.
 */
function _getButtonSelectedCSSRules(colorPalette: ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--is-selected.${CSS_PREFIX}-button--color-dark
            `,
            rule: `background-color: ${colorPalette.primary.L4}; color: ${colorPalette.primary.D2};`,
        },
        // Hover state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--is-selected.${CSS_PREFIX}-button--color-dark:hover
            `,
            rule: `background-color: ${colorPalette.primary.L3}`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--is-selected.${CSS_PREFIX}-button--color-dark:active
            `,
            rule: `background-color: ${colorPalette.primary.L2}`,
        },
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-button--is-selected.${CSS_PREFIX}-button--color-dark[data-focus-visible-added]
            `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette.primary.L3}`,
        },
    ];
}

/**
 * Get checkbox css rules impacted by primary or secondary colors.
 *
 * @param  colorPalette The custom color palette.
 * @param  color        Whether to return primary or secondary variants.
 * @return The checkbox css rules.
 */
function _getCheckboxCSSRules(colorPalette: ColorPalette, color: keyof ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-checkbox--theme-light .${CSS_PREFIX}-checkbox__input-indicator
            `,
            rule: `background-color: ${colorPalette[color].N}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-checkbox--theme-dark .${CSS_PREFIX}-checkbox__input-indicator
            `,
            rule: `color: ${colorPalette[color].N}`,
        },
        // Hover state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-checkbox--theme-light.${CSS_PREFIX}-checkbox--is-checked
                .${CSS_PREFIX}-checkbox__input-native:hover
                + .${CSS_PREFIX}-checkbox__input-placeholder .${CSS_PREFIX}-checkbox__input-indicator
            `,
            rule: `background-color: ${colorPalette[color].D1}`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-checkbox--theme-light.${CSS_PREFIX}-checkbox--is-checked
                .${CSS_PREFIX}-checkbox__input-native:active
                + .${CSS_PREFIX}-checkbox__input-placeholder .${CSS_PREFIX}-checkbox__input-indicator
            `,
            rule: `background-color: ${colorPalette[color].D2}`,
        },
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-checkbox--theme-light.${CSS_PREFIX}-checkbox--is-checked
                .${CSS_PREFIX}-checkbox__input-native[data-focus-visible-added]
                + .${CSS_PREFIX}-checkbox__input-placeholder
            `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette[color].L3}`,
        },
    ];
}

/**
 * Get chip css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The chip css rules.
 */
function _getChipCSSRules(colorPalette: ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-chip--is-selected.${CSS_PREFIX}-chip--color-dark
            `,
            rule: `background-color: ${colorPalette.primary.L4}; color: ${colorPalette.primary.D2};`,
        },
        // Hover state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-chip--is-selected.${CSS_PREFIX}-chip--color-dark:hover
            `,
            rule: `background-color: ${colorPalette.primary.L3}`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-chip--is-selected.${CSS_PREFIX}-chip--color-dark:active
            `,
            rule: `background-color: ${colorPalette.primary.L2}`,
        },
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-chip--is-selected.${CSS_PREFIX}-chip--color-dark[data-focus-visible-added]
            `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette.primary.L3}`,
        },
    ];
}

/**
 * Get list css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The list css rules.
 */
function _getListCSSRules(colorPalette: ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-list .${CSS_PREFIX}-list-item--is-selected
            `,
            rule: `background-color: ${colorPalette.primary.L4}; color: ${colorPalette.primary.D2};`,
        },
        // Hover & focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-list .${CSS_PREFIX}-list-item--is-selected:hover,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-list .${CSS_PREFIX}-list-item--is-selected[data-focus-visible-added]
            `,
            rule: `background-color: ${colorPalette.primary.L3} !important`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-list .${CSS_PREFIX}-list-item--is-selected:active
            `,
            rule: `background-color: ${colorPalette.primary.L2} !important`,
        },
    ];
}

/**
 * Get progress css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The progress css rules.
 */
function _getProgressCSSRules(colorPalette: ColorPalette) {
    return [
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-progress--theme-light .${CSS_PREFIX}-progress-circular__double-bounce1,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-progress--theme-light .${CSS_PREFIX}-progress-circular__double-bounce2,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-progress--theme-light .${CSS_PREFIX}-progress-linear__line1,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-progress--theme-light .${CSS_PREFIX}-progress-linear__line2
            `,
            rule: `background-color: ${colorPalette.primary.L3}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-progress--theme-light .${CSS_PREFIX}-progress-circular__path
            `,
            rule: `stroke: ${colorPalette.primary.N}`,
        },
    ];
}

/**
 * Get radio button css rules impacted by primary or secondary colors.
 *
 * @param  colorPalette The custom color palette.
 * @param  color        Whether to return primary or secondary variants.
 * @return The radio button css rules.
 */
function _getRadioButtonCSSRules(colorPalette: ColorPalette, color: keyof ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-radio-button--theme-light.${CSS_PREFIX}-radio-button--is-checked .${CSS_PREFIX}-radio-button__input-background
            `,
            rule: `color: ${colorPalette[color].N}`,
        },
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-radio-button--theme-light.${CSS_PREFIX}-radio-button--is-unchecked .${CSS_PREFIX}-radio-button__input-indicator,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-radio-button--theme-light.${CSS_PREFIX}-radio-button--is-checked .${CSS_PREFIX}-radio-button__input-indicator
            `,
            rule: `background-color: ${colorPalette[color].N}`,
        },
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-radio-button--theme-light.${CSS_PREFIX}-radio-button--is-checked
                .${CSS_PREFIX}-radio-button__input-native[data-focus-visible-added]
                + .${CSS_PREFIX}-radio-button__input-placeholder
            `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette[color].L3}`,
        },
    ];
}

/**
 * Get select css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The select css rules.
 */
function _getSelectCSSRules(colorPalette: ColorPalette) {
    return [
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-select--theme-light.${CSS_PREFIX}-select--is-open:not(.${CSS_PREFIX}-select--has-error):not(.${CSS_PREFIX}-select--is-valid) .${CSS_PREFIX}-select__wrapper,
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-select--theme-light:not(.${CSS_PREFIX}-select--has-error):not(.${CSS_PREFIX}-select--is-valid) .${CSS_PREFIX}-select__wrapper:focus
                `,
            rule: `box-shadow: inset 0 0 0 2px ${colorPalette.primary.L2}`,
        },
    ];
}

/**
 * Get side navigation css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The side navigation css rules.
 */
function _getSideNavigationCSSRules(colorPalette: ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-side-navigation .${CSS_PREFIX}-side-navigation-item--is-selected .${CSS_PREFIX}-side-navigation-item__link
            `,
            rule: `background-color: ${colorPalette.primary.L4}; color: ${colorPalette.primary.D2};`,
        },
        // Hover & focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-side-navigation .${CSS_PREFIX}-side-navigation-item--is-selected .${CSS_PREFIX}-side-navigation-item__link:hover,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-side-navigation .${CSS_PREFIX}-side-navigation-item--is-selected .${CSS_PREFIX}-side-navigation-item__link[data-focus-visible-added]
            `,
            rule: `background-color: ${colorPalette.primary.L3} !important`,
        },
        // Active state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-side-navigation .${CSS_PREFIX}-side-navigation-item--is-selected .${CSS_PREFIX}-side-navigation-item__link:active
            `,
            rule: `background-color: ${colorPalette.primary.L2} !important`,
        },
    ];
}

/**
 * Get slideshow controls css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The slideshow controls css rules.
 */
function _getSlideshowControlsCSSRules(colorPalette: ColorPalette) {
    return [
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-slideshow-controls--theme-light .${CSS_PREFIX}-slideshow-controls__pagination-item:hover,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-slideshow-controls--theme-light .${CSS_PREFIX}-slideshow-controls__pagination-item--is-active
            `,
            rule: `background-color: ${colorPalette.primary.N}`,
        },
    ];
}

/**
 * Get switch css rules impacted by primary or secondary colors.
 *
 * @param  colorPalette The custom color palette.
 * @return The switch css rules.
 */
function _getSwitchCSSRules(colorPalette: ColorPalette) {
    return [
        // Default state.
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-light.${CSS_PREFIX}-switch--is-checked .${CSS_PREFIX}-switch__input-background,
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-dark.${CSS_PREFIX}-switch--is-checked .${CSS_PREFIX}-switch__input-indicator
                `,
            rule: `background-color: ${colorPalette.primary.N}`,
        },
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-dark.${CSS_PREFIX}-switch--is-checked .${CSS_PREFIX}-switch__input-background
                `,
            rule: `color: ${colorPalette.primary.N}`,
        },
        // Hover state.
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-light.${CSS_PREFIX}-switch--is-checked
                    .${CSS_PREFIX}-switch__input-native:hover
                    + .${CSS_PREFIX}-switch__input-placeholder .${CSS_PREFIX}-switch__input-background
                `,
            rule: `background-color: ${colorPalette.primary.D1}`,
        },
        // Active state.
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-light.${CSS_PREFIX}-switch--is-checked
                    .${CSS_PREFIX}-switch__input-native:active
                    + .${CSS_PREFIX}-switch__input-placeholder .${CSS_PREFIX}-switch__input-background
                `,
            rule: `background-color: ${colorPalette.primary.D2}`,
        },
        // Focus state.
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-switch--theme-light.${CSS_PREFIX}-switch--is-checked
                    .${CSS_PREFIX}-switch__input-native[data-focus-visible-added]
                    + .${CSS_PREFIX}-switch__input-placeholder
                `,
            rule: `box-shadow: 0 0 0 2px ${colorPalette.primary.L3}`,
        },
    ];
}

/**
 * Get tabs css rules impacted by primary or secondary colors.
 *
 * @param  colorPalette The custom color palette.
 * @return The tabs css rules.
 */
function _getTabsCSSRules(colorPalette: ColorPalette) {
    return [
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-tabs--theme-light .${CSS_PREFIX}-tabs__link--is-active::after
            `,
            rule: `background-color: ${colorPalette.primary.N}`,
        },
    ];
}

/**
 * Get text field css rules impacted by primary color.
 *
 * @param  colorPalette The custom color palette.
 * @return The text field css rules.
 */
function _getTextFieldCSSRules(colorPalette: ColorPalette) {
    return [
        {
            selector: `
                    .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-text-field--theme-light.${CSS_PREFIX}-text-field--is-focus:not(.${CSS_PREFIX}-text-field--has-error):not(.${CSS_PREFIX}-text-field--is-valid) .${CSS_PREFIX}-text-field__wrapper
                `,
            rule: `box-shadow: inset 0 0 0 2px ${colorPalette.primary.L2}`,
        },
    ];
}

/**
 * Set primary and secondary custom colors.
 *
 * @param sheet        The sheet to insert the custom rules in.
 * @param colorPalette The custom color palette.
 */
function setCustomColors(sheet: CSSStyleSheet, colorPalette: ColorPalette) {
    let index = 0;

    const buttonRules = [
        ..._getButtonCSSRules(colorPalette, 'primary'),
        ..._getButtonCSSRules(colorPalette, 'secondary'),
        ..._getButtonSelectedCSSRules(colorPalette),
    ];

    buttonRules.forEach((buttonRule) => {
        _addCSSRule(sheet, buttonRule.selector, buttonRule.rule, index);
        index++;
    });

    let checkboxRules;
    checkboxRules = _getCheckboxCSSRules(colorPalette, 'primary');

    checkboxRules?.forEach((checkboxRule) => {
        _addCSSRule(sheet, checkboxRule.selector, checkboxRule.rule, index);
        index++;
    });

    const chipRules = _getChipCSSRules(colorPalette);

    chipRules.forEach((chipRule) => {
        _addCSSRule(sheet, chipRule.selector, chipRule.rule, index);
        index++;
    });

    const listRules = _getListCSSRules(colorPalette);

    listRules.forEach((listRule) => {
        _addCSSRule(sheet, listRule.selector, listRule.rule, index);
        index++;
    });

    const progressRules = _getProgressCSSRules(colorPalette);

    progressRules.forEach((progressRule) => {
        _addCSSRule(sheet, progressRule.selector, progressRule.rule, index);
        index++;
    });

    let radioButtonRules;
    radioButtonRules = _getRadioButtonCSSRules(colorPalette, 'primary');

    radioButtonRules?.forEach((radioButtonRule) => {
        _addCSSRule(sheet, radioButtonRule.selector, radioButtonRule.rule, index);
        index++;
    });

    const selectRules = _getSelectCSSRules(colorPalette);

    selectRules?.forEach((selectRule) => {
        _addCSSRule(sheet, selectRule.selector, selectRule.rule, index);
        index++;
    });

    const sideNavigationRules = _getSideNavigationCSSRules(colorPalette);

    sideNavigationRules.forEach((sideNavigationRule) => {
        _addCSSRule(sheet, sideNavigationRule.selector, sideNavigationRule.rule, index);
        index++;
    });

    const slideshowControlsRules = _getSlideshowControlsCSSRules(colorPalette);

    slideshowControlsRules.forEach((slideshowControlsRule) => {
        _addCSSRule(sheet, slideshowControlsRule.selector, slideshowControlsRule.rule, index);
        index++;
    });

    const switchRules = _getSwitchCSSRules(colorPalette);

    switchRules?.forEach((switchRule) => {
        _addCSSRule(sheet, switchRule.selector, switchRule.rule, index);
        index++;
    });

    const tabsRules = _getTabsCSSRules(colorPalette);

    tabsRules.forEach((tabsRule) => {
        _addCSSRule(sheet, tabsRule.selector, tabsRule.rule, index);
        index++;
    });

    const textFieldRules = _getTextFieldCSSRules(colorPalette);

    textFieldRules?.forEach((textFieldRule) => {
        _addCSSRule(sheet, textFieldRule.selector, textFieldRule.rule, index);
        index++;
    });
}

export { setCustomColors };
