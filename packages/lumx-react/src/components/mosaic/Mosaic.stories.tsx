import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { IMAGES } from '@lumx/core/stories/controls/image';
import { Mosaic } from './Mosaic';

export default {
    title: 'LumX components/mosaic/Mosaic',
    component: Mosaic,
    args: Mosaic.defaultProps,
    argTypes: {},
    decorators: [withWrapper({ style: { width: 250 } })],
};

export const OneThumbnail = {
    args: {
        thumbnails: [{ image: IMAGES.landscape1 }],
    },
};

export const OneThumbnailClickable = {
    ...OneThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};

export const TwoThumbnail = {
    args: {
        thumbnails: [...OneThumbnail.args.thumbnails, { image: IMAGES.landscape2 }],
    },
};

export const TwoThumbnailClickable = {
    ...TwoThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};

export const ThreeThumbnail = {
    args: {
        thumbnails: [...TwoThumbnail.args.thumbnails, { image: IMAGES.landscape3 }],
    },
};

export const ThreeThumbnailClickable = {
    ...ThreeThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};

export const FourThumbnail = {
    args: {
        thumbnails: [...ThreeThumbnail.args.thumbnails, { image: IMAGES.portrait1 }],
    },
};

export const FourThumbnailClickable = {
    ...FourThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};

export const FiveThumbnail = {
    args: {
        thumbnails: [...FourThumbnail.args.thumbnails, { image: IMAGES.portrait2 }],
    },
};

export const FiveThumbnailClickable = {
    ...FiveThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};

export const SixThumbnail = {
    args: {
        thumbnails: [...FiveThumbnail.args.thumbnails, { image: IMAGES.portrait3 }],
    },
};

export const SixThumbnailClickable = {
    ...SixThumbnail,
    argTypes: {
        onImageClick: { action: true },
    },
};
