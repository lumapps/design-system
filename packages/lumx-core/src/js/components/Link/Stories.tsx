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
    decorators: { withCombinations, withNestedProps, withThemedBackground, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withNestedProps' | 'withThemedBackground' | 'withWrapper';
    components: { Text: any; Icon: any; CustomLink: any; FlexBox: any };
}>) {
    return {
        meta: {
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
        },

        /** Default link */
        Default: {
            args: {
                href: 'https://example.com',
                target: '_blank',
            },
        },

        /** Link as button */
        AsButton: {
            args: {
                children: 'Button Link',
            },
        },

        /** With typography */
        WithTypography: {
            args: {
                href: 'https://example.com',
                typography: 'title',
            },
        },

        /** With color */
        WithColor: {
            args: {
                href: 'https://example.com',
                color: ColorPalette.primary,
                colorVariant: ColorVariant.D1,
            },
        },

        /** Disabled states */
        Disabled: {
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
        },

        /** Use custom component instead of <a> or <button> */
        LinkAs: {
            args: { linkAs: CustomLink, children: 'Link' },
        },

        /**
         * Use a custom typography and customize it via CSS variable
         */
        WithCustomizableTypography: {
            args: { typography: Typography.custom.title1, children: 'Link' },
            render: ({ children, ...args }: any) => (
                <>
                    <style>{`:root { --lumx-typography-custom-title1-font-size: 5px; }`}</style>
                    <Link {...args}>{children}</Link>
                </>
            ),
        },

        /** All states */
        AllStates: {
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
                            'with icon': {
                                children: ['Link ', <Icon key="icon" icon={mdiEarth} />, ' with icon'],
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
        },

        /** Show all typographies */
        AllTypography: {
            args: {
                children: ['Link ', <Icon key="icon" icon={mdiEarth} />, ' with icon'],
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
        },

        /** Show all color combinations */
        AllColors: {
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
        },

        /**
         * Check how link inherit parent typography & color.
         * Typography should be inherited.
         * Color should not.
         */
        ParentTypographyAndColor: {
            args: {
                children: ['Link ', <Icon key="icon" icon={mdiEarth} />, ' with icon'],
                'parent.typography': undefined,
                'parent.color': undefined,
            },
            render: ({ children, parent: { typography, color } = {} as any, ...args }: any) => (
                <Text as="p" color={color} typography={typography}>
                    <Link {...args}>{children}</Link>
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
        },
    };
}
