import { ProgressTracker, ProgressTrackerStep } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/progress-tracker/Progress Tracker' };

export const simpleSteps = ({ theme }: any) => (
    <ProgressTracker theme={theme}>
        <ProgressTrackerStep theme={theme} onClick={noop} label={text('label', 'First step')} />
        <ProgressTrackerStep theme={theme} onClick={noop} label={`Second Step`} />
        <ProgressTrackerStep theme={theme} onClick={noop} label={`Third Step`} />
    </ProgressTracker>
);

export const stepsWithHelper = ({ theme }: any) => (
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

export const stepsWithError = ({ theme }: any) => (
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

export const stepsCompletedWithError = ({ theme }: any) => (
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
