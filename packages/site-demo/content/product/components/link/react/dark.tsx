import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, ColorPalette, ColorVariant, FlexBox, Icon, Link, Orientation, Size } from '@lumx/react';
import { boolean, select, text } from '@storybook/addon-knobs';

const App = () => (
    <>
        <div className="lumx-color-background-dark-N lumx-spacing-padding-big">
            <Link
                href={text('href', '#', 'Link 7')}
                target={boolean('target: _blank', false, 'Link 7') ? '_blank' : ''}
                color={select('Color', ColorPalette, ColorPalette.light, 'Link 7')}
                colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 7')}
            >
                {text('Value', 'Default link', 'Link 7')}
            </Link>
            <br />
            <br />
            <Link
                href={text('href', '#', 'Link 8')}
                target={boolean('target: _blank', false, 'Link 8') ? '_blank' : ''}
                color={select('Color', ColorPalette, ColorPalette.light, 'Link 8')}
                colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 8')}
            >
                <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                    <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                    {text('Value', 'Link with an icon', 'Link 8')}
                </FlexBox>
            </Link>
            <br />
            <br />
            <Link
                href={text('href', '#', 'Link 9')}
                target={boolean('target: _blank', false, 'Link 9') ? '_blank' : ''}
                color={select('Color', ColorPalette, ColorPalette.light, 'Link 9')}
                colorVariant={select('Color Variant', ColorVariant, ColorVariant.N, 'Link 9')}
            >
                <span className="lumx-typography-title">{text('Value', 'Link with Title typography', 'Link 9')}</span>
            </Link>
        </div>
    </>
);

export default App;
