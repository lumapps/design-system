import {
    ColorPalette,
    ColorVariant,
    FlexBox,
    Icon,
    Text,
    Link,
    Typography,
    TypographyInterface,
    TypographyTitleCustom,
    GenericBlock,
} from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { mdiEarth, mdiFoodApple, mdiPencil } from '@lumx/icons';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/Link/Stories';

const linkTypographies = { ...TypographyInterface, ...TypographyTitleCustom };

const { meta, ...coreStories } = setup({
    component: Link,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/link/Link',
    ...meta,
    argTypes: {
        ...meta.argTypes,
        typography: getSelectArgType(linkTypographies),
        color: colorArgType,
        colorVariant: colorVariantArgType,
        rightIcon: iconArgType,
        leftIcon: iconArgType,
    },
    args: { ...meta.args, children: 'Link' },
};

/** Default link */
export const Default = { ...coreStories.Default, args: { ...coreStories.Default.args, children: 'Link' } };

/** Link as button */
export const AsButton = { ...coreStories.AsButton, args: { ...coreStories.AsButton.args, children: 'Button Link' } };

/** With typography */
export const WithTypography = {
    ...coreStories.WithTypography,
    args: { ...coreStories.WithTypography.args, children: 'Link' },
};

/** With color */
export const WithColor = { ...coreStories.WithColor, args: { ...coreStories.WithColor.args, children: 'Link' } };

/** Disabled states */
export const Disabled = { ...coreStories.Disabled };

/**
 * Use custom component instead of <a> or <button>
 */
export const LinkAs = {
    args: { linkAs: CustomLink, children: 'Link' },
};

/**
 * Use a custom typography and customize it via CSS variable
 */
export const WithCustomizableTypography = {
    args: { typography: Typography.custom.title1, children: 'Link' },
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
    ...coreStories.AllStates,
    argTypes: {
        ...coreStories.AllStates.argTypes,
        onClick: { action: true },
    },
    decorators: [
        withThemedBackground(),
        withCombinations({
            combinations: {
                sections: {
                    Default: { href: '#', children: 'Link' },
                    'As button': { children: 'Link' },
                    'with icon': {
                        children: ['Link', <Icon key="icon" icon={mdiEarth} />, 'with icon'],
                    },
                },
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    Focused: { 'data-focus-visible-added': true },
                    'ARIA Disabled': { 'aria-disabled': true },
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
    args: {
        children: ['Link', <Icon key="icon" icon={mdiEarth} />, 'with icon'],
        rightIcon: mdiPencil,
        leftIcon: mdiFoodApple,
    },
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
    args: { children: 'Link' },
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

/**
 * Check how link inherit parent typography & color.
 * Typography should be inherited.
 * Color should not.
 */
export const ParentTypographyAndColor = {
    args: {
        children: ['Link', <Icon key="icon" icon={mdiEarth} />, 'with icon'],
        'parent.typography': undefined,
        'parent.color': undefined,
    },
    render: ({ parent: { typography, color }, ...args }: any) => (
        <Text as="p" color={color} typography={typography}>
            <Link {...args} />
        </Text>
    ),
    decorators: [
        withNestedProps(),
        withCombinations({
            combinations: {
                sections: { Button: {}, Link: { href: '#' } },
                rows: {
                    Default: {},
                    'Parent typography=title': { 'parent.typography': 'title' },
                    'Parent color=red': { 'parent.color': 'red' },
                },
            },
        }),
        withWrapper({ orientation: 'horizontal', vAlign: 'space-evenly', wrap: true, gap: 'huge' }, FlexBox),
    ],
};

/** Check wrapping a block with a Link */
export const WrappingBlock = {
    render() {
        return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <Link href="#" color="dark">
                <GenericBlock figure={<Icon icon={mdiEarth} hasShape color="red" />} hAlign="center">
                    <Text as="p" typography="subtitle1">
                        Hello Earth
                    </Text>
                </GenericBlock>
            </Link>
        );
    },
};
