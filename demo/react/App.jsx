import React from 'react';

import { LxIcon, LxIconButton } from '../../src/react.index';
import { mdiPlus } from '@lumx/icons';

export const App = () => (
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
