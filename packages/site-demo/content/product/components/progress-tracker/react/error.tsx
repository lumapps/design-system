import React from 'react';

import { ProgressTrackerStep } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <ProgressTrackerStep hasError={true} label={'Step'} helper={'Error message'} />
        <ProgressTrackerStep isActive={true} hasError={true} label={'Step'} helper={'Error message'} />
    </div>
);

export default App;
