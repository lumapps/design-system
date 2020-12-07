import { select } from '@storybook/addon-knobs';

import avatar1 from '../demo-assets/avatar1.jpg';
import avatar2 from '../demo-assets/avatar2.jpg';
import avatar3 from '../demo-assets/avatar3.jpg';
import avatar4 from '../demo-assets/avatar4.jpg';
import landscape1 from '../demo-assets/landscape1.jpg';
import landscape2 from '../demo-assets/landscape2.jpg';
import landscape3 from '../demo-assets/landscape3.jpg';
import portrait1 from '../demo-assets/portrait1.jpg';
import portrait2 from '../demo-assets/portrait2.jpg';
import portrait3 from '../demo-assets/portrait3.jpg';
import square1 from '../demo-assets/square1.jpg';
import square2 from '../demo-assets/square2.jpg';

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
