import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';

const avatar1 = '/demo-assets/avatar1.jpg';
const avatar2 = '/demo-assets/avatar2.jpg';
const avatar3 = '/demo-assets/avatar3.jpg';
const avatar4 = '/demo-assets/avatar4.jpg';
const landscape1 = '/demo-assets/landscape1.jpg';
const landscape2 = '/demo-assets/landscape2.jpg';
const landscape1s200 = '/demo-assets/landscape1-s200.jpg';
const landscape3 = '/demo-assets/landscape3.jpg';
const portrait1 = '/demo-assets/portrait1.jpg';
const portrait1s200 = '/demo-assets/portrait1-s200.jpg';
const portrait2 = '/demo-assets/portrait2.jpg';
const portrait3 = '/demo-assets/portrait3.jpg';
const square1 = '/demo-assets/square1.jpg';
const square2 = '/demo-assets/square2.jpg';
const defaultSvg = '/demo-assets/defaultSvg.svg';
const emptyImage = '';

export const AVATAR_IMAGES = { avatar1, avatar2, avatar3, avatar4 };
export const SQUARE_IMAGES = { square1, square2 };
export const SVG_IMAGES = { defaultSvg };
export const EMPTY_IMAGES = { emptyImage };
export const LANDSCAPE_IMAGES = { landscape1, landscape1s200, landscape2, landscape3 };
export const LANDSCAPE_IMAGES_ALT: { [key in keyof typeof LANDSCAPE_IMAGES]: string } = {
    landscape1: 'A majestic snowy mountain range with a peak covered in glistening snow',
    landscape1s200: 'A majestic snowy mountain range with a peak covered in glistening snow',
    landscape2: 'A colorful rack of shirts displaying various hues and styles',
    landscape3: 'An open book resting on a table, ready to be explored and read',
};
export const PORTRAIT_IMAGES = { portrait1, portrait1s200, portrait2, portrait3 };
export const IMAGES = {
    ...LANDSCAPE_IMAGES,
    ...PORTRAIT_IMAGES,
    ...SQUARE_IMAGES,
    ...AVATAR_IMAGES,
    ...SVG_IMAGES,
    ...EMPTY_IMAGES,
};

export const avatarImageArgType = getSelectArgType(AVATAR_IMAGES);
export const squareImageArgType = getSelectArgType(SQUARE_IMAGES);
export const landscapeImageArgType = getSelectArgType(LANDSCAPE_IMAGES);
export const portraitImageArgType = getSelectArgType(PORTRAIT_IMAGES);
export const imageArgType = getSelectArgType(IMAGES);

type Size = { width: number; height: number };

export const AVATAR_IMAGE_SIZES: Record<keyof typeof AVATAR_IMAGES, Size> = {
    avatar1: { width: 128, height: 128 },
    avatar2: { width: 150, height: 150 },
    avatar3: { width: 128, height: 128 },
    avatar4: { width: 128, height: 128 },
};
export const SQUARE_IMAGE_SIZES: Record<keyof typeof SQUARE_IMAGES, Size> = {
    square1: { width: 72, height: 72 },
    square2: { width: 300, height: 300 },
};
export const LANDSCAPE_IMAGE_SIZES: Record<keyof typeof LANDSCAPE_IMAGES, Size> = {
    landscape1: { width: 800, height: 546 },
    landscape1s200: { width: 200, height: 150 },
    landscape2: { width: 800, height: 600 },
    landscape3: { width: 640, height: 480 },
};
export const PORTRAIT_IMAGE_SIZES: Record<keyof typeof PORTRAIT_IMAGES, Size> = {
    portrait1: { width: 275, height: 500 },
    portrait1s200: { width: 200, height: 364 },
    portrait2: { width: 350, height: 500 },
    portrait3: { width: 300, height: 500 },
};
export const SVG_IMAGE_SIZES: Record<keyof typeof SVG_IMAGES, Size> = {
    defaultSvg: { width: 0, height: 0 },
};
export const EMPTY_IMAGES_SIZES: Record<keyof typeof EMPTY_IMAGES, Size> = {
    emptyImage: { width: 0, height: 0 },
};
export const IMAGE_SIZES: Record<keyof typeof IMAGES, Size> = {
    ...LANDSCAPE_IMAGE_SIZES,
    ...PORTRAIT_IMAGE_SIZES,
    ...SQUARE_IMAGE_SIZES,
    ...AVATAR_IMAGE_SIZES,
    ...SVG_IMAGE_SIZES,
    ...EMPTY_IMAGES_SIZES,
};
