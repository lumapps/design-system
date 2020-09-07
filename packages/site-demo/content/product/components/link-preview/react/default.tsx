import { LinkPreview } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <LinkPreview
        title={'Link title'}
        description={'Description'}
        link={'https://google.com'}
        theme={theme}
        thumbnail="/demo-assets/landscape1.jpg"
    />
);
