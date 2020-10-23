import { ProgressTrackerStep } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <ProgressTrackerStep hasError label="Step" helper="Error message" />
        <ProgressTrackerStep isActive hasError label="Step" helper="Error message" />
    </>
);
