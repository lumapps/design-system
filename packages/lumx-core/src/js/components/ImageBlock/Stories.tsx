import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { imageArgType, LANDSCAPE_IMAGES, PORTRAIT_IMAGES } from '@lumx/core/stories/controls/image';
import { focusPoint } from '@lumx/core/stories/controls/focusPoint';
import { mdiFileEdit } from '@lumx/icons';
import { Alignment, AspectRatio, Size } from '../../constants';
import { DEFAULT_PROPS, ImageBlockCaptionPosition } from '.';

export function setup({
    component: ImageBlock,
    components: { Chip, ChipGroup, IconButton },
    decorators: { withNestedProps, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withNestedProps' | 'withWrapper';
    components: { Chip: any; ChipGroup: any; IconButton: any };
}>) {
    const meta = {
        component: ImageBlock,
        argTypes: {
            size: getSelectArgType([Size.xl, Size.xxl]),
            image: imageArgType,
            captionPosition: getSelectArgType(ImageBlockCaptionPosition),
            'thumbnailProps.aspectRatio': getSelectArgType(AspectRatio),
            align: getSelectArgType([Alignment.left, Alignment.center, Alignment.right]),
            tags: { control: false },
            actions: { control: false },
        },
        args: { ...DEFAULT_PROPS, image: LANDSCAPE_IMAGES.landscape1 },
        decorators: [withNestedProps()],
    };

    const WithCaptionBelow = {
        args: {
            captionPosition: ImageBlockCaptionPosition.below,
            size: Size.xxl,
            title: 'Image block title',
            description: 'Image block description',
        },
    };

    const WithCaptionOver = {
        args: {
            captionPosition: ImageBlockCaptionPosition.over,
            size: Size.xxl,
            title: 'Image block title',
            description: 'Image block description',
        },
    };

    const WithAlign = {
        args: {
            ...WithCaptionBelow.args,
            image: LANDSCAPE_IMAGES.landscape1s200,
            size: undefined,
            align: Alignment.center,
        },
    };

    const WithTags = {
        render: ({ tags, ...args }: any) => (
            <ImageBlock
                {...args}
                tags={
                    <ChipGroup align={Alignment.left}>
                        <Chip size={Size.s}>Tag 1</Chip>
                        <Chip size={Size.s}>Tag 2</Chip>
                    </ChipGroup>
                }
            />
        ),
        args: { size: Size.xxl },
    };

    const WithActions = {
        render: ({ actions, ...args }: any) => (
            <ImageBlock {...args} actions={<IconButton label="Edit" icon={mdiFileEdit} />} />
        ),
        args: { size: Size.xxl },
    };

    const WithFocusPointHorizontal = {
        args: {
            size: Size.xxl,
            'thumbnailProps.aspectRatio': AspectRatio.vertical,
            'thumbnailProps.focusPoint.x': 1,
            'thumbnailProps.focusPoint.y': 0,
        },
        argTypes: {
            'thumbnailProps.focusPoint.x': focusPoint,
            'thumbnailProps.focusPoint.y': focusPoint,
        },
    };

    const WithFocusPointVertical = {
        args: {
            size: Size.xxl,
            image: PORTRAIT_IMAGES.portrait1,
            'thumbnailProps.aspectRatio': AspectRatio.horizontal,
            'thumbnailProps.focusPoint.x': 0,
            'thumbnailProps.focusPoint.y': 1,
        },
        argTypes: {
            'thumbnailProps.focusPoint.x': focusPoint,
            'thumbnailProps.focusPoint.y': focusPoint,
        },
    };

    const FullFeatured = {
        render: ({ tags, actions, ...args }: any) => (
            <ImageBlock
                {...args}
                tags={
                    <ChipGroup align={Alignment.left}>
                        <Chip size={Size.s}>Tag 1</Chip>
                        <Chip size={Size.s}>Tag 2</Chip>
                    </ChipGroup>
                }
                actions={<IconButton label="Edit" icon={mdiFileEdit} />}
            />
        ),
        args: {
            ...WithCaptionBelow.args,
            ...WithFocusPointVertical.args,
            ...WithAlign.args,
        },
        decorators: [withWrapper({ style: { width: '400px', height: '300px' } })],
    };

    return {
        meta,
        WithCaptionBelow,
        WithCaptionOver,
        WithAlign,
        WithTags,
        WithActions,
        WithFocusPointHorizontal,
        WithFocusPointVertical,
        FullFeatured,
    };
}
