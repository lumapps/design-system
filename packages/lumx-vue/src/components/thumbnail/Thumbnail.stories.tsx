import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Thumbnail/Stories';
import { Thumbnail, AspectRatio, Size } from '@lumx/vue';
import { IMAGES } from '@lumx/core/stories/controls/image';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { ThumbnailObjectFit } from '@lumx/core/js/components/Thumbnail/types';
import ThumbnailClickable from './Stories/ThumbnailClickable.vue';

const { meta, ...stories } = setup({
    component: Thumbnail,
    decorators: { withNestedProps },
    overrides: {
        Simple: {
            args: { image: IMAGES.landscape1s200 },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
            ],
        },
        FillHeightAndRatio: {
            args: { image: IMAGES.landscape1s200, fillHeight: true },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
                withCombinations({
                    combinations: { rows: { key: 'aspectRatio', options: withUndefined(AspectRatio) } },
                }),
            ],
        },
        ObjectFit: {
            args: { size: Size.xl },
            decorators: [
                withCombinations({
                    cellStyle: { border: '1px solid lightgray' },
                    combinations: {
                        cols: {
                            'Default (cover)': {},
                            contain: { objectFit: ThumbnailObjectFit.contain },
                        },
                        rows: {
                            'Ratio square': { aspectRatio: AspectRatio.square },
                            'Ratio wide': { aspectRatio: AspectRatio.wide },
                            'Ratio vertical': { aspectRatio: AspectRatio.vertical },
                        },
                        sections: {
                            'Portrait image': { image: IMAGES.portrait1 },
                            'Landscape image': { image: IMAGES.landscape1 },
                        },
                    },
                }),
                withWrapper({ maxColumns: 3, itemMinWidth: 350 }),
            ],
        },
    },
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
