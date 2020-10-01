import React from 'react';

import { LinkPreview } from '@lumx/react';

const App = ({ theme }: any) => {
    return (
        <LinkPreview
            title={'Link title'}
            description={'Description'}
            url={'https://google.com'}
            theme={theme}
            thumbnail={'https://picsum.photos/320/240'}
        />
    );
};

export default App;
