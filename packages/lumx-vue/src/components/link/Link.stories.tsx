import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withThemedBackground } from '@lumx/vue/stories/decorators/withThemedBackground';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Link/Stories';
import { FlexBox, Icon, Link, Text } from '@lumx/vue';
import CustomLink from '@lumx/vue/stories/utils/CustomLink.vue';

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
