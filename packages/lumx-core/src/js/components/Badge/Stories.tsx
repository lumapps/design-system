import { colorArgType } from '@lumx/core/stories/controls/color';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiHeart } from '@lumx/icons';
import { AspectRatio, ColorPalette, Size } from '../../constants';
import { ThumbnailVariant } from '../Thumbnail/types';
import { DEFAULT_PROPS } from '.';

/**
 * Setup Badge stories for a specific framework (React or Vue).
 * Framework-specific components (Icon, Thumbnail, etc.) are injected via `components`.
 */
export function setup({
    component: Badge,
    components: { Icon, Thumbnail, FlexBox },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Icon: any; Thumbnail: any; FlexBox: any };
}>) {
    const meta = {
        component: Badge,
        render: (args: any) => <Badge {...args} />,
        argTypes: {
            color: colorArgType,
        },
        args: DEFAULT_PROPS,
    };

    /** Using badge with text children */
    const WithText = {
        render: (args: any) => (
            <Badge {...args}>
                <span>30</span>
            </Badge>
        ),
    };

    /** Using badge with icon children */
    const WithIcon = {
        render: (args: any) => (
            <Badge {...args}>
                <Icon icon={mdiHeart} />
            </Badge>
        ),
    };

    /** Using badge with thumbnail children */
    const WithThumbnail = {
        render: (args: any) => (
            <Badge {...args}>
                <Thumbnail
                    alt="Logo"
                    aspectRatio={AspectRatio.square}
                    image="/logo.svg"
                    size={Size.xxs}
                    variant={ThumbnailVariant.rounded}
                />
            </Badge>
        ),
    };

    /** All combinations of colors and children types */
    const AllColors = {
        render: (args: any) => (
            <FlexBox orientation="vertical" gap="regular">
                {WithText.render(args)}
                {WithIcon.render(args)}
                {WithThumbnail.render(args)}
            </FlexBox>
        ),
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
                },
            }),
        ],
    };

    return { meta, WithText, WithIcon, WithThumbnail, AllColors };
}
