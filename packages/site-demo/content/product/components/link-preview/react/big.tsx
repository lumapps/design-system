import React from 'react';

import { LinkPreview, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    return (
        <div style={{ width: 350, margin: '0 auto' }}>
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
};

export default App;
