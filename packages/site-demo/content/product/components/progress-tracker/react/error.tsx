import { ProgressTrackerStep } from '@lumx/react';

export const App = () => (
    <>
        <ProgressTrackerStep label="Step" helper="Error message" hasError />
        <ProgressTrackerStep label="Active step" helper="Error message" isActive hasError />
    </>
);
