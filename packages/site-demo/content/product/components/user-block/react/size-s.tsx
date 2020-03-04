import React from 'react';

import { Size, UserBlock } from '@lumx/react';

const App = ({ theme }: any) => {
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                theme={theme}
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/40"
                size={Size.s}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export default App;
