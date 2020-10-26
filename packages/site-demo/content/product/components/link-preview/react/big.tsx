import { LinkPreview, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <div style={{ width: 350 }}>
        <LinkPreview
            title={'Link title'}
            description={'Description'}
            url={'https://google.com'}
            size={Size.big}
            theme={theme}
            thumbnail={'https://picsum.photos/320/240'}
        />
    </div>
);
