import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import {
    ColorPalette,
    ColorVariant,
    Typography,
    TypographyInterface,
    TypographyTitleCustom,
} from '@lumx/core/js/constants';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiEarth, mdiFoodApple, mdiPencil } from '@lumx/icons';
import { DEFAULT_PROPS } from '.';

const linkTypographies = { ...TypographyInterface, ...TypographyTitleCustom };

/**
 * Setup Link stories for a specific framework (React or Vue).
 * Framework-specific components (Link, Text, Icon, etc.) are injected via `components`.
 */
export function setup({
    component: Link,
    components: { Text, Icon, CustomLink, FlexBox },
    decorators: { withCombinations, withThemedBackground, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withThemedBackground' | 'withWrapper';
    components: { Text: any; Icon: any; CustomLink: any; FlexBox: any };
}>) {
    const meta = {
        component: Link,
        render: ({ children, ...args }: any) => <Link {...args}>{children}</Link>,
        argTypes: {
            onClick: { action: true },
            typography: getSelectArgType(linkTypographies),
            color: colorArgType,
            colorVariant: colorVariantArgType,
            rightIcon: iconArgType,
            leftIcon: iconArgType,
        },
        args: {
            ...DEFAULT_PROPS,
            children: 'Link',
        },
    };

    /** Default link */
    const Default = {
        args: {
            href: 'https://example.com',
            target: '_blank',
        },
    };

    /** Link as button */
    const AsButton = {
        args: {
            children: 'Button Link',
        },
    };

    /** With typography */
    const WithTypography = {
        args: {
            href: 'https://example.com',
            typography: 'title',
        },
    };

    /** With color */
    const WithColor = {
        args: {
            href: 'https://example.com',
            color: ColorPalette.primary,
            colorVariant: ColorVariant.D1,
        },
    };

    /** Disabled states */
    const Disabled = {
        argTypes: {
            isDisabled: { control: false },
            'aria-disabled': { control: false },
        },
        args: {
            children: 'Link',
        },
        decorators: [
            withCombinations({
                combinations: {
                    sections: {
                        'As link': { href: 'https://example.com' },
                        'As button': {},
                    },
                    rows: {
                        disabled: { isDisabled: true },
                        'aria-disabled': { 'aria-disabled': true },
                    },
                },
            }),
        ],
    };

    /** Use custom component instead of <a> or <button> */
    const LinkAs = {
        args: { linkAs: CustomLink, children: 'Link' },
    };

    /**
     * Use a custom typography and customize it via CSS variable
     */
    const WithCustomizableTypography = {
        args: { typography: Typography.custom.title1, children: 'Link' },
        render: ({ children, ...args }: any) => (
            <>
                <style>{`:root { --lumx-typography-custom-title1-font-size: 5px; }`}</style>
                <Link {...args}>{children}</Link>
            </>
        ),
    };

    /** All states */
    const AllStates = {
        argTypes: {
            isDisabled: { control: false },
            onClick: { action: true },
        },
        decorators: [
            withThemedBackground(),
            withCombinations({
                combinations: {
                    sections: {
                        Default: { href: '#' },
                        'As button': {},
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

    /** Show all typographies */
    const AllTypography = {
        render: ({ children, ...args }: any) => (
            <Link {...args}>
                Link <Icon icon={mdiEarth} /> with icon
            </Link>
        ),
        args: {
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

    /** Show all color combinations */
    const AllColors = {
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
    const ParentTypographyAndColor = {
        render: ({ children, ...args }: any) => (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <small>Default</small>
                        </td>
                        <td>
                            <Link {...args}>
                                Link <Icon icon={mdiEarth} /> with icon
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <small>Parent typography=title</small>
                        </td>
                        <td>
                            <Text as="p" typography="title">
                                <Link {...args}>
                                    Link <Icon icon={mdiEarth} /> with icon
                                </Link>
                            </Text>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <small>Parent color=red</small>
                        </td>
                        <td>
                            <Text as="p" color="red">
                                <Link {...args}>
                                    Link <Icon icon={mdiEarth} /> with icon
                                </Link>
                            </Text>
                        </td>
                    </tr>
                </tbody>
            </table>
        ),
        decorators: [
            withCombinations({
                combinations: {
                    sections: {
                        Button: {},
                        Link: { href: '#' },
                    },
                },
            }),
            withWrapper({ orientation: 'horizontal', vAlign: 'space-evenly', wrap: true, gap: 'huge' }, FlexBox),
        ],
    };

    return {
        meta,
        Default,
        AsButton,
        WithTypography,
        WithColor,
        Disabled,
        LinkAs,
        WithCustomizableTypography,
        AllStates,
        AllTypography,
        AllColors,
        ParentTypographyAndColor,
    };
}
