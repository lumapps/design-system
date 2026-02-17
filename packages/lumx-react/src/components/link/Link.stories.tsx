import { FlexBox, GenericBlock, Icon, Link, Text } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { mdiEarth } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/Link/Stories';

const { meta, ...stories } = setup({
    component: Link,
    components: { Text, Icon, CustomLink, FlexBox },
    decorators: { withCombinations, withNestedProps, withThemedBackground, withWrapper },
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
