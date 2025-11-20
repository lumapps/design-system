import {
    Alignment,
    AspectRatio,
    Chip,
    ChipGroup,
    HorizontalAlignment,
    IconButton,
    ImageBlock,
    ImageBlockCaptionPosition,
    ImageBlockSize,
    Size,
} from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { imageArgType, PORTRAIT_IMAGES, LANDSCAPE_IMAGES } from '@lumx/react/stories/controls/image';
import { mdiFileEdit } from '@lumx/icons';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { focusPoint } from '@lumx/react/stories/controls/focusPoint';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

export default {
    title: 'LumX components/image-block/Image Block',
    component: ImageBlock,
    argTypes: {
        size: getSelectArgType<ImageBlockSize>([Size.xl, Size.xxl]),
        image: imageArgType,
        captionPosition: getSelectArgType(ImageBlockCaptionPosition),
        'thumbnailProps.aspectRatio': getSelectArgType(AspectRatio),
        align: getSelectArgType<HorizontalAlignment>([Alignment.left, Alignment.center, Alignment.right]),
        tags: { control: false },
        actions: { control: false },
    },
    args: { ...ImageBlock.defaultProps, image: LANDSCAPE_IMAGES.landscape1 },
    decorators: [withNestedProps()],
};

export const WithCaptionBelow = {
    args: {
        captionPosition: ImageBlockCaptionPosition.below,
        size: Size.xxl,
        title: 'Image block title',
        description: 'Image block description',
    },
};

export const WithCaptionOver = {
    args: {
        captionPosition: ImageBlockCaptionPosition.over,
        size: Size.xxl,
        title: 'Image block title',
        description: 'Image block description',
    },
};

export const WithAlign = {
    args: {
        ...WithCaptionBelow.args,
        image: LANDSCAPE_IMAGES.landscape1s200,
        size: undefined,
        align: Alignment.center,
    },
};

export const WithTags = {
    args: {
        size: Size.xxl,
        tags: (
            <ChipGroup align={Alignment.left}>
                <Chip size={Size.s}>Tag 1</Chip>
                <Chip size={Size.s}>Tag 2</Chip>
            </ChipGroup>
        ),
    },
};

export const WithActions = {
    args: {
        size: Size.xxl,
        actions: <IconButton label="Edit" icon={mdiFileEdit} />,
    },
};

export const WithFocusPointHorizontal = {
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

export const WithFocusPointVertical = {
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
export const FullFeatured = {
    args: {
        ...WithCaptionBelow.args,
        ...WithTags.args,
        ...WithActions.args,
        ...WithFocusPointVertical.args,
        ...WithAlign.args,
    },
    decorators: [withWrapper({ style: { width: 400, height: 300 } })],
};
