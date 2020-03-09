import React from 'react';

import { Size, UserBlock } from '@lumx/react';

const App = ({ theme }: any) => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);
    return (
        <div className="demo-grid">
            <UserBlock
                theme={theme}
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar={{ image: 'http://i.pravatar.cc/72' }}
                size={Size.m}
                onMouseEnter={logAction('Mouse entered')}
                onMouseLeave={logAction('Mouse left')}
                onClick={logAction('UserBlock clicked')}
            />
        </div>
    );
};

export default App;
