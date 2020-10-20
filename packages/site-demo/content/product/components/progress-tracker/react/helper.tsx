import React from 'react';

import { ProgressTrackerStep } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <ProgressTrackerStep isActive={false} label={'Step'} helper={'Helper text'} />
    </div>
);

export default App;
