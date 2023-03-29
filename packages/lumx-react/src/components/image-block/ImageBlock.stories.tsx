import React from 'react';

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
import { toNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { focusPoint } from '@lumx/react/stories/controls/focusPoint';

export default {
    title: 'LumX components/image-block/Image Block',
    argTypes: {
        size: getSelectArgType<ImageBlockSize>([Size.xl, Size.xxl]),
        image: imageArgType,
        captionPosition: getSelectArgType(ImageBlockCaptionPosition),
        'thumbnailProps.aspectRatio': getSelectArgType(AspectRatio),
        align: getSelectArgType<HorizontalAlignment>([Alignment.left, Alignment.center, Alignment.right]),
    },
    args: { ...ImageBlock.defaultProps, image: LANDSCAPE_IMAGES.landscape1 },
};

export const Default = (props: any) => {
    const nestedProps = toNestedProps(props) as any;
    return <ImageBlock {...nestedProps} />;
};

export const WithCaptionBelow: any = Default.bind({});
WithCaptionBelow.args = {
    captionPosition: ImageBlockCaptionPosition.below,
    size: Size.xxl,
    title: 'Image block title',
    description: 'Image block description',
};

export const WithCaptionOver: any = Default.bind({});
WithCaptionOver.args = {
    captionPosition: ImageBlockCaptionPosition.over,
    size: Size.xxl,
    title: 'Image block title',
    description: 'Image block description',
};

export const WithAlign: any = Default.bind({});
WithAlign.args = {
    ...WithCaptionBelow.args,
    image: LANDSCAPE_IMAGES.landscape1s200,
    size: undefined,
    align: Alignment.center,
};

export const WithTags: any = Default.bind({});
WithTags.argTypes = {
    tags: { control: false },
};
WithTags.args = {
    size: Size.xxl,
    tags: (
        <ChipGroup align={Alignment.left}>
            <Chip size={Size.s}>Tag 1</Chip>
            <Chip size={Size.s}>Tag 2</Chip>
        </ChipGroup>
    ),
};

export const WithActions: any = Default.bind({});
WithActions.argTypes = {
    actions: { control: false },
};
WithActions.args = {
    size: Size.xxl,
    actions: <IconButton label="Edit" icon={mdiFileEdit} />,
};

export const WithFocusPointHorizontal: any = Default.bind({});
WithFocusPointHorizontal.args = {
    size: Size.xxl,
    'thumbnailProps.aspectRatio': AspectRatio.vertical,
    'thumbnailProps.focusPoint.x': 1,
    'thumbnailProps.focusPoint.y': 0,
};
WithFocusPointHorizontal.argTypes = {
    'thumbnailProps.focusPoint.x': focusPoint,
    'thumbnailProps.focusPoint.y': focusPoint,
};

export const WithFocusPointVertical: any = Default.bind({});
WithFocusPointVertical.args = {
    size: Size.xxl,
    image: PORTRAIT_IMAGES.portrait1,
    'thumbnailProps.aspectRatio': AspectRatio.horizontal,
    'thumbnailProps.focusPoint.x': 0,
    'thumbnailProps.focusPoint.y': 1,
};
WithFocusPointVertical.argTypes = {
    'thumbnailProps.focusPoint.x': focusPoint,
    'thumbnailProps.focusPoint.y': focusPoint,
};
