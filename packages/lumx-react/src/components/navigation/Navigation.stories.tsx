import React from 'react';

import {
    mdiHome,
    mdiMessageTextOutline,
    mdiFolderGoogleDrive,
    mdiTextBox,
    mdiLink,
    mdiGoogleCirclesExtended,
    mdiFolder,
} from '@lumx/icons';
import { Navigation, Orientation, Theme } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withTheming } from '@lumx/react/stories/utils/theming';
import pick from 'lodash/pick';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/design-tokens';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

export default {
    title: 'LumX components/navigation/Navigation',
    component: Navigation,
    argTypes: {
        'itemProps.onClick': { action: true, table: { disable: true } },
    },
};

/**
 * Demonstrate a full-featured navigation
 */
export const FullFeatured = {
    render({ theme, itemProps, orientation }: any) {
        return (
            <Navigation theme={theme} aria-label="navigation" orientation={orientation}>
                <Navigation.Item isCurrentPage label="Homepage" icon={mdiHome} href="#" {...itemProps} />
                <Navigation.Item
                    label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                    href="#"
                    {...itemProps}
                />
                <Navigation.Item
                    label="Custom link element"
                    icon={mdiMessageTextOutline}
                    as={CustomLink}
                    // `to` prop is required in CustomLink
                    to="#"
                    {...itemProps}
                />
                <Navigation.Item as="button" label="Button element" icon={mdiFolderGoogleDrive} {...itemProps} />
                <Navigation.Section label="Section 1" icon={mdiFolder} {...itemProps}>
                    <Navigation.Item label="A content" href="#content" {...itemProps} />
                    <Navigation.Item label="A button" icon={mdiLink} href="https://www.google.com" {...itemProps} />
                    <Navigation.Item
                        label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                        icon={mdiTextBox}
                        href="#content"
                        {...itemProps}
                    />
                    <Navigation.Item
                        label="A community"
                        icon={mdiGoogleCirclesExtended}
                        href="#community"
                        {...itemProps}
                    />
                    <Navigation.Section label="Section 1.1" icon={mdiFolder} {...itemProps}>
                        <Navigation.Item label="A content" icon={mdiTextBox} href="#content" {...itemProps} />
                        <Navigation.Item
                            label="Some very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                            icon={mdiTextBox}
                            href="#content"
                            {...itemProps}
                        />
                        <Navigation.Item label="A link" icon={mdiLink} href="https://www.google.com" {...itemProps} />
                        <Navigation.Item
                            label="A community"
                            icon={mdiGoogleCirclesExtended}
                            href="#community"
                            {...itemProps}
                        />
                    </Navigation.Section>
                </Navigation.Section>
                <Navigation.Section label="Section 2" icon={mdiFolder} {...itemProps}>
                    <Navigation.Item label="A content" icon={mdiTextBox} href="#content" {...itemProps} />
                    <Navigation.Item label="A link" icon={mdiLink} href="https://www.google.com" {...itemProps} />
                    <Navigation.Item
                        label="A community"
                        icon={mdiGoogleCirclesExtended}
                        href="#community"
                        {...itemProps}
                    />
                </Navigation.Section>
            </Navigation>
        );
    },
    decorators: [withNestedProps()],
};

/**
 * Horizontal navigation
 */
export const FullFeaturedHorizontal = { ...FullFeatured, args: { orientation: Orientation.horizontal } };

/**
 * Demonstrate all item variants
 */
export const ItemVariants = {
    args: {
        'itemProps.icon': mdiHome,
        'itemProps.as': 'button',
    },
    argTypes: {
        'itemProps.icon': iconArgType,
        'itemProps.as': getSelectArgType(['button', 'a']),
        'itemProps.href': { control: 'text', if: { arg: 'itemProps.as', eq: 'a' } },
    },
    render: ({ itemProps, ...args }: any) => (
        <Navigation aria-label="navigation" {...args}>
            {Object.entries({
                '': {},
                Current: { isCurrentPage: true },
            }).map(([key1, currentProps]) =>
                Object.entries({
                    Item: {},
                    'Item (hover)': { 'data-lumx-hover': true },
                    'Item (active)': { 'data-lumx-active': true },
                }).map(([key2, stateProps]) => (
                    <Navigation.Item
                        key={key1 + key2}
                        label={`${key1} ${key2}`}
                        {...currentProps}
                        {...stateProps}
                        {...itemProps}
                    />
                )),
            )}

            {Object.entries({
                Section: {},
                'Section (hover)': { 'data-lumx-hover': true },
                'Section (active)': { 'data-lumx-active': true },
            }).map(([key2, stateProps]) => (
                <Navigation.Section key={key2} label={key2} {...stateProps} {...itemProps}>
                    <Navigation.Item as="button" label="SubItem 1" />
                    <Navigation.Item as="button" label="SubItem 2" />
                </Navigation.Section>
            ))}
        </Navigation>
    ),
    decorators: [
        withNestedProps(),
        withThemedBackground(),
        withCombinations({
            sectionStyle: { display: 'inline-block' },
            combinations: {
                cols: { '': {}, Focused: { 'itemProps.data-focus-visible-added': true } },
                sections: {
                    'Theme light': { theme: undefined },
                    'Theme dark': { theme: Theme.dark },
                },
            },
        }),
    ],
};

