import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Icon icon={mdiEmail} theme={theme} size={Size.xxs} />
        <Icon icon={mdiEmail} theme={theme} size={Size.xs} />
        <Icon icon={mdiEmail} theme={theme} size={Size.s} />
        <Icon icon={mdiEmail} theme={theme} size={Size.m} />
        <Icon icon={mdiEmail} theme={theme} size={Size.l} />
        <Icon icon={mdiEmail} theme={theme} size={Size.xl} />
    </>
);

export default App;
