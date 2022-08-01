/* eslint-disable jsx-a11y/anchor-is-valid */
import { mdiChevronDown, mdiLink } from '@lumx/icons';
import {
    ColorPalette,
    ColorVariant,
    Link,
    Typography,
    TypographyCustom,
    TypographyInterface,
    TypographyTitleCustom,
} from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import React, { Fragment } from 'react';

export default { title: 'LumX components/link/Link' };

const onClick = () => console.log('clicked link');

const linkTypographies = { ...TypographyInterface, ...TypographyTitleCustom };

export const SimpleLink = () => (
    <>
        <Link
            href={text('href', 'https://example.com', 'Link 1')}
            target={boolean('target: _blank', false, 'Link 1') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 1')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 1')}
            typography={select('Typography', linkTypographies, Typography.body2, 'Link 1')}
        >
            {text('Value', 'Here is a first link', 'Link 1')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.fr', 'Link 2')}
            target={boolean('target: _blank', false, 'Link 2') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 2')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 2')}
            typography={select('Typography', linkTypographies, Typography.body1, 'Link 2')}
        >
            {text('Value', 'Here is a second link', 'Link 2')}
        </Link>
        <br />
        <Link
            href={text('href', 'https://google.co.jp', 'Link 3')}
            target={boolean('target: _blank', false, 'Link 3') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.blue, 'Link 3')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 3')}
            typography={select('Typography', linkTypographies, Typography.caption, 'Link 3')}
        >
            {text('Value', 'Here is a third link', 'Link 3')}
        </Link>
    </>
);

export const WithoutHref = () => (
    // The constrained width should show that the button does not have centered text align.
    <div style={{ border: '1px solid red', width: 100, height: 100, resize: 'both', overflow: 'auto' }}>
        <Link onClick={onClick}>Link without href (renders as a button for a11y)</Link>
    </div>
);

export const WithCustomLink = () => {
    const CustomLink: React.FC = ({ children, ...props }) =>
        React.createElement('a', { ...props, style: { color: 'red' } }, children);

    return (
        <Link linkAs={CustomLink} href="https://example.com">
            Custom link
        </Link>
    );
};

export const DisabledLink = () => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link onClick={onClick} disabled>
        Disabled link
    </Link>
);

export const WithCustomizableTypography = () => (
    <>
        <style>{`
        :root {
            --lumx-typography-custom-title1-font-size: 5px;
        }
        `}</style>
        <Link typography={Typography.custom.title1} href="https://example.com">
            Link with customizable `body` typography
        </Link>
    </>
);

export const AllTypography = () => {
    const typographies = [undefined, ...Object.values(TypographyInterface), ...Object.values(TypographyCustom)];
    return (
        <table>
            {typographies.map((typography) => (
                <tr key={typography}>
                    <td>{typography}</td>
                    <td>
                        <Link
                            leftIcon={mdiChevronDown}
                            rightIcon={mdiLink}
                            typography={typography}
                            href="https://example.com"
                        >
                            Link text
                        </Link>
                    </td>
                </tr>
            ))}
        </table>
    );
};

export const AllColor = () => {
    const colorVariants = [undefined, ...Object.values(ColorVariant)];
    const colors = [undefined, ...Object.values(ColorPalette)];
    return (
        <table style={{ borderCollapse: 'separate', borderSpacing: 5 }}>
            <tr>
                <td />
                {colorVariants.map((colorVariant) => (
                    <td key={colorVariant}>{colorVariant}</td>
                ))}
            </tr>
            {colors.map((color) => (
                <tr key={color}>
                    <td>{color}</td>
                    {colorVariants.map((colorVariant) => (
                        <td key={colorVariant}>
                            <Link href="https://example.com" color={color} colorVariant={colorVariant}>
                                Some text
                            </Link>
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};
