import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiClose, mdiViewList } from '@lumx/icons';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { ColorPalette, Size, Theme } from '../../constants';
import { DEFAULT_PROPS } from '.';

const chipSizes = [Size.m, Size.s];

export function setup({
    component: Chip,
    components: { Icon },
    decorators: { withCombinations, withThemedBackground, withTheming },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withThemedBackground' | 'withTheming';
    components: { Icon: any };
}>) {
    const meta = {
        component: Chip,
        render: ({ children, ...args }: any) => <Chip {...args}>{children}</Chip>,
        args: omit(DEFAULT_PROPS, ['theme']),
        argTypes: {
            size: getSelectArgType<typeof Size.m | typeof Size.s>(chipSizes),
            before: { control: false },
            after: { control: false },
        },
    };

    /** Default chip with label */
    const Default = {
        args: { children: 'Chip label' },
    };

    /** Clickable chip */
    const ChipButton = {
        args: { children: 'Chip label' },
        argTypes: { onClick: { action: true } },
    };

    /** Link chip */
    const ChipLink = {
        args: {
            children: 'Chip link',
            href: 'https://example.com',
            target: '_blank',
        },
    };

    /** With custom elements at the start and end of the chip */
    const WithAfterAndBefore = {
        argTypes: {
            onBeforeClick: { action: true },
            onClick: { action: true },
            onAfterClick: { action: true },
        },
        render: ({ children, ...args }: any) => (
            <Chip {...args} before={<Icon icon={mdiViewList} />} after={<Icon icon={mdiClose} />}>
                {children}
            </Chip>
        ),
        args: {
            children: 'Chip label',
        },
    };

    /** All combinations of color, size and states */
    const ColorVariants = {
        render: WithAfterAndBefore.render,
        argTypes: WithAfterAndBefore.argTypes,
        args: WithAfterAndBefore.args,
        decorators: [
            withCombinations({
                combinations: {
                    rows: { key: 'color', options: withUndefined(ColorPalette) },
                    sections: { key: 'size', options: chipSizes },
                    cols: {
                        Default: {},
                        Hover: { 'data-lumx-hover': true },
                        Active: { 'data-lumx-active': true },
                        Disabled: { isDisabled: true },
                        Focused: { 'data-focus-visible-added': true },
                    },
                },
            }),
        ],
    };

    /** All combinations of color, size and states */
    const SelectedVariants = {
        render: WithAfterAndBefore.render,
        argTypes: WithAfterAndBefore.argTypes,
        args: WithAfterAndBefore.args,
        decorators: [
            withThemedBackground(),
            withCombinations({
                combinations: {
                    sections: { 'Size m': {}, 'Size s': { size: 's' } },
                    rows: {
                        'theme=light': { theme: Theme.light },
                        'Selected & theme=light': { isSelected: true, theme: Theme.light },
                        'theme=dark': { theme: Theme.dark },
                        'Selected & theme=dark': { isSelected: true, theme: Theme.dark },
                    },
                    cols: {
                        Default: {},
                        Hover: { 'data-lumx-hover': true },
                        Active: { 'data-lumx-active': true },
                        Disabled: { isDisabled: true },
                        Focused: { 'data-focus-visible-added': true },
                    },
                },
            }),
        ],
    };

    /** Test Chip disabled states */
    const Disabled = {
        args: {
            children: 'Chip label',
        },
        decorators: [
            withCombinations({
                combinations: {
                    rows: { disabled: { disabled: true }, 'aria-disabled': { 'aria-disabled': true } },
                    cols: { button: { onClick: () => {} }, link: { href: 'https://example.com' } },
                },
            }),
        ],
    };

    /** Test chip CSS variable theming */
    const Theming = {
        ...SelectedVariants,
        decorators: [
            ...SelectedVariants.decorators,
            withTheming({
                properties: pick(DESIGN_TOKENS, ['chip']),
                values: `
                --lumx-chip-emphasis-selected-state-default-border-width: 2px;
                --lumx-chip-emphasis-selected-state-default-theme-light-border-color: red;
                --lumx-chip-emphasis-selected-state-default-theme-light-background-color: blue;
                --lumx-chip-emphasis-selected-state-default-theme-dark-border-color: blue;
                --lumx-chip-emphasis-selected-state-default-theme-dark-background-color: red;

                --lumx-chip-emphasis-selected-state-hover-border-width: 3px;
                --lumx-chip-emphasis-selected-state-hover-theme-light-border-color: green;
                --lumx-chip-emphasis-selected-state-hover-theme-light-background-color: violet;
                --lumx-chip-emphasis-selected-state-hover-theme-dark-border-color: violet;
                --lumx-chip-emphasis-selected-state-hover-theme-dark-background-color: green;

                --lumx-chip-emphasis-selected-state-active-border-width: 4px;
                --lumx-chip-emphasis-selected-state-active-theme-light-border-color: orange;
                --lumx-chip-emphasis-selected-state-active-theme-light-background-color: pink;
                --lumx-chip-emphasis-selected-state-active-theme-dark-border-color: pink;
                --lumx-chip-emphasis-selected-state-active-theme-dark-background-color: orange;
                `,
            }),
        ],
    };

    return {
        meta,
        Default,
        ChipButton,
        ChipLink,
        WithAfterAndBefore,
        ColorVariants,
        SelectedVariants,
        Disabled,
        Theming,
    };
}
