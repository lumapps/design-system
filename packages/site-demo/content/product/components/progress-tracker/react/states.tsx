import React, { useState } from 'react';

import { ProgressTracker, ProgressTrackerStep } from '@lumx/react';

const App = ({ theme }: any) => {
    const [activeIndex, setActiveIndex] = useState(2);

    const stepProps = [
        { label: 'Step 1', isComplete: true },
        { label: 'Step 2', isComplete: true },
        { label: 'Step 3', hasError: true },
        { label: 'Step 4', isComplete: false },
        { label: 'Step 5', isComplete: false },
    ];

    return (
        <>
            <ProgressTracker activeStep={activeIndex} theme={theme}>
                {stepProps.map((step, index) => (
                    <ProgressTrackerStep
                        key={step.label}
                        isActive={activeIndex === index}
                        onClick={index < 3 ? () => setActiveIndex(index) : null}
                        label={step.label}
                        helper={index === 2 ? 'Error message' : `Helper text ${index + 1}`}
                        {...step}
                    />
                ))}
            </ProgressTracker>
        </>
    );
};

export default App;
