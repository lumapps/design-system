import { ProgressTrackerStep } from '@lumx/react';

export default () => (
    <>
        <ProgressTrackerStep label="Step" helper="Error message" hasError />
        <ProgressTrackerStep label="Active step" helper="Error message" isActive hasError />
    </>
);
