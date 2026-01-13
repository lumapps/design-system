import { mdiHeart } from '@lumx/icons';
import { AspectRatio, Badge, ColorPalette, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

export default {
    title: 'LumX components/badge/Badge',
    component: Badge,
    argTypes: {
        color: colorArgType,
        children: { control: false },
    },
};

/**
 * Using badge with text children
 */
export const WithText = {
    args: { children: <span>30</span> },
};

/**
 * Using badge with icon children
 */
export const WithIcon = {
    args: { children: <Icon icon={mdiHeart} /> },
};

/**
 * Using badge with thumbnail children
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
 */
export const AllColors = {
    argTypes: {
        color: { control: false },
    },
    decorators: [
        withCombinations({
            combinations: {
                cols: {
                    key: 'color',
                    options: withUndefined(ColorPalette),
                },
                rows: {
                    'With text': WithText.args,
                    'With icon': WithIcon.args,
                    'With thumbnail': WithThumbnail.args,
                },
            },
        }),
    ],
};
