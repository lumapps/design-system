import { LinkPreview } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <LinkPreview
        title={'Link title'}
        description={'Description'}
        url={'https://google.com'}
        theme={theme}
        thumbnail={'https://picsum.photos/320/240'}
    />
);

export default App;
