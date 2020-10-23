import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <Icon icon={mdiEmail} size={Size.xxs} />
        <Icon icon={mdiEmail} size={Size.xs} />
        <Icon icon={mdiEmail} size={Size.s} />
        <Icon icon={mdiEmail} size={Size.m} />
        <Icon icon={mdiEmail} size={Size.l} />
        <Icon icon={mdiEmail} size={Size.xl} />
    </div>
);

export default App;
