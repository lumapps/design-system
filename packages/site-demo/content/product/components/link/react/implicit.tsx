import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, ColorVariant, FlexBox, Icon, Link, Orientation, Size } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';

const App = () => (
    <>
        <Link
            href={text('href', '#', 'Link 4')}
            target={boolean('target: _blank', false, 'Link 4') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.dark, 'Link 4')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 4')}
        >
            {text('Value', 'Default link', 'Link 4')}
        </Link>
        <br />
        <br />
        <Link
            href={text('href', '#', 'Link 5')}
            target={boolean('target: _blank', false, 'Link 5') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.dark, 'Link 5')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 5')}
        >
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                {text('Value', 'Link with an icon', 'Link 5')}
            </FlexBox>
        </Link>
        <br />
        <br />
        <Link
            href={text('href', '#', 'Link 6')}
            target={boolean('target: _blank', false, 'Link 6') ? '_blank' : ''}
            color={select('Color', ColorPalette, ColorPalette.dark, 'Link 6')}
            colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 6')}
        >
            <span className="lumx-typography-title">{text('Value', 'Link with Title typography', 'Link 6')}</span>
        </Link>
    </>
);

export default App;
