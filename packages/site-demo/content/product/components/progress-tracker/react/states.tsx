import React from 'react';

import { ProgressTrackerStep } from '@lumx/react';

const App = () => (
    <div className="demo-grid">
        <ProgressTrackerStep isActive={false} label={'Step'} />
        <ProgressTrackerStep isActive={true} label={'Step'} />
        <ProgressTrackerStep isComplete={true} label={'Step'} />
    </div>
);

export default App;
