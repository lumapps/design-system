import { Switch } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [state, setState] = useState(false);

    return (
        <>
            <Switch checked={state} onChange={setState} theme={theme}>
                Default
            </Switch>

            <Switch checked={state} onChange={setState} theme={theme} helper="Helper text">
                With helper
            </Switch>

            <Switch disabled checked={state} onChange={setState} theme={theme}>
                Disabled
            </Switch>

            <Switch checked disabled theme={theme}>
                Disabled checked
            </Switch>
        </>
    );
};
