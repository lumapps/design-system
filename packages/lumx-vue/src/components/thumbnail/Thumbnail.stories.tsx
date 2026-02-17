import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Thumbnail/Stories';
import { Thumbnail } from '@lumx/vue';
import ThumbnailClickable from './Stories/ThumbnailClickable.vue';

const { meta, ...stories } = setup({
    component: Thumbnail,
    decorators: { withNestedProps, withWrapper, withCombinations },
});

export default {
    title: 'LumX components/thumbnail/Thumbnail',
    ...meta,
};

export const Simple = { ...stories.Simple };
export const IsLoading = { ...stories.IsLoading };
export const WithoutSource = { ...stories.WithoutSource };
export const FocusPointVertical = { ...stories.FocusPointVertical };
export const FocusPointHorizontal = { ...stories.FocusPointHorizontal };
export const AsButton = { ...stories.AsButton, render: withRender({ ThumbnailClickable }) };
export const AsLink = { ...stories.AsLink };
export const FillHeightAndRatio = { ...stories.FillHeightAndRatio };
export const WithSvgImages = { ...stories.WithSvgImages };
export const ObjectFit = { ...stories.ObjectFit };
