import { ColorPalette, ColorVariant, Link } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Link' };

export const SimpleLink = () => (
    <Link
        href={text('Href', 'https://google.com')}
        target={boolean('target blank', false) ? '_blank' : ''}
        color={select('Color', ColorPalette, ColorPalette.blue)}
        colorVariant={select('Color Variant', ColorVariant, ColorVariant.N)}
    >
        {text('Value', 'Here is a link')}
    </Link>
);
