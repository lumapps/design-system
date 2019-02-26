import React from 'react';
import { mdiPlus } from '@lumx/icons';
import { LxIcon, LxIconButton } from '@lumx/core';

export const App = (): JSX.Element => (
    <div>
        <h1>Design System</h1>
        <LxIconButton color="red">
            <LxIcon icon={mdiPlus} />
        </LxIconButton>
        <LxIconButton href="https://www.lumapps.com" target="_blank" variant="tertiary">
            <LxIcon icon={mdiPlus} />
        </LxIconButton>
    </div>
);
