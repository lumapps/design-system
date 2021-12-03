import { select } from '@storybook/addon-knobs';

const avatar1 = '/demo-assets/avatar1.jpg';
const avatar2 = '/demo-assets/avatar2.jpg';
const avatar3 = '/demo-assets/avatar3.jpg';
const avatar4 = '/demo-assets/avatar4.jpg';
const landscape1 = '/demo-assets/landscape1.jpg';
const landscape2 = '/demo-assets/landscape2.jpg';
const landscape3 = '/demo-assets/landscape3.jpg';
const portrait1 = '/demo-assets/portrait1.jpg';
const portrait2 = '/demo-assets/portrait2.jpg';
const portrait3 = '/demo-assets/portrait3.jpg';
const square1 = '/demo-assets/square1.jpg';
const square2 = '/demo-assets/square2.jpg';

export const AVATAR_IMAGES = { avatar1, avatar2, avatar3, avatar4 };

export const SQUARE_IMAGES = { square1, square2 };
export const LANDSCAPE_IMAGES = { landscape1, landscape2, landscape3 };
export const PORTRAIT_IMAGES = { portrait1, portrait2, portrait3 };

export const IMAGES = { ...LANDSCAPE_IMAGES, ...PORTRAIT_IMAGES, ...SQUARE_IMAGES, ...AVATAR_IMAGES };

export const avatarImageKnob = (name = 'Avatar', value = Object.values(AVATAR_IMAGES)[0], groupId?: string) =>
    select(name, AVATAR_IMAGES, value, groupId);

export const landscapeImageKnob = (name = 'Image', value = Object.values(LANDSCAPE_IMAGES)[0], groupId?: string) =>
    select(name, LANDSCAPE_IMAGES, value, groupId);

export const portraitImageKnob = (name = 'Image', value = Object.values(PORTRAIT_IMAGES)[0], groupId?: string) =>
    select(name, PORTRAIT_IMAGES, value, groupId);

export const squareImageKnob = (name = 'Image', value = Object.values(SQUARE_IMAGES)[0], groupId?: string) =>
    select(name, SQUARE_IMAGES, value, groupId);

export const imageKnob = (name = 'Image', value = Object.values(IMAGES)[0], groupId?: string) =>
    select(name, IMAGES, value, groupId);
