import { mdiChevronDown, mdiLink } from '@lumx/icons';
import { ColorPalette, ColorVariant, Link, Typography } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React, { Fragment } from 'react';

export default { title: 'LumX components/link/Link' };

// tslint:disable-next-line:no-console
const onClick = () => console.log('clicked link');

export const simpleLink = () => (
    <>
        <Link
            href={text('href', 'https://google.com', 'Link 1')}
            target={boolean('target: _blank', false, 'Link 1') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 1')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 1')}
            typography={select('Typography', Typography, Typography.body2, 'Link 1')}
        >
            {text('Value', 'Here is a first link', 'Link 1')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.fr', 'Link 2')}
            target={boolean('target: _blank', false, 'Link 2') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 2')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 2')}
            typography={select('Typography', Typography, Typography.body1, 'Link 2')}
        >
            {text('Value', 'Here is a second link', 'Link 2')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.co.jp', 'Link 3')}
            target={boolean('target: _blank', false, 'Link 3') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 3')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 3')}
            typography={select('Typography', Typography, Typography.caption, 'Link 3')}
        >
            {text('Value', 'Here is a third link', 'Link 3')}
        </Link>
    </>
);

export const withoutHref = () => <Link onClick={onClick}>Link without redirection</Link>;

const CustomLink: React.FC = ({ children, ...props }) =>
    React.createElement('a', { ...props, style: { color: 'red' } }, children);

export const withCustomLink = () => (
    <Link linkAs={CustomLink} href="https://google.com">
        Custom link
    </Link>
);

export const disabledLink = () => (
    <Link onClick={onClick} disabled>
        Disabled link
    </Link>
);

export const withIcon = () => (
    <>
        {Object.values(Typography).map((typography) => (
            <Fragment key={typography}>
                <p>
                    <Link rightIcon={mdiLink} href="https://www.google.com" typography={typography}>
                        With right icon
                    </Link>
                </p>
                <p>
                    <Link leftIcon={mdiChevronDown} href="https://www.google.com" typography={typography}>
                        With left icon
                    </Link>
                </p>
                <p>
                    <Link
                        leftIcon={mdiChevronDown}
                        rightIcon={mdiLink}
                        href="https://www.google.com"
                        typography={typography}
                    >
                        With right and left icon
                    </Link>
                </p>
            </Fragment>
        ))}
    </>
);
