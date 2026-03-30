import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Mosaic/Stories';
import { Mosaic } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Mosaic,
    decorators: { withWrapper },
    overrides: {
        OneThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
        TwoThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
        ThreeThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
        FourThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
        FiveThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
        SixThumbnailClickable: { argTypes: { onHandleClick: { action: true } } },
    },
});

export default { title: 'LumX components/mosaic/Mosaic', ...meta };

export const OneThumbnail = { ...stories.OneThumbnail };
export const OneThumbnailClickable = { ...stories.OneThumbnailClickable };
export const TwoThumbnail = { ...stories.TwoThumbnail };
export const TwoThumbnailClickable = { ...stories.TwoThumbnailClickable };
export const ThreeThumbnail = { ...stories.ThreeThumbnail };
export const ThreeThumbnailClickable = { ...stories.ThreeThumbnailClickable };
export const FourThumbnail = { ...stories.FourThumbnail };
export const FourThumbnailClickable = { ...stories.FourThumbnailClickable };
export const FiveThumbnail = { ...stories.FiveThumbnail };
export const FiveThumbnailClickable = { ...stories.FiveThumbnailClickable };
export const SixThumbnail = { ...stories.SixThumbnail };
export const SixThumbnailClickable = { ...stories.SixThumbnailClickable };
