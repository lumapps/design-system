import { ProgressTracker, ProgressTrackerProvider, ProgressTrackerStep } from '@lumx/react';
import { useState } from 'react';

export const App = () => {
    const [activeStep, setActiveStep] = useState(2);

    const steps = [
        {
            isDisabled: false,
            isComplete: true,
            hasError: false,
        },
        {
            isDisabled: false,
            isComplete: true,
            hasError: false,
        },
        {
            isDisabled: false,
            isComplete: false,
            hasError: true,
        },
        {
            isDisabled: true,
            isComplete: false,
            hasError: false,
        },
        {
            isDisabled: true,
            isComplete: false,
            hasError: false,
        },
    ];

    return (
        <ProgressTrackerProvider activeStepIndex={activeStep} onChange={setActiveStep}>
            <ProgressTracker aria-label="Steps with a linear progression">
                {steps.map((step, index) => (
                    <ProgressTrackerStep
                        key={`step-${index + 1}`}
                        label={`Step ${index + 1}`}
                        helper={index === 2 ? 'Error message' : `Helper text ${index + 1}`}
                        {...step}
                    />
                ))}
            </ProgressTracker>
        </ProgressTrackerProvider>
    );
};
