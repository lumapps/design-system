import { LinkPreview, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <div style={{ width: 350 }}>
        <LinkPreview
            title={'Link title'}
            description={'Description'}
            link={'https://google.com'}
            size={Size.big}
            theme={theme}
            thumbnail="/demo-assets/landscape3.jpg"
        />
    </div>
);
