import { ProgressTrackerStep } from '@lumx/react';

export const App = () => (
    <>
        <ProgressTrackerStep label="Step" />
        <ProgressTrackerStep isActive label="Active step" />
        <ProgressTrackerStep isComplete label="Complete step" />
    </>
);
