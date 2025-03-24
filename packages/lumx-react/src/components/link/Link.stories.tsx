import {
    ColorPalette,
    ColorVariant,
    FlexBox,
    Link,
    Typography,
    TypographyInterface,
    TypographyTitleCustom,
} from '@lumx/react';
import React from 'react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { mdiFoodApple, mdiPencil } from '@lumx/icons/override/generated';

const linkTypographies = { ...TypographyInterface, ...TypographyTitleCustom };

export default {
    title: 'LumX components/link/Link',
    component: Link,
    argTypes: {
        typography: getSelectArgType(linkTypographies),
        color: colorArgType,
        colorVariant: colorVariantArgType,
        rightIcon: iconArgType,
        leftIcon: iconArgType,
    },
    args: { ...Link.defaultProps, children: 'Link' },
};

/**
 * Default link
 */
export const Default = {
    args: { href: 'https://example.com', target: '_blank' },
};

/**
 * Use custom component instead of <a> or <button>
 */
export const LinkAs = {
    args: { linkAs: CustomLink },
};

/**
 * Use a custom typography and customize it via CSS variable
 */
export const WithCustomizableTypography = {
    typography: Typography.custom.title1,
    // eslint-disable-next-line react/display-name
    render: (props: any) => (
        // Injecting CSS variable to customize the font size
        <>
            <style>{`
            :root {
                --lumx-typography-custom-title1-font-size: 5px;
            }
            `}</style>
            <Link {...props} />
        </>
    ),
};

/**
 * Show state combinations
 */
export const AllStates = {
    argTypes: {
        isDisabled: { control: false },
    },
    decorators: [
        withThemedBackground(),
        withCombinations({
            combinations: {
                sections: {
                    Default: {},
                    'with icons': { rightIcon: mdiPencil, leftIcon: mdiFoodApple },
                },
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    Focused: { 'data-focus-visible-added': true },
                    Hovered: { 'data-lumx-hover': true },
                },
                rows: {
                    Default: {},
                    'color=red': { color: 'red' },
                    'theme=dark': { theme: 'dark' },
                    'theme=dark & color=red': { theme: 'dark', color: 'red' },
                },
            },
        }),
        withWrapper({ orientation: 'horizontal', vAlign: 'space-evenly', wrap: true, gap: 'huge' }, FlexBox),
    ],
};

/**
 * Show all typographies
 */
export const AllTypography = {
    argTypes: {
        typography: { control: false },
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'typography', options: withUndefined(linkTypographies) },
            },
        }),
    ],
};

/**
 * Show all color combinations
 */
export const AllColors = {
    argTypes: {
        color: { control: false },
        colorVariant: { control: false },
    },
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'color', options: withUndefined(ColorPalette) },
                cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
            },
        }),
    ],
};
