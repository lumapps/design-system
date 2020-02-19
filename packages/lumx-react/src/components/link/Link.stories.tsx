import { ColorPalette, ColorVariant, Link } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

const colors = {
    Blue: ColorPalette.blue,
    Dark: ColorPalette.dark,
    Green: ColorPalette.green,
    Light: ColorPalette.light,
    Primary: ColorPalette.primary,
    Red: ColorPalette.red,
    Secondary: ColorPalette.secondary,
    Yellow: ColorPalette.yellow,
};

const colorVariants = {
    D1: ColorVariant.D1,
    D2: ColorVariant.D2,
    L1: ColorVariant.L1,
    L2: ColorVariant.L2,
    L3: ColorVariant.L3,
    L4: ColorVariant.L4,
    L5: ColorVariant.L5,
    L6: ColorVariant.L6,
    N: ColorVariant.N,
};

export default { title: 'Link' };

export const simpleLink = () => (
    <Link
        href={text('Href', 'https://google.com')}
        target={boolean('target blank', false) && '_blank'}
        color={select('Color', colors, ColorPalette.blue)}
        colorVariant={select('Color Variant', colorVariants, ColorVariant.N)}
    >
        {text('Value', 'Here is a link')}
    </Link>
);
