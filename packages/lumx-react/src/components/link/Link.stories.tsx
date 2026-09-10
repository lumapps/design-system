import pick from 'lodash/pick';

import { FlexBox, GenericBlock, Icon, Link, Text } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withTheming } from '@lumx/react/stories/decorators/withTheming';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
import { mdiEarth } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/Link/Stories';

const { meta, ...stories } = setup({
    component: Link,
    components: { Text, Icon, CustomLink, FlexBox },
    decorators: { withCombinations, withThemedBackground, withWrapper },
});

export default {
    title: 'LumX components/link/Link',
    ...meta,
};

export const Default = { ...stories.Default };
export const AsButton = { ...stories.AsButton };
export const WithTypography = { ...stories.WithTypography };
export const WithColor = { ...stories.WithColor };
export const Disabled = { ...stories.Disabled };
export const LinkAs = { ...stories.LinkAs };
export const WithCustomizableTypography = { ...stories.WithCustomizableTypography };
export const AllStates = { ...stories.AllStates };
export const AllTypography = { ...stories.AllTypography };
export const AllColors = { ...stories.AllColors };
export const ParentTypographyAndColor = { ...stories.ParentTypographyAndColor };

/** Demo link LumX CSS theming variables */
export const Theming = {
    argTypes: disableArgTypes(['isDisabled', 'linkAs', 'typography', 'rightIcon', 'leftIcon', 'color', 'colorVariant']),
    args: {
        href: 'https://example.com',
    },
    decorators: [
        withThemedBackground(),
        withCombinations({
            combinations: {
                cols: {
                    Default: {},
                    Hovered: { 'data-lumx-hover': true },
                    Focused: { 'data-focus-visible-added': true },
                },
                rows: {
                    Default: {},
                    'color=red': { color: 'red' },
                    'theme=dark': { theme: 'dark' },
                },
            },
        }),
        withTheming({
            properties: pick(DESIGN_TOKENS, ['link']),
            values: `
        --lumx-link-text-decoration: overline;
        --lumx-link-visited-color: hotpink;
    `,
        }),
    ],
};

/** React-only: Check wrapping a block with a Link */
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
