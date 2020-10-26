import { ProgressTrackerStep } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <ProgressTrackerStep label="Step" />
        <ProgressTrackerStep isActive label="Step" />
        <ProgressTrackerStep isComplete label="Step" />
    </>
);
