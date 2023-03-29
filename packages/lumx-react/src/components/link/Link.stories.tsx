import { ColorPalette, ColorVariant, Link, Typography, TypographyInterface, TypographyTitleCustom } from '@lumx/react';
import React from 'react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { colorArgType, colorVariantArgType } from '@lumx/react/stories/controls/color';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

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
 * Disabled
 */
export const Disabled = {
    args: { ...Default.args, children: 'Link (disabled)', isDisabled: true },
};

/**
 * Using onClick transforms the link into a <button> in DOM
 */
export const ButtonLink = {
    argTypes: { onClick: { action: true } },
    args: { children: 'Button link' },
};

/**
 * Button link disabled
 */
export const ButtonLinkDisabled = {
    args: { ...ButtonLink.args, children: 'Button link (disabled)', isDisabled: true },
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
