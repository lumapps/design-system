import React, { useState } from 'react';

import { Switch } from '@lumx/react';

const App = ({ theme }: any) => {
    const [state, setState] = useState(false);

    return (
        <>
            <div className="lumx-spacing-margin-bottom-big">
                <Switch isChecked={state} onChange={setState} theme={theme}>
                    Default
                </Switch>
            </div>

            <div className="lumx-spacing-margin-bottom-big">
                <Switch isChecked={state} onChange={setState} theme={theme} helper={'Helper text'}>
                    With helper
                </Switch>
            </div>

            <div className="lumx-spacing-margin-bottom-big">
                <Switch isChecked={state} onChange={setState} isDisabled theme={theme}>
                    Disabled
                </Switch>
            </div>

            <Switch isChecked={true} isDisabled theme={theme}>
                Disabled checked
            </Switch>
        </>
    );
};

export default App;
