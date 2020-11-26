import { ProgressTrackerStep } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <ProgressTrackerStep label="Step" />
        <ProgressTrackerStep isActive label="Active step" />
        <ProgressTrackerStep isComplete label="Complete step" />
    </>
);
