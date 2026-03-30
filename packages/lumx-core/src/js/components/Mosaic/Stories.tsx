import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { IMAGES } from '@lumx/core/stories/controls/image';
import { DEFAULT_PROPS } from '.';

/**
 * Setup Mosaic stories for a specific framework (React or Vue).
 * Framework-specific decorators are injected via `decorators`.
 * Per-story overrides (e.g. framework-specific argTypes) are injected via `overrides`.
 */
export function setup({
    component: Mosaic,
    decorators: { withWrapper },
    overrides,
}: SetupStoriesOptions<{
    decorators: 'withWrapper';
    overrides:
        | 'OneThumbnailClickable'
        | 'TwoThumbnailClickable'
        | 'ThreeThumbnailClickable'
        | 'FourThumbnailClickable'
        | 'FiveThumbnailClickable'
        | 'SixThumbnailClickable';
}>) {
    const meta = {
        component: Mosaic,
        render: (args: any) => <Mosaic {...args} />,
        args: DEFAULT_PROPS,
        argTypes: {},
        decorators: [withWrapper({ style: { width: '250px' } })],
    };

    const OneThumbnail = {
        args: {
            thumbnails: [{ image: IMAGES.landscape1 }],
        },
    };

    const OneThumbnailClickable = {
        ...OneThumbnail,
        ...overrides?.OneThumbnailClickable,
    };

    const TwoThumbnail = {
        args: {
            thumbnails: [...OneThumbnail.args.thumbnails, { image: IMAGES.landscape2 }],
        },
    };

    const TwoThumbnailClickable = {
        ...TwoThumbnail,
        ...overrides?.TwoThumbnailClickable,
    };

    const ThreeThumbnail = {
        args: {
            thumbnails: [...TwoThumbnail.args.thumbnails, { image: IMAGES.landscape3 }],
        },
    };

    const ThreeThumbnailClickable = {
        ...ThreeThumbnail,
        ...overrides?.ThreeThumbnailClickable,
    };

    const FourThumbnail = {
        args: {
            thumbnails: [...ThreeThumbnail.args.thumbnails, { image: IMAGES.portrait1 }],
        },
    };

    const FourThumbnailClickable = {
        ...FourThumbnail,
        ...overrides?.FourThumbnailClickable,
    };

    const FiveThumbnail = {
        args: {
            thumbnails: [...FourThumbnail.args.thumbnails, { image: IMAGES.portrait2 }],
        },
    };

    const FiveThumbnailClickable = {
        ...FiveThumbnail,
        ...overrides?.FiveThumbnailClickable,
    };

    const SixThumbnail = {
        args: {
            thumbnails: [...FiveThumbnail.args.thumbnails, { image: IMAGES.portrait3 }],
        },
    };

    const SixThumbnailClickable = {
        ...SixThumbnail,
        ...overrides?.SixThumbnailClickable,
    };

    return {
        meta,
        OneThumbnail,
        OneThumbnailClickable,
        TwoThumbnail,
        TwoThumbnailClickable,
        ThreeThumbnail,
        ThreeThumbnailClickable,
        FourThumbnail,
        FourThumbnailClickable,
        FiveThumbnail,
        FiveThumbnailClickable,
        SixThumbnail,
        SixThumbnailClickable,
    };
}
