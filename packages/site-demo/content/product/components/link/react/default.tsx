import React from 'react';

import { mdiPencil } from '@lumx/icons';
import { Alignment, FlexBox, Icon, Link, Orientation, Size } from '@lumx/react';
import { boolean, text } from '@storybook/addon-knobs';

const App = () => (
    <>
        <Link href={text('href', '#', 'Link 1')} target={boolean('target: _blank', false, 'Link 1') ? '_blank' : ''}>
            {text('Value', 'Default link', 'Link 1')}
        </Link>
        <br />
        <br />
        <Link href={text('href', '#', 'Link 2')} target={boolean('target: _blank', false, 'Link 2') ? '_blank' : ''}>
            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                <Icon icon={mdiPencil} size={Size.xs} className="lumx-spacing-margin-right-tiny" />
                {text('Value', 'Link with an icon', 'Link 2')}
            </FlexBox>
        </Link>
        <br />
        <br />
        <Link href={text('href', '#', 'Link 3')} target={boolean('target: _blank', false, 'Link 3') ? '_blank' : ''}>
            <span className="lumx-typography-title">{text('Value', 'Link with Title typography', 'Link 3')}</span>
        </Link>
    </>
);

export default App;
