import React from 'react';

import { Size, UserBlock } from '@lumx/react';

const App = ({ theme }) => (
    <div className="demo-grid">
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="http://i.pravatar.cc/72"
            size={Size.m}
            onMouseEnter={() => console.log('Mouse entered')}
            onMouseLeave={() => console.log('Mouse left')}
            onClick={() => console.log('UserBlock clicked')}
        />
    </div>
);

export default App;
