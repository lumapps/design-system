import { ProgressTracker, ProgressTrackerStep } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'Progress Tracker' };

export const SimpleSteps = ({ theme }: any) => (
    <ProgressTracker theme={theme}>
        <ProgressTrackerStep theme={theme} onClick={noop} label={text('label', 'First step')} />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Second Step" />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Third Step" />
    </ProgressTracker>
);

export const StepsWithHelper = ({ theme }: any) => (
    <ProgressTracker activeStep={1} theme={theme}>
        <ProgressTrackerStep
            theme={theme}
            onClick={noop}
            label={text('label', 'First step')}
            helper={text('helper', 'your data')}
            isComplete
        />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Second Step" helper="payment" />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Third Step" />
    </ProgressTracker>
);

export const StepsWithError = ({ theme }: any) => (
    <ProgressTracker activeStep={1} theme={theme}>
        <ProgressTrackerStep theme={theme} onClick={noop} label="First Step" helper="your data" isComplete />
        <ProgressTrackerStep
            theme={theme}
            onClick={noop}
            label={text('label', 'Second step with error')}
            helper={text('helper', 'Second step helper')}
            hasError
        />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Third Step" />
    </ProgressTracker>
);

export const StepsCompletedWithError = ({ theme }: any) => (
    <ProgressTracker activeStep={2} theme={theme}>
        <ProgressTrackerStep theme={theme} onClick={noop} label="First Step" helper="your data" isComplete />
        <ProgressTrackerStep
            theme={theme}
            onClick={noop}
            label={text('label', 'Second step with error')}
            helper={text('helper', 'Second step helper')}
            hasError
            isComplete
        />
        <ProgressTrackerStep theme={theme} onClick={noop} label="Third Step" />
    </ProgressTracker>
);
