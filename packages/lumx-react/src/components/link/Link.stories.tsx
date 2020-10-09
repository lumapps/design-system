import { ColorPalette, ColorVariant, Link } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/link/Link' };

export const simpleLink = () => (
    <>
        <Link
            href={text('href', 'https://google.com', 'Link 1')}
            target={boolean('target: _blank', false, 'Link 1') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 1')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 1')}
        >
            {text('Value', 'Here is a first link', 'Link 1')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.fr', 'Link 2')}
            target={boolean('target: _blank', false, 'Link 2') ? '_blank' : ''}
        >
            {text('Value', 'Here is a second link', 'Link 2')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.co.jp', 'Link 3')}
            target={boolean('target: _blank', false, 'Link 3') ? '_blank' : ''}
        >
            {text('Value', 'Here is a third link', 'Link 3')}
        </Link>
    </>
);

const CustomLink: React.FC = ({ children, ...props }) =>
    React.createElement('a', { ...props, style: { color: 'red' } }, children);

export const withCustomLink = () => <Link linkAs={CustomLink}>My link text</Link>;
