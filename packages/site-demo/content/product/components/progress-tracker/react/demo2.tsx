import { ProgressTrackerStep } from '@lumx/react';

export default () => (
    <>
        <ProgressTrackerStep label="Step" />
        <ProgressTrackerStep isActive label="Active step" />
        <ProgressTrackerStep isComplete label="Complete step" />
    </>
);
