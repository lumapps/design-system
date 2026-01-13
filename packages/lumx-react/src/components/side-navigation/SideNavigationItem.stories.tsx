/* eslint-disable react-hooks/rules-of-hooks,import/no-extraneous-dependencies */
import React from 'react';
import pick from 'lodash/pick';

import { Emphasis, GridColumn, SideNavigation, SideNavigationItem } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withTheming } from '@lumx/react/stories/utils/theming';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { action } from 'storybook/actions';

const EMPHASIS = [Emphasis.high, Emphasis.medium, Emphasis.low];

export default {
    title: 'LumX components/side-navigation/Side Navigation Item',
    component: SideNavigationItem,
    args: {
        label: 'Item',
        'toggleButtonProps.label': 'Toggle',
    },
    argTypes: {
        emphasis: getSelectArgType(EMPHASIS),
        icon: iconArgType,
        closeMode: { control: { type: 'inline-radio' }, if: { arg: 'children', exists: true } },
        isOpen: { if: { arg: 'children', exists: true } },
        onClick: { action: true, table: { disable: true } },
        ...disableArgTypes(['ref', 'children', 'linkAs', 'linkProps', 'toggleButtonProps', 'onActionClick']),
    },
    render: (args: any) => {
        const [isOpen, setIsOpen] = React.useState<boolean | undefined>(undefined);

        const toggleCallback = args.onActionClick ? 'onActionClick' : 'onClick';
        const toggle: React.MouseEventHandler = (event) => {
            args?.[toggleCallback]?.(event);
            setIsOpen((wasOpen) => !wasOpen);
        };
        return (
            <SideNavigation>
                <SideNavigationItem {...args} {...{ [toggleCallback]: toggle }} isOpen={isOpen} />
            </SideNavigation>
        );
    },
};

const STATE_COMBINATIONS = withCombinations({
    combinations: {
        cols: {
            Default: {},
            Hover: { 'linkProps.data-lumx-hover': true },
            Active: { 'linkProps.data-lumx-active': true },
        },
        rows: {
            Default: {},
            Focused: { 'linkProps.data-focus-visible-added': true },
            Selected: { isSelected: true },
            'Selected & Focused': { isSelected: true, 'linkProps.data-focus-visible-added': true },
        },
    },
});

/**
 * Demonstrate item & section variants
 */
export const ItemsAndSections = {
    argTypes: { ...disableArgTypes(['isSelected']) },
    decorators: [
        withNestedProps(),
        STATE_COMBINATIONS,
        withCombinations({
            combinations: {
                rows: {
                    '': {},
                    'With children': {
                        children: <SideNavigationItem label="Item 1" toggleButtonProps={{ label: 'Open' }} />,
                    },
                },
                cols: {
                    '': {},
                    'With action click': {
                        onActionClick: action('onActionClick'),
                    },
                },
            },
        }),
    ],
};

/**
 * Demonstrate emphasis variants
 */
export const EmphasisVariants = {
    argTypes: { ...disableArgTypes(['emphasis', 'isSelected']) },
    decorators: [
        withNestedProps(),
        STATE_COMBINATIONS,
        withCombinations({
            combinations: {
                sections: { key: 'emphasis', options: EMPHASIS },
            },
        }),
        withWrapper({ itemMinWidth: 300, maxColumns: 3 }, GridColumn),
    ],
};

/**
 * Test CSS variable theming
 */
export const Theming = {
    ...ItemsAndSections,
    decorators: [
        ...ItemsAndSections.decorators,
        withTheming({
            properties: pick(DESIGN_TOKENS, ['side-navigation']),
            values: `
            --lumx-side-navigation-item-emphasis-selected-state-default-border-width: 2px;
            --lumx-side-navigation-item-emphasis-selected-state-default-theme-light-border-color: red;
            --lumx-side-navigation-item-emphasis-selected-state-default-theme-light-background-color: orange;

            --lumx-side-navigation-item-emphasis-selected-state-hover-border-width: 3px;
            --lumx-side-navigation-item-emphasis-selected-state-hover-theme-light-border-color: green;
            --lumx-side-navigation-item-emphasis-selected-state-hover-theme-light-background-color: red;

            --lumx-side-navigation-item-emphasis-selected-state-active-border-width: 4px;
            --lumx-side-navigation-item-emphasis-selected-state-active-theme-light-border-color: orange;
            --lumx-side-navigation-item-emphasis-selected-state-active-theme-light-background-color: violet;
            `,
        }),
    ],
};
