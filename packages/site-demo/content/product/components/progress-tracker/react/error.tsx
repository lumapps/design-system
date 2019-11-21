import React from 'react';

import { ProgressTrackerStep } from '@lumx/react';

const App = () => (
    <>
        <ProgressTrackerStep hasError={true} label={'Step'} helper={'Error message'} />
    </>
);

export default App;
