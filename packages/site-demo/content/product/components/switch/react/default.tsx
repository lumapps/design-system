import { Switch } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [state, setState] = useState(false);

    return (
        <>
            <Switch isChecked={state} onChange={setState} theme={theme}>
                Default
            </Switch>

            <Switch isChecked={state} onChange={setState} theme={theme} helper="Helper text">
                With helper
            </Switch>

            <Switch isDisabled isChecked={state} onChange={setState} theme={theme}>
                Disabled
            </Switch>

            <Switch isChecked isDisabled theme={theme}>
                Disabled checked
            </Switch>
        </>
    );
};
