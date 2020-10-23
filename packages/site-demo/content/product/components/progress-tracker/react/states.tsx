import { ProgressTrackerStep } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <ProgressTrackerStep label="Step"/>
        <ProgressTrackerStep isActive label="Step"/>
        <ProgressTrackerStep isComplete label="Step"/>
    </>
);

export default App;
