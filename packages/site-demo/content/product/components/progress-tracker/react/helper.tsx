import React from 'react';

import { ProgressTrackerStep } from '@lumx/react';

const App = () => (
    <>
        <ProgressTrackerStep isActive={false} label={'Step'} helper={'Helper text'} />
    </>
);

export default App;
