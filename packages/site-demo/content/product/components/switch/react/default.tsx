import { Switch } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [state, setState] = useState(false);

    return (
        <>
            <Switch checked={state} onToggle={setState} theme={theme}>
                Default
            </Switch>

            <Switch checked={state} onToggle={setState} theme={theme} helper="Helper text">
                With helper
            </Switch>

            <Switch disabled checked={state} onToggle={setState} theme={theme}>
                Disabled
            </Switch>

            <Switch checked disabled theme={theme}>
                Disabled checked
            </Switch>
        </>
    );
};

export default App;
