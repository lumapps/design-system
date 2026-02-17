import pick from 'lodash/pick';

import { Button, Emphasis, Text } from '@lumx/react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withTheming } from '@lumx/react/stories/utils/theming';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
import { setup, excludeCombination } from '@lumx/core/js/components/Button/Stories';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';

const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];

const { meta, ...stories } = setup({
    component: Button,
    decorators: { withCombinations, withThemedBackground },
});

export default {
    title: 'LumX components/button/Button',
    ...meta,
};

export const Base = { ...stories.Base };
export const SizeAndEmphasis = { ...stories.SizeAndEmphasis };
export const LinkButton = { ...stories.LinkButton };
export const StateVariations = { ...stories.StateVariations };

/** Demo button LumX CSS theming variable */
export const Theming = {
    argTypes: disableArgTypes(['isDisabled', 'href', 'name', 'type', 'emphasis']),
    decorators: [
        withThemedBackground(),
        withCombinations({
            excludeCombination,
            combinations: {
                // States
                cols: {
                    Default: {},
                    Hovered: { isHovered: true },
                    Active: { isActive: true },
                    Focused: { isFocused: true },
                    Disabled: { isDisabled: true },
                    AriaDisabled: { 'aria-disabled': true },
                },
                rows: {
                    Default: {},
                    Selected: { isSelected: true },
                    'Has background': { hasBackground: true },
                },
            },
        }),
        withTheming({
            properties: pick(DESIGN_TOKENS, ['button']),
            values: `
        --lumx-button-height: 50px;
        --lumx-button-border-radius: 2px;

        /////////////
        --lumx-button-emphasis-high-state-default-padding-horizontal: 10px;
        --lumx-button-emphasis-high-state-default-border-width: 2px;
        --lumx-button-emphasis-high-state-hover-padding-horizontal: 15px;
        --lumx-button-emphasis-high-state-hover-border-width: 4px;
        --lumx-button-emphasis-high-state-active-padding-horizontal: 20px;
        --lumx-button-emphasis-high-state-active-border-width: 6px;

        --lumx-button-emphasis-high-state-default-theme-light-background-color: darkred;
        --lumx-button-emphasis-high-state-default-theme-light-color: green;
        --lumx-button-emphasis-high-state-default-theme-light-border-color: green;
        --lumx-button-emphasis-high-state-hover-theme-light-background-color: rebeccapurple;
        --lumx-button-emphasis-high-state-hover-theme-light-color: yellow;
        --lumx-button-emphasis-high-state-hover-theme-light-border-color: yellow;
        --lumx-button-emphasis-high-state-active-theme-light-background-color: black;
        --lumx-button-emphasis-high-state-active-theme-light-color: blue;
        --lumx-button-emphasis-high-state-active-theme-light-border-color: blue;

        --lumx-button-emphasis-high-state-default-theme-dark-background-color: rebeccapurple;
        --lumx-button-emphasis-high-state-default-theme-dark-color: hotpink;
        --lumx-button-emphasis-high-state-default-theme-dark-border-color: hotpink;
        --lumx-button-emphasis-high-state-hover-theme-dark-background-color: yellow;
        --lumx-button-emphasis-high-state-hover-theme-dark-color: blue;
        --lumx-button-emphasis-high-state-hover-theme-dark-border-color: blue;
        --lumx-button-emphasis-high-state-active-theme-dark-background-color: green;
        --lumx-button-emphasis-high-state-active-theme-dark-color: red;
        --lumx-button-emphasis-high-state-active-theme-dark-border-color: red;

        /////////////
        --lumx-button-emphasis-medium-state-default-padding-horizontal: 5px;
        --lumx-button-emphasis-medium-state-default-border-width: 6px;
        --lumx-button-emphasis-medium-state-hover-padding-horizontal: 10px;
        --lumx-button-emphasis-medium-state-hover-border-width: 4px;
        --lumx-button-emphasis-medium-state-active-padding-horizontal: 2px;
        --lumx-button-emphasis-medium-state-active-border-width: 2px;

        --lumx-button-emphasis-medium-state-default-theme-light-background-color: lightblue;
        --lumx-button-emphasis-medium-state-default-theme-light-color: hotpink;
        --lumx-button-emphasis-medium-state-default-theme-light-border-color: hotpink;
        --lumx-button-emphasis-medium-state-hover-theme-light-background-color: red;
        --lumx-button-emphasis-medium-state-hover-theme-light-color: rebeccapurple;
        --lumx-button-emphasis-medium-state-hover-theme-light-border-color: rebeccapurple;
        --lumx-button-emphasis-medium-state-active-theme-light-background-color: lightseagreen;
        --lumx-button-emphasis-medium-state-active-theme-light-color: maroon;
        --lumx-button-emphasis-medium-state-active-theme-light-border-color: maroon;

        --lumx-button-emphasis-medium-state-default-theme-dark-background-color: mediumorchid;
        --lumx-button-emphasis-medium-state-default-theme-dark-color: midnightblue;
        --lumx-button-emphasis-medium-state-default-theme-dark-border-color: midnightblue;
        --lumx-button-emphasis-medium-state-hover-theme-dark-background-color: olive;
        --lumx-button-emphasis-medium-state-hover-theme-dark-color: orangered;
        --lumx-button-emphasis-medium-state-hover-theme-dark-border-color: orangered;
        --lumx-button-emphasis-medium-state-active-theme-dark-background-color: salmon;
        --lumx-button-emphasis-medium-state-active-theme-dark-color: seagreen;
        --lumx-button-emphasis-medium-state-active-theme-dark-border-color: seagreen;

        /////////////
        --lumx-button-emphasis-selected-state-default-padding-horizontal: 5px;
        --lumx-button-emphasis-selected-state-default-border-width: 1px;
        --lumx-button-emphasis-selected-state-hover-padding-horizontal: 2px;
        --lumx-button-emphasis-selected-state-hover-border-width: 2px;
        --lumx-button-emphasis-selected-state-active-padding-horizontal: 10px;
        --lumx-button-emphasis-selected-state-active-border-width: 3px;

        --lumx-button-emphasis-selected-state-default-theme-light-background-color: yellowgreen;
        --lumx-button-emphasis-selected-state-default-theme-light-color: bisque;
        --lumx-button-emphasis-selected-state-default-theme-light-border-color: bisque;
        --lumx-button-emphasis-selected-state-hover-theme-light-background-color: cadetblue;
        --lumx-button-emphasis-selected-state-hover-theme-light-color: coral;
        --lumx-button-emphasis-selected-state-hover-theme-light-border-color: coral;
        --lumx-button-emphasis-selected-state-active-theme-light-background-color: darkgoldenrod;
        --lumx-button-emphasis-selected-state-active-theme-light-color: darkslategrey;
        --lumx-button-emphasis-selected-state-active-theme-light-border-color: darkslategrey;

        --lumx-button-emphasis-selected-state-default-theme-dark-background-color: gold;
        --lumx-button-emphasis-selected-state-default-theme-dark-color: ghostwhite;
        --lumx-button-emphasis-selected-state-default-theme-dark-border-color: ghostwhite;
        --lumx-button-emphasis-selected-state-hover-theme-dark-background-color: lightcoral;
        --lumx-button-emphasis-selected-state-hover-theme-dark-color: magenta;
        --lumx-button-emphasis-selected-state-hover-theme-dark-border-color: magenta;
        --lumx-button-emphasis-selected-state-active-theme-dark-background-color: mediumslateblue;
        --lumx-button-emphasis-selected-state-active-theme-dark-color: mistyrose;
        --lumx-button-emphasis-selected-state-active-theme-dark-border-color: mistyrose;

        /////////////
        --lumx-button-emphasis-low-state-default-padding-horizontal: 1px;
        --lumx-button-emphasis-low-state-default-border-width: 10px;
        --lumx-button-emphasis-low-state-hover-padding-horizontal: 2px;
        --lumx-button-emphasis-low-state-hover-border-width: 5px;
        --lumx-button-emphasis-low-state-active-padding-horizontal: 3px;
        --lumx-button-emphasis-low-state-active-border-width: 2px;

        --lumx-button-emphasis-low-state-default-theme-light-background-color: rgb(from lightcyan r g b / 50%);
        --lumx-button-emphasis-low-state-default-theme-light-color: rgb(from goldenrod r g b / 50%);
        --lumx-button-emphasis-low-state-default-theme-light-border-color: rgb(from goldenrod r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-light-background-color: rgb(from darkslategray r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-light-color: rgb(from crimson r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-light-border-color: rgb(from crimson r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-light-background-color: rgb(from blanchedalmond r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-light-color: rgb(from firebrick r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-light-border-color: rgb(from firebrick r g b / 50%);

        --lumx-button-emphasis-low-state-default-theme-dark-background-color: rgb(from blueviolet r g b / 50%);
        --lumx-button-emphasis-low-state-default-theme-dark-color: rgb(from chartreuse r g b / 50%);
        --lumx-button-emphasis-low-state-default-theme-dark-border-color: rgb(from chartreuse r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-dark-background-color: rgb(from darkturquoise r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-dark-color: rgb(from goldenrod r g b / 50%);
        --lumx-button-emphasis-low-state-hover-theme-dark-border-color: rgb(from goldenrod r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-dark-background-color: rgb(from magenta r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-dark-color: rgb(from lightsteelblue r g b / 50%);
        --lumx-button-emphasis-low-state-active-theme-dark-border-color: rgb(from lightsteelblue r g b / 50%);
    `,
        }),
        withCombinations({
            combinations: {
                sections: { key: 'emphasis', options: buttonEmphasis },
            },
        }),
        withCombinations({
            combinations: {
                sections: { 'Theme light': { theme: 'light' }, 'Theme dark': { theme: 'dark' } },
            },
        }),
    ],
};
/**
 * Demo content sizing
 */
export const ContentSizing = {
    decorators: [
        withCombinations({
            colStyle: { width: '50%' },
            cellStyle: { maxWidth: '400px', overflow: 'hidden' },
            combinations: {
                rows: {
                    Default: {},
                    FullWidth: { fullWidth: true },
                },
                cols: {
                    'Short text': {
                        children: 'Short text',
                    },
                    'Long text': {
                        children: (
                            <Text as="span" truncate>
                                {loremIpsum('long')}
                            </Text>
                        ),
                    },
                },
            },
        }),
    ],
};
