import { LinkPreview } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <LinkPreview
        title={'Link title'}
        description={'Description'}
        url={'https://google.com'}
        theme={theme}
        thumbnail={'https://picsum.photos/320/240'}
    />
);
