// eslint-disable-next-line import/no-extraneous-dependencies
import classNames from 'classnames';

import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import kebabCase from 'lodash/kebabCase';
import { noop } from 'lodash/noop';

import { CSS_PREFIX, ESCAPE_KEY_CODE } from './constants';

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Add a css rule in a given sheet.
 *
 * @param {Element} sheet    The sheet to insert the new rules in.
 * @param {string}  selector The css rules selector.
 * @param {string}  rules    The css rules.
 * @param {number}  index    The css rule index.
 */
function _addCSSRule(sheet, selector, rules, index) {
    if ('insertRule' in sheet) {
        sheet.insertRule(`${selector}{${rules}}`, index);
    } else if ('addRule' in sheet) {
        sheet.addRule(selector, rules, index);
    }
}

/**
 * Get button css rules impacted by primary and secondary colors.
 *
 * @param  {Object} colorPalette The custom color palette.
 * @param  {string} color        Whether to return primary or secondary variants.
 * @return {Array}  The button css rules.
 */
function _getButtonCSSRules(colorPalette, color) {
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
 * @param  {Object} colorPalette The custom color palette.
 * @return {Array}  The selected button css rules.
 */
function _getButtonSelectedCSSRules(colorPalette) {
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
 * @param  {Object} colorPalette The custom color palette.
 * @param  {string} color        Whether to return primary or secondary variants.
 * @return {Array}  The checkbox css rules.
 */
function _getCheckboxCSSRules(colorPalette, color) {
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
 * Get selected chip css rules impacted by primary color.
 *
 * @param  {Object} colorPalette The custom color palette.
 * @return {Array}  The selected chip css rules.
 */
function _getChipSelectedCSSRules(colorPalette) {
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
 * Get progress css rules impacted by primary color.
 *
 * @param  {Object} colorPalette The custom color palette.
 * @return {Array}  The progress css rules.
 */
function _getProgressCSSRules(colorPalette) {
    return [
        {
            selector: `
                .${CSS_PREFIX}-custom-colors .${CSS_PREFIX}-progress-circular__double-bounce1,
                .${CSS_PREFIX}-custom-colors .${CSS_PREFIX}-progress-circular__double-bounce2,
                .${CSS_PREFIX}-custom-colors .${CSS_PREFIX}-progress-linear__line1,
                .${CSS_PREFIX}-custom-colors .${CSS_PREFIX}-progress-linear__line2
            `,
            rule: `background-color: ${colorPalette.primary.L3}`,
        },
    ];
}

/**
 * Get radio button css rules impacted by primary or secondary colors.
 *
 * @param  {Object} colorPalette The custom color palette.
 * @param  {string} color        Whether to return primary or secondary variants.
 * @return {Array}  The radio button css rules.
 */
function _getRadioButtonCSSRules(colorPalette, color) {
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
 * @param  {Object} colorPalette The custom color palette.
 * @return {Array}  The select css rules.
 */
function _getSelectCSSRules(colorPalette) {
    return [
        // Focus state.
        {
            selector: `
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-select--theme-light.${CSS_PREFIX}-select--is-open .${CSS_PREFIX}-select__input-wrapper,
                .${CSS_PREFIX}-custom-colors.${CSS_PREFIX}-select--theme-light .${CSS_PREFIX}-select__input-wrapper:focus
            `,
            rule: `box-shadow: inset 0 0 0 2px ${colorPalette.primary.L2}`,
        },
    ];
}

/**
 * Enhance isEmpty method to also works with numbers.
 *
 * @param  {any}     value The value to check.
 * @return {boolean} Weither if the input value is empty or != 0.
 */
const _isEmpty = (value) => {
    if (typeof value === 'number') {
        return value === 0;
    }

    return isEmpty(value);
};

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Get the basic CSS class for the given type.
 *
 * @param  {string}         prefix The class name prefix for the generated CSS class.
 * @param  {string}         type   The type of CSS class we want to generate (e.g.: 'color', 'variant', ...).
 * @param  {string|boolean} value  The value of the type of the CSS class (e.g.: 'primary', 'button', ...).
 * @return {string}         The basic CSS class.
 */
function getBasicClass({ prefix, type, value }) {
    if (isBoolean(value)) {
        if (!value) {
            // False value should not return a class.
            return '';
        }
        const booleanPrefixes = ['has', 'is'];

        if (booleanPrefixes.some((booleanPrefix) => type.toString().startsWith(booleanPrefix))) {
            return `${prefix}--${kebabCase(type)}`;
        }

        return `${prefix}--is-${kebabCase(type)}`;
    }

    return `${prefix}--${kebabCase(type)}-${value}`;
}

/**
 * Return all basic LumX CSS classes which are available for every components.
 *
 * @see {@link /src/components/index.d.ts} for the possible values of each parameter.
 *
 * @param  {string} prefix The class name prefix for the generated CSS class.
 * @param  {Object} props  All the other props you want to generate a class.
 *                         The rule of thumb: the key is the name of the prop in the class, the value a string that will
 *                         be used in the classname to represent the value of the given prop.
 * @return {string} All LumX basic CSS classes.
 */
function handleBasicClasses({ prefix, ...props }) {
    const otherClasses = {};
    if (!isEmpty(props)) {
        Object.keys(props).forEach((prop) => {
            otherClasses[getBasicClass({ prefix, type: prop, value: props[prop] })] = isBoolean(props[prop])
                ? props[prop]
                : !_isEmpty(props[prop]);
        });
    }

    return classNames(prefix, otherClasses);
}

/**
 * Detects swipe direction.
 * Credits: http://javascriptkit.com/javatutors/touchevents2.shtml.
 *
 * @param  {Element}  el Element that will hold touch events.
 * @param  {Function} cb Callback function.
 * @return {Function} Function to remove listeners.
 */
function detectSwipe(el, cb = noop) {
    const touchsurface = el;
    let distX, distY, startX, startY, swipedir;
    // Required min distance traveled to be considered swipe.
    const threshold = 150;
    // Maximum distance allowed at the same time in perpendicular direction.
    const restraint = 100;
    // Maximum time allowed to travel that distance.
    const allowedTime = 300;
    let elapsedTime, startTime;
    const handleswipe = cb;

    const onTouchStart = (evt) => {
        const [touchobj] = evt.changedTouches;
        swipedir = 'none';
        // Const dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        // Record time when finger first makes contact with surface.
        startTime = new Date().getTime();
        evt.preventDefault();
    };

    const onTouchMove = (evt) => {
        // Prevent scrolling when inside DIV.
        evt.preventDefault();
    };

    const onTouchEnd = (evt) => {
        const [touchobj] = evt.changedTouches;
        // Get horizontal dist traveled by finger while in contact with surface.
        distX = touchobj.pageX - startX;
        // Get vertical dist traveled by finger while in contact with surface.
        distY = touchobj.pageY - startY;
        // Get time elapsed.
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime) {
            // First condition for awipe met.
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                // 2nd condition for horizontal swipe met.
                // If dist traveled is negative, it indicates left swipe.
                swipedir = distX < 0 ? 'left' : 'right';
            } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                // 2nd condition for vertical swipe met.
                // If dist traveled is negative, it indicates up swipe.
                swipedir = distY < 0 ? 'up' : 'down';
            }
        }
        handleswipe(swipedir);
        evt.preventDefault();
    };

    touchsurface.addEventListener('touchstart', onTouchStart, false);
    touchsurface.addEventListener('touchmove', onTouchMove, false);
    touchsurface.addEventListener('touchend', onTouchEnd, false);

    return () => {
        touchsurface.removeEventListener('touchstart', onTouchStart, false);
        touchsurface.removeEventListener('touchmove', onTouchMove, false);
        touchsurface.removeEventListener('touchend', onTouchEnd, false);
    };
}

/**
 * Make sure the pressed key is the enter key before calling the callback.
 *
 * @param  {Function} cb The callback to call on enter/return press.
 * @return {Function} The decorated function.
 */
function onEnterPressed(cb) {
    return (evt) => {
        if (evt.key !== 'Enter') {
            return;
        }

        cb();
    };
}

/**
 * Make sure the pressed key is the escape key before calling the callback.
 *
 * @param  {Function} cb The callback to call on escape press.
 * @return {Function} The decorated function.
 */
function onEscapePressed(cb) {
    return (evt) => {
        if (evt.keyCode !== ESCAPE_KEY_CODE) {
            return;
        }

        cb();
    };
}

/**
 * Set custom color palette on primary and secondary colors.
 *
 * @param {Element} sheet        The sheet to insert the custom rules in.
 * @param {string}  theme        The theme to apply the custom color palete on.
 * @param {Object}  colorPalette The custom color palette.
 */
function setColorPalette(sheet, theme, colorPalette) {
    let index = 0;

    let buttonRules = [];
    buttonRules = buttonRules.concat(
        _getButtonCSSRules(colorPalette, 'primary'),
        _getButtonCSSRules(colorPalette, 'secondary'),
        _getButtonSelectedCSSRules(colorPalette),
    );

    buttonRules.forEach((buttonRule) => {
        _addCSSRule(sheet, buttonRule.selector, buttonRule.rule, index);
        index++;
    });

    let checkboxRules;
    if (theme === 'lumapps') {
        checkboxRules = _getCheckboxCSSRules(colorPalette, 'primary');
    } else if (theme === 'material') {
        checkboxRules = _getCheckboxCSSRules(colorPalette, 'secondary');
    }

    checkboxRules.forEach((checkboxRule) => {
        _addCSSRule(sheet, checkboxRule.selector, checkboxRule.rule, index);
        index++;
    });

    const chipRules = _getChipSelectedCSSRules(colorPalette);

    chipRules.forEach((chipRule) => {
        _addCSSRule(sheet, chipRule.selector, chipRule.rule, index);
        index++;
    });

    const progressRules = _getProgressCSSRules(colorPalette);

    progressRules.forEach((progressRule) => {
        _addCSSRule(sheet, progressRule.selector, progressRule.rule, index);
        index++;
    });

    let radioButtonRules;
    if (theme === 'lumapps') {
        radioButtonRules = _getRadioButtonCSSRules(colorPalette, 'primary');
    } else if (theme === 'material') {
        radioButtonRules = _getRadioButtonCSSRules(colorPalette, 'secondary');
    }

    radioButtonRules.forEach((radioButtonRule) => {
        _addCSSRule(sheet, radioButtonRule.selector, radioButtonRule.rule, index);
        index++;
    });

    const selectRules = _getSelectCSSRules(colorPalette);

    selectRules.forEach((selectRule) => {
        _addCSSRule(sheet, selectRule.selector, selectRule.rule, index);
        index++;
    });
}

/////////////////////////////

export { getBasicClass, handleBasicClasses, detectSwipe, onEnterPressed, onEscapePressed, setColorPalette };
