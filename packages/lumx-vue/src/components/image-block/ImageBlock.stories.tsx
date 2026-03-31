import { Chip, ChipGroup, IconButton, ImageBlock } from '@lumx/vue';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/ImageBlock/Stories';

const { meta, ...stories } = setup({
    component: ImageBlock,
    components: { Chip, ChipGroup, IconButton },
    decorators: { withNestedProps, withWrapper },
});

export default { title: 'LumX components/image-block/Image Block', ...meta };

export const WithCaptionBelow = { ...stories.WithCaptionBelow };
export const WithCaptionOver = { ...stories.WithCaptionOver };
export const WithAlign = { ...stories.WithAlign };
export const WithTags = { ...stories.WithTags };
export const WithActions = { ...stories.WithActions };
export const WithFocusPointHorizontal = { ...stories.WithFocusPointHorizontal };
export const WithFocusPointVertical = { ...stories.WithFocusPointVertical };
export const FullFeatured = { ...stories.FullFeatured };
