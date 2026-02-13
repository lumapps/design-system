import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/Link/Stories';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { colorArgType, colorVariantArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import {
    ColorPalette,
    ColorVariant,
    Link,
    Typography,
    TypographyInterface,
    TypographyTitleCustom,
} from '@lumx/vue';
import LinkDefaultVue from './Stories/LinkDefault.vue';
import LinkAsVue from './Stories/LinkAs.vue';
import WithCustomizableTypographyVue from './Stories/WithCustomizableTypography.vue';
import ParentTypographyAndColorVue from './Stories/ParentTypographyAndColor.vue';
import CustomLink from '@lumx/vue/stories/utils/CustomLink.vue';

const linkTypographies = { ...TypographyInterface, ...TypographyTitleCustom };

const { meta, ...stories } = setup({
    component: Link,
    render: withRender({ LinkDefaultVue }),
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
        onClick: { action: 'click' },
    },
};

export const Default = { ...stories.Default };
export const AsButton = { ...stories.AsButton };
export const WithTypography = { ...stories.WithTypography };
export const WithColor = { ...stories.WithColor };
export const Disabled = { ...stories.Disabled };

/**
 * Use custom component instead of <a> or <button>
 */
export const LinkAs = {
    args: { linkAs: CustomLink, label: 'Link' },
    render: withRender({ LinkAsVue }),
};

/**
 * Use a custom typography and customize it via CSS variable
 */
export const WithCustomizableTypography = {
    args: { typography: Typography.custom.title1, label: 'Link' },
    render: withRender({ WithCustomizableTypographyVue }),
};

export const AllStates = { ...stories.AllStates };

/**
 * Show all typographies
 */
export const AllTypography = {
    args: {
        label: 'Link',
        rightIcon: undefined,
        leftIcon: undefined,
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
    args: { label: 'Link' },
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
        label: 'Link',
        parentTypography: undefined,
        parentColor: undefined,
    },
    render: withRender({ ParentTypographyAndColorVue }),
    decorators: [
        withNestedProps(),
        withCombinations({
            combinations: {
                sections: { Button: {}, Link: { href: '#' } },
                rows: {
                    Default: {},
                    'Parent typography=title': { parentTypography: 'title' },
                    'Parent color=red': { parentColor: 'red' },
                },
            },
        }),
    ],
};
