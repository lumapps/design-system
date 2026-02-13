import { AspectRatio, Badge, ColorPalette, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { mdiHeart } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/Badge/Stories';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

const { meta, ...stories } = setup({
    component: Badge,
    decorators: { withCombinations },
    overrides: {
        WithIcon: {
            args: {
                children: <Icon icon={mdiHeart} />,
            },
        },
    },
});

export default {
    title: 'LumX components/badge/Badge',
    ...meta,
};

export const WithText = { ...stories.WithText };
export const WithIcon = { ...stories.WithIcon };

/**
 * Using badge with thumbnail children
 * NOTE: This story is not in core because Thumbnail component is not yet migrated to @lumx/core
 */
export const WithThumbnail = {
    args: {
        children: (
            <Thumbnail
                alt="Logo"
                aspectRatio={AspectRatio.square}
                image="/logo.svg"
                size={Size.xxs}
                variant={ThumbnailVariant.rounded}
            />
        ),
    },
};

/**
 * All combinations of colors and children types
 * NOTE: Overriding decorators to add React-specific JSX (Icon, Thumbnail components)
 */
export const AllColors = {
    ...stories.AllColors,
    decorators: [
        withCombinations({
            combinations: {
                cols: {
                    key: 'color',
                    options: withUndefined(ColorPalette),
                },
                rows: {
                    'With text': { children: <span>30</span> },
                    'With icon': { children: <Icon icon={mdiHeart} /> },
                    'With thumbnail': {
                        children: (
                            <Thumbnail
                                alt="Logo"
                                aspectRatio={AspectRatio.square}
                                image="/logo.svg"
                                size={Size.xxs}
                                variant={ThumbnailVariant.rounded}
                            />
                        ),
                    },
                },
            },
        }),
    ],
};
