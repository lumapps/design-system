import { LxIcon, LxIconButton } from 'LumX';
import { mdiPlus } from 'LumX/icons';
import React from 'react';

export const App = (): JSX.Element => (
    <div>
        <h1>Design System</h1>
        <LxIconButton color="red">
            <LxIcon icon={mdiPlus} />
        </LxIconButton>
        <LxIconButton href="https://www.lumapps.com" target="_blank">
            <LxIcon icon={mdiPlus} />
        </LxIconButton>
    </div>
);
