import { mdiSend } from '@lumx/icons';
import { Emphasis, Size } from '@lumx/core/js/constants';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { SQUARE_IMAGES, squareImageArgType } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { DEFAULT_PROPS } from './IconButton';
import { ButtonSize } from './ButtonRoot';
import { excludeCombination } from './Stories';

/**
 * Setup IconButton stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: IconButton,
    decorators: { withCombinations, withThemedBackground },
}: SetupStoriesOptions<{ decorators: 'withCombinations' | 'withThemedBackground' }>) {
    const meta = {
        component: IconButton,
        render: (args: any) => <IconButton {...args} />,
        argTypes: {
            isSelected: { control: 'boolean' },
            isDisabled: { control: 'boolean' },
            hasBackground: { control: 'boolean' },
            emphasis: getSelectArgType(Emphasis),
            size: getSelectArgType<ButtonSize>([Size.s, Size.m]),
            icon: iconArgType,
            color: colorArgType,
            ref: { table: { disable: true } },
            onClick: { action: true, table: { disable: true } },
            linkAs: { table: { disable: true } },
            className: { table: { disable: true } },
            target: { if: { arg: 'href', exists: true }, control: { type: 'inline-radio' } },
            type: { if: { arg: 'href', exists: false }, control: { type: 'inline-radio' } },
        },
        args: {
            ...DEFAULT_PROPS,
            label: 'Button label',
            icon: mdiSend,
        },
    };

    const Default = {};

    /** IconButton using an image */
    const WithImage = {
        argTypes: squareImageArgType,
        args: { image: SQUARE_IMAGES.square1 },
    };

    /** Check icon button style variations (color, states, emphasis, etc.) */
    const IconStateVariations = {
        args: {},
        argTypes: {
            ...disableArgTypes([
                'emphasis',
                'hasBackground',
                'isSelected',
                'isDisabled',
                'color',
                'type',
                'name',
                'href',
            ]),
        },
        decorators: [
            withThemedBackground(),
            withCombinations({
                tableStyle: { width: '100%' },
                firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
                excludeCombination,
                combinations: {
                    rows: {
                        Default: {},
                        'Color: red': { color: 'red' },
                        'Theme: dark': { theme: 'dark' },
                        'Theme: dark & color: green': { theme: 'dark', color: 'green' },
                        Selected: { isSelected: true },
                        'Selected & theme dark': { isSelected: true, theme: 'dark' },
                    },
                    cols: {
                        'Default state': {},
                        Hovered: { isHovered: true },
                        Active: { isActive: true },
                        Focused: { isFocused: true },
                        Disabled: { isDisabled: true },
                        AriaDisabled: { 'aria-disabled': true },
                    },
                    sections: {
                        'Default (emphasis high)': {},
                        'Emphasis medium': { emphasis: 'medium' },
                        'Emphasis low': { emphasis: 'low' },
                        'Emphasis low + has background': { emphasis: 'low', hasBackground: true },
                    },
                },
            }),
        ],
    };

    return { meta, Default, WithImage, IconStateVariations };
}
