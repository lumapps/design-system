import React from 'react';

import { Size, UserBlock } from '@lumx/react';

const App = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <UserBlock
                theme={theme}
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/72"
                size={Size.m}
            />
        </div>
    );
};

export default App;