/**
 * Test CSS variable theming
 */
export const Theming = {
    ...ItemVariants,
    decorators: [
        ...ItemVariants.decorators,
        withTheming({
            properties: pick(DESIGN_TOKENS, ['navigation']),
            values: `
            --lumx-navigation-item-emphasis-low-state-default-border-top-width: 5px;
            --lumx-navigation-item-emphasis-low-state-default-border-right-width: 2px;
            --lumx-navigation-item-emphasis-low-state-default-border-bottom-width: 3px;
            --lumx-navigation-item-emphasis-low-state-default-border-left-width: 4px;
            --lumx-navigation-item-emphasis-low-state-default-theme-light-border-color: lightcoral;
            --lumx-navigation-item-emphasis-low-state-default-theme-light-background-color: lightsalmon;
            --lumx-navigation-item-emphasis-low-state-default-theme-dark-border-color: lightsalmon;
            --lumx-navigation-item-emphasis-low-state-default-theme-dark-background-color: lightcoral;

            --lumx-navigation-item-emphasis-low-state-hover-border-top-width: 4px;
            --lumx-navigation-item-emphasis-low-state-hover-border-right-width: 5px;
            --lumx-navigation-item-emphasis-low-state-hover-border-bottom-width: 2px;
            --lumx-navigation-item-emphasis-low-state-hover-border-left-width: 3px;
            --lumx-navigation-item-emphasis-low-state-hover-theme-light-border-color: lightgreen;
            --lumx-navigation-item-emphasis-low-state-hover-theme-light-background-color: lightpink;
            --lumx-navigation-item-emphasis-low-state-hover-theme-dark-border-color: lightpink;
            --lumx-navigation-item-emphasis-low-state-hover-theme-dark-background-color: lightgreen;

            --lumx-navigation-item-emphasis-low-state-active-border-top-width: 3px;
            --lumx-navigation-item-emphasis-low-state-active-border-right-width: 4px;
            --lumx-navigation-item-emphasis-low-state-active-border-bottom-width: 5px;
            --lumx-navigation-item-emphasis-low-state-active-border-left-width: 2px;
            --lumx-navigation-item-emphasis-low-state-active-theme-light-border-color: lemonchiffon;
            --lumx-navigation-item-emphasis-low-state-active-theme-light-background-color: lavenderblush;
            --lumx-navigation-item-emphasis-low-state-active-theme-dark-border-color: lavenderblush;
            --lumx-navigation-item-emphasis-low-state-active-theme-dark-background-color: lemonchiffon;

            ////

            --lumx-navigation-item-emphasis-selected-state-default-border-top-width: 2px;
            --lumx-navigation-item-emphasis-selected-state-default-border-right-width: 3px;
            --lumx-navigation-item-emphasis-selected-state-default-border-bottom-width: 4px;
            --lumx-navigation-item-emphasis-selected-state-default-border-left-width: 5px;
            --lumx-navigation-item-emphasis-selected-state-default-theme-light-border-color: red;
            --lumx-navigation-item-emphasis-selected-state-default-theme-light-background-color: orange;
            --lumx-navigation-item-emphasis-selected-state-default-theme-dark-border-color: blue;
            --lumx-navigation-item-emphasis-selected-state-default-theme-dark-background-color: violet;

            --lumx-navigation-item-emphasis-selected-state-hover-border-top-width: 3px;
            --lumx-navigation-item-emphasis-selected-state-hover-border-right-width: 4px;
            --lumx-navigation-item-emphasis-selected-state-hover-border-bottom-width: 5px;
            --lumx-navigation-item-emphasis-selected-state-hover-border-left-width: 2px;
            --lumx-navigation-item-emphasis-selected-state-hover-theme-light-border-color: green;
            --lumx-navigation-item-emphasis-selected-state-hover-theme-light-background-color: violet;
            --lumx-navigation-item-emphasis-selected-state-hover-theme-dark-border-color: violet;
            --lumx-navigation-item-emphasis-selected-state-hover-theme-dark-background-color: green;

            --lumx-navigation-item-emphasis-selected-state-active-border-top-width: 4px;
            --lumx-navigation-item-emphasis-selected-state-active-border-right-width: 5px;
            --lumx-navigation-item-emphasis-selected-state-active-border-bottom-width: 2px;
            --lumx-navigation-item-emphasis-selected-state-active-border-left-width: 3px;
            --lumx-navigation-item-emphasis-selected-state-active-theme-light-border-color: orange;
            --lumx-navigation-item-emphasis-selected-state-active-theme-light-background-color: pink;
            --lumx-navigation-item-emphasis-selected-state-active-theme-dark-border-color: pink;
            --lumx-navigation-item-emphasis-selected-state-active-theme-dark-background-color: orange;
            `,
        }),
    ],
};
