import { ProgressTrackerStep } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <ProgressTrackerStep hasError label="Step" helper="Error message"/>
        <ProgressTrackerStep isActive hasError label="Step" helper="Error message"/>
    </>
);

export default App;
