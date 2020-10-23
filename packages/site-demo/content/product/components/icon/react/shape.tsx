import React from 'react';

import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <Icon icon={mdiMessageTextOutline} size={Size.s} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.m} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.l} hasShape />
        <Icon icon={mdiMessageTextOutline} size={Size.xl} hasShape />
    </div>
);

export default App;
